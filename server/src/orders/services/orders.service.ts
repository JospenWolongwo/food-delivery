import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Order, OrderStatus } from '../entities/order.entity';
import { User, UserRole } from '../../users/entities/user.entity';
import { Meal } from '../../meals/entities/meal.entity';
import { CreateOrderDto, UpdateOrderStatusDto, OrderFilterDto, AssignDeliveryAgentDto } from '../dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Meal)
    private mealsRepository: Repository<Meal>,
  ) {}

  async findAll(page = 1, limit = 10, filterDto?: OrderFilterDto) {
    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.deliveryAgent', 'deliveryAgent')
      .leftJoinAndSelect('order.meals', 'meals');
    
    // Apply filters if provided
    if (filterDto) {
      if (filterDto.status) {
        queryBuilder.andWhere('order.status = :status', { status: filterDto.status });
      }
      
      if (filterDto.customerId) {
        queryBuilder.andWhere('customer.id = :customerId', { customerId: filterDto.customerId });
      }
      
      if (filterDto.deliveryAgentId) {
        queryBuilder.andWhere('deliveryAgent.id = :deliveryAgentId', { deliveryAgentId: filterDto.deliveryAgentId });
      }
      
      if (filterDto.vendorId) {
        // This requires joining with meals and their vendors
        queryBuilder
          .innerJoin('meals.vendor', 'vendor')
          .andWhere('vendor.id = :vendorId', { vendorId: filterDto.vendorId });
      }
    }
    
    // Add pagination
    queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    
    const [orders, total] = await queryBuilder.getManyAndCount();
    
    // Format the response to include only necessary information
    const formattedOrders = orders.map(order => {
      // Security: Remove sensitive customer information
      const { password, ...customerInfo } = order.customer;
      
      // Format delivery agent info if present
      let deliveryAgentInfo = null;
      if (order.deliveryAgent) {
        const { password, ...agentInfo } = order.deliveryAgent;
        deliveryAgentInfo = agentInfo;
      }
      
      return {
        ...order,
        customer: customerInfo,
        deliveryAgent: deliveryAgentInfo,
      };
    });
    
    return {
      data: formattedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer', 'deliveryAgent', 'meals'],
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    // Security: Remove sensitive customer information
    const { password: customerPassword, ...customerInfo } = order.customer;
    
    // Format delivery agent info if present
    let deliveryAgentInfo = null;
    if (order.deliveryAgent) {
      const { password: agentPassword, ...agentInfo } = order.deliveryAgent;
      deliveryAgentInfo = agentInfo;
    }
    
    return {
      ...order,
      customer: customerInfo,
      deliveryAgent: deliveryAgentInfo,
    };
  }

  async findByCustomer(customerId: number, page = 1, limit = 10) {
    const customer = await this.usersRepository.findOne({
      where: { id: customerId },
    });
    
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }
    
    const [orders, total] = await this.ordersRepository.findAndCount({
      where: { customer: { id: customerId } },
      relations: ['meals', 'deliveryAgent'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    
    // Format the response
    const formattedOrders = orders.map(order => {
      // Format delivery agent info if present
      let deliveryAgentInfo = null;
      if (order.deliveryAgent) {
        const { password, ...agentInfo } = order.deliveryAgent;
        deliveryAgentInfo = agentInfo;
      }
      
      return {
        ...order,
        deliveryAgent: deliveryAgentInfo,
        // Customer info is not needed since we know it's for this customer
        customer: undefined,
      };
    });
    
    return {
      data: formattedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(customerId: number, createOrderDto: CreateOrderDto) {
    const customer = await this.usersRepository.findOne({
      where: { id: customerId },
    });
    
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }
    
    // Validate and get meals
    const mealIds = createOrderDto.items.map(item => item.mealId);
    const meals = await this.mealsRepository.find({
      where: { id: In(mealIds) },
    });
    
    // Check if all meals exist and are available
    if (meals.length !== mealIds.length) {
      throw new BadRequestException('One or more meals not found or not available');
    }
    
    // Create a map of meal IDs to meals for easier access
    const mealMap = new Map(meals.map(meal => [meal.id, meal]));
    
    // Calculate total amount and prepare order items
    let totalAmount = 0;
    const orderItems = createOrderDto.items.map(item => {
      const meal = mealMap.get(item.mealId);
      if (!meal) {
        throw new Error(`Meal with id ${item.mealId} not found`);
      }
      totalAmount += meal.price * item.quantity;
      
      return {
        mealId: item.mealId,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
      };
    });
    
    // Create the order
    const newOrder = this.ordersRepository.create({
      customer,
      meals,
      orderItems,
      totalAmount,
      status: OrderStatus.PENDING,
      deliveryAddress: createOrderDto.deliveryAddress,
      deliveryNotes: createOrderDto.deliveryNotes,
    });
    
    const savedOrder = await this.ordersRepository.save(newOrder);
    
    // Security: Remove sensitive customer information
    const { password, ...customerInfo } = savedOrder.customer;
    
    return {
      ...savedOrder,
      customer: customerInfo,
    };
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto, userId: number, userRole: UserRole) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer', 'deliveryAgent', 'meals'],
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    // Check authorization for status update
    // Only admin, vendor, assigned delivery agent, or the customer can update the status
    const isAuthorized = 
      userRole === UserRole.ADMIN ||
      userRole === UserRole.VENDOR ||
      (userRole === UserRole.DELIVERY_AGENT && order.deliveryAgent?.id === userId) ||
      (userRole === UserRole.CUSTOMER && order.customer.id === userId);
    
    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized to update this order status');
    }
    
    // Enforce status transition rules
    const isValidTransition = this.isValidStatusTransition(
      order.status,
      updateOrderStatusDto.status,
      userRole
    );
    
    if (!isValidTransition) {
      throw new BadRequestException(`Invalid status transition from ${order.status} to ${updateOrderStatusDto.status} for ${userRole}`);
    }
    
    // Update the status
    order.status = updateOrderStatusDto.status;
    
    const updatedOrder = await this.ordersRepository.save(order);
    
    // Security: Remove sensitive customer information
    const { password: customerPassword, ...customerInfo } = updatedOrder.customer;
    
    // Format delivery agent info if present
    let deliveryAgentInfo = null;
    if (updatedOrder.deliveryAgent) {
      const { password: agentPassword, ...agentInfo } = updatedOrder.deliveryAgent;
      deliveryAgentInfo = agentInfo;
    }
    
    return {
      ...updatedOrder,
      customer: customerInfo,
      deliveryAgent: deliveryAgentInfo,
    };
  }

  async assignDeliveryAgent(id: number, assignDto: AssignDeliveryAgentDto) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    const deliveryAgent = await this.usersRepository.findOne({
      where: { id: assignDto.deliveryAgentId, role: UserRole.DELIVERY_AGENT },
    });
    
    if (!deliveryAgent) {
      throw new NotFoundException(`Delivery agent with ID ${assignDto.deliveryAgentId} not found`);
    }
    
    // Assign the delivery agent
    order.deliveryAgent = deliveryAgent;
    
    // If the order is confirmed, update the status to preparing
    if (order.status === OrderStatus.CONFIRMED) {
      order.status = OrderStatus.PREPARING;
    }
    
    const updatedOrder = await this.ordersRepository.save(order);
    
    // Security: Remove sensitive information
    const { password: customerPassword, ...customerInfo } = updatedOrder.customer;
    const { password: agentPassword, ...agentInfo } = deliveryAgent;
    
    return {
      ...updatedOrder,
      customer: customerInfo,
      deliveryAgent: agentInfo,
    };
  }

  async cancelOrder(id: number, userId: number, userRole: UserRole) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    // Check if the user is authorized to cancel the order
    const isAuthorized = 
      userRole === UserRole.ADMIN ||
      (userRole === UserRole.CUSTOMER && order.customer.id === userId);
    
    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized to cancel this order');
    }
    
    // Check if the order is in a cancellable state
    const cancellableStatuses = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING,
    ];
    
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestException(`Cannot cancel order in ${order.status} status`);
    }
    
    // Update the status to cancelled
    order.status = OrderStatus.CANCELLED;
    
    const updatedOrder = await this.ordersRepository.save(order);
    
    // Security: Remove sensitive customer information
    const { password, ...customerInfo } = updatedOrder.customer;
    
    return {
      ...updatedOrder,
      customer: customerInfo,
    };
  }

  // Helper method to check if a status transition is valid
  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus, userRole: UserRole): boolean {
    // Define valid transitions based on current status and user role
    const validTransitions: Record<OrderStatus, Record<UserRole, OrderStatus[]>> = {
      [OrderStatus.PENDING]: {
        [UserRole.ADMIN]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
        [UserRole.CUSTOMER]: [OrderStatus.CANCELLED],
        [UserRole.VENDOR]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
        [UserRole.DELIVERY_AGENT]: [],
      },
      [OrderStatus.CONFIRMED]: {
        [UserRole.ADMIN]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
        [UserRole.CUSTOMER]: [OrderStatus.CANCELLED],
        [UserRole.VENDOR]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
        [UserRole.DELIVERY_AGENT]: [],
      },
      [OrderStatus.PREPARING]: {
        [UserRole.ADMIN]: [OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED],
        [UserRole.CUSTOMER]: [OrderStatus.CANCELLED],
        [UserRole.VENDOR]: [OrderStatus.READY_FOR_PICKUP],
        [UserRole.DELIVERY_AGENT]: [],
      },
      [OrderStatus.READY_FOR_PICKUP]: {
        [UserRole.ADMIN]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELLED],
        [UserRole.CUSTOMER]: [],
        [UserRole.VENDOR]: [],
        [UserRole.DELIVERY_AGENT]: [OrderStatus.OUT_FOR_DELIVERY],
      },
      [OrderStatus.OUT_FOR_DELIVERY]: {
        [UserRole.ADMIN]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
        [UserRole.CUSTOMER]: [],
        [UserRole.VENDOR]: [],
        [UserRole.DELIVERY_AGENT]: [OrderStatus.DELIVERED],
      },
      [OrderStatus.DELIVERED]: {
        [UserRole.ADMIN]: [],
        [UserRole.CUSTOMER]: [],
        [UserRole.VENDOR]: [],
        [UserRole.DELIVERY_AGENT]: [],
      },
      [OrderStatus.CANCELLED]: {
        [UserRole.ADMIN]: [],
        [UserRole.CUSTOMER]: [],
        [UserRole.VENDOR]: [],
        [UserRole.DELIVERY_AGENT]: [],
      },
    };
    
    return validTransitions[currentStatus]?.[userRole]?.includes(newStatus) ?? false;
  }
}
