import { api } from './index';

export interface OrderItem {
  id: number;
  mealId: number;
  quantity: number;
  price: number;
  meal: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  items: Array<{
    mealId: number;
    quantity: number;
  }>;
  deliveryAddress: string;
  paymentMethod: string;
  specialInstructions?: string;
}

export interface UpdateOrderStatusRequest {
  status: Order['status'];
}

// Helper function to ensure all numeric IDs are strings
const stringifyNumericIds = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => stringifyNumericIds(item));
  } else if (data && typeof data === 'object') {
    return Object.entries(data).reduce((acc, [key, value]) => {
      // Convert numeric IDs to strings
      if ((key.endsWith('Id') || key === 'id') && typeof value === 'number') {
        acc[key] = String(value);
      } else if (value && typeof value === 'object') {
        acc[key] = stringifyNumericIds(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
  }
  return data;
};

// Create the order API by injecting endpoints
export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => {
        // Get token from localStorage first, then from Redux state
        const token = localStorage.getItem('token') || '';
        const authState = JSON.parse(localStorage.getItem('authState') || '{}');
        const userId = authState?.user?.id;
        
        console.log('Fetching orders with:', { 
          hasToken: !!token,
          userId,
          token: token ? 'Token exists' : 'No token found',
          authState: authState ? 'Auth state exists' : 'No auth state'
        });
        
        // Ensure we have a valid token and user ID
        if (!token || !userId) {
          console.error('Missing authentication data:', { tokenExists: !!token, userId });
        }
        
        return {
          url: '/orders/me',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          // Add user ID as a query parameter if needed by the backend
          params: stringifyNumericIds({
            userId: userId // Ensure userId is a string
          }),
          // Log the full request for debugging
          validateStatus: (response, body) => {
            console.log('Orders API Response:', { 
              status: response.status, 
              url: response.url,
              headers: response.headers,
              body 
            });
            return response.status >= 200 && response.status < 300;
          },
        };
      },
      providesTags: ['Order'],
      transformErrorResponse: (response, meta) => {
        console.error('Error in transformErrorResponse:', {
          status: response.status,
          data: response.data,
          originalStatus: response.originalStatus,
          meta: {
            request: meta?.request,
            response: meta?.response
          }
        });
        return response;
      },
    }),
    
    getOrder: builder.query<Order, string>({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),
    
    updateOrderStatus: builder.mutation<Order, { orderId: string; status: UpdateOrderStatusRequest }>({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PATCH',
        body: status,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
      ],
    }),
    
    cancelOrder: builder.mutation<Order, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

// Export hooks for usage in functional components
export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = orderApi;
