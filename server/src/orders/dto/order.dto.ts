import { IsNumber, IsString, IsEnum, IsArray, ValidateNested, IsOptional, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export class OrderItemDto {
  @IsNumber()
  @Type(() => Number)
  mealId: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsString({ each: true })
  specialInstructions?: string[];
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsString()
  deliveryNotes?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class AssignDeliveryAgentDto {
  @IsNumber()
  @Type(() => Number)
  deliveryAgentId: number;
}

export class OrderResponseDto {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress?: string;
  deliveryNotes?: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  items: {
    meal: {
      id: number;
      name: string;
      price: number;
    };
    quantity: number;
    specialInstructions?: string[];
  }[];
  deliveryAgent?: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class OrdersPageResponseDto {
  data: OrderResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class OrderFilterDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deliveryAgentId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  vendorId?: number;
}
