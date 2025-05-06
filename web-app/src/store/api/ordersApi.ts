import { api } from './index';
import { Meal } from './mealsApi';

// Define types for order requests and responses
export interface OrderItem {
  mealId: number;
  quantity: number;
  specialInstructions?: string;
  meal?: Meal; // Populated when getting order details
}

export interface CreateOrderDto {
  items: OrderItem[];
  deliveryAddress?: string;
  deliveryInstructions?: string;
  paymentMethodId?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  estimatedDeliveryTime?: Date;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  deliveryAgentId?: number;
  deliveryAgent?: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
  paymentId?: number;
  payment?: {
    id: number;
    method: string;
    status: string;
    amount: number;
    transactionId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilterParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  sort?: string;
}

export interface PaginatedOrdersResponse {
  items: Order[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

// Extend the base API with order-specific endpoints
export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // For all users to get their own orders
    getMyOrders: builder.query<PaginatedOrdersResponse, OrderFilterParams | void>({
      query: (params = {}) => ({
        url: '/orders/my-orders',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order' as const, id: 'MY_LIST' },
            ]
          : [{ type: 'Order' as const, id: 'MY_LIST' }],
    }),
    
    // Get a specific order by ID
    getOrderById: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order' as const, id }],
    }),
    
    // Create a new order
    createOrder: builder.mutation<Order, CreateOrderDto>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: [{ type: 'Order', id: 'MY_LIST' }],
    }),
    
    // Cancel an order
    cancelOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'MY_LIST' },
      ],
    }),
    
    // For delivery agents to get their assigned orders
    getDeliveryOrders: builder.query<PaginatedOrdersResponse, OrderFilterParams | void>({
      query: (params = {}) => ({
        url: '/orders/delivery-orders',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order' as const, id: 'DELIVERY_LIST' },
            ]
          : [{ type: 'Order' as const, id: 'DELIVERY_LIST' }],
    }),
    
    // For admin and vendors to get all orders
    getAllOrders: builder.query<PaginatedOrdersResponse, OrderFilterParams | void>({
      query: (params = {}) => ({
        url: '/orders',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order' as const, id: 'ALL_LIST' },
            ]
          : [{ type: 'Order' as const, id: 'ALL_LIST' }],
    }),
    
    // Update order status (for vendors/admins)
    updateOrderStatus: builder.mutation<Order, { id: number; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'MY_LIST' },
        { type: 'Order', id: 'ALL_LIST' },
        { type: 'Order', id: 'DELIVERY_LIST' },
      ],
    }),
  }),
  
  overrideExisting: false,
});

// Export auto-generated hooks for the endpoints
export const {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useGetDeliveryOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
