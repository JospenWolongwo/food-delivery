import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { Request } from 'express';
import { User, UserRole } from '../../users/entities/user.entity';

// Define interface for authenticated request
interface AuthRequest extends Request {
  user: User & { id: number; role: UserRole };
}

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { OrdersService } from '../services/orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderFilterDto, AssignDeliveryAgentDto } from '../dto/order.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders (Admin or Vendor only)' })
  @ApiResponse({ status: 200, description: 'Return all orders with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'customerId', required: false, type: Number })
  @ApiQuery({ name: 'vendorId', required: false, type: Number })
  @ApiQuery({ name: 'deliveryAgentId', required: false, type: Number })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() filterDto: OrderFilterDto,
    @Req() req: AuthRequest,
  ) {
    // Check if user has necessary role
    const allowedRoles = [UserRole.ADMIN, UserRole.VENDOR];
    if (!allowedRoles.includes(req.user.role)) {
      return {
        statusCode: 403,
        message: 'Forbidden: Insufficient permissions',
      };
    }
    
    // If user is a vendor, force filter by their vendorId
    if (req.user.role === UserRole.VENDOR) {
      filterDto.vendorId = req.user.id;
    }
    
    return this.ordersService.findAll(page, limit, filterDto);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders for the current customer' })
  @ApiResponse({ status: 200, description: 'Return orders for the current customer' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMyOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: AuthRequest,
  ) {
    return this.ordersService.findByCustomer(req.user.id, page, limit);
  }

  @Get('delivery')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders for the current delivery agent' })
  @ApiResponse({ status: 200, description: 'Return orders for the current delivery agent' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getDeliveryOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: AuthRequest,
  ) {
    // Check if user is a delivery agent
    if (req.user.role !== UserRole.DELIVERY_AGENT) {
      return {
        statusCode: 403,
        message: 'Forbidden: Only delivery agents can access this endpoint',
      };
    }
    
    const filterDto: OrderFilterDto = { deliveryAgentId: req.user.id };
    return this.ordersService.findAll(page, limit, filterDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Return the order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    // Implement authorization - only admin, vendor, assigned delivery agent, or the customer can view the order
    const order = await this.ordersService.findOne(id);
    
    // Check if user is authorized to view this order
    const isAdmin = req.user.role === UserRole.ADMIN;
    const isVendor = req.user.role === UserRole.VENDOR;
    const isDeliveryAgent = req.user.role === UserRole.DELIVERY_AGENT && 
                            order.deliveryAgent?.id === req.user.id;
    const isCustomer = order.customer.id === req.user.id;
    
    if (!(isAdmin || isVendor || isDeliveryAgent || isCustomer)) {
      return {
        statusCode: 403,
        message: 'Forbidden: You are not authorized to view this order',
      };
    }
    
    return order;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order has been created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: AuthRequest) {
    // Only customers can create orders
    if (req.user.role !== UserRole.CUSTOMER) {
      return {
        statusCode: 403,
        message: 'Forbidden: Only customers can create orders',
      };
    }
    
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status has been updated' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Req() req: AuthRequest,
  ) {
    return this.ordersService.updateStatus(
      id,
      updateOrderStatusDto,
      req.user.id,
      req.user.role,
    );
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign delivery agent to order (Admin only)' })
  @ApiResponse({ status: 200, description: 'Delivery agent has been assigned' })
  @ApiResponse({ status: 404, description: 'Order or delivery agent not found' })
  async assignDeliveryAgent(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignDto: AssignDeliveryAgentDto,
    @Req() req: AuthRequest,
  ) {
    // Only admin can assign delivery agents
    if (req.user.role !== UserRole.ADMIN) {
      return {
        statusCode: 403,
        message: 'Forbidden: Only administrators can assign delivery agents',
      };
    }
    
    return this.ordersService.assignDeliveryAgent(id, assignDto);
  }

  @Delete(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order has been cancelled' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async cancelOrder(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    return this.ordersService.cancelOrder(id, req.user.id, req.user.role);
  }
}
