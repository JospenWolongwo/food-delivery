import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../store/api/orderApi';
import { format } from 'date-fns';
import { ClockIcon, CheckCircleIcon, XCircleIcon, TruckIcon } from '@heroicons/react/24/outline';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';

interface OrderItem {
  id: number;
  meal: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
}

const statusConfig: Record<OrderStatus, { color: string; icon: React.ElementType }> = {
  PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon },
  PREPARING: { color: 'bg-indigo-100 text-indigo-800', icon: ClockIcon },
  ON_THE_WAY: { color: 'bg-purple-100 text-purple-800', icon: TruckIcon },
  DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
};

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const { data: orders = [], isLoading, isError, error } = useGetOrdersQuery(undefined, {
    // Force refetch on mount to ensure we have fresh data
    refetchOnMountOrArgChange: true,
  });
  
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter((order: Order) => order.status === activeTab);
    
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error('Error fetching orders:', error);
    let errorMessage = 'Failed to load orders. Please try again later.';
    
    // Check if this is a 400 error with a message
    if (error && 'status' in error && error.status === 400) {
      errorMessage = 'Invalid request. Please check your authentication and try again.';
      
      // Log additional debug info
      console.log('Error details:', {
        status: error.status,
        data: error.data,
        originalStatus: error.originalStatus,
      });
    }
    
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading orders</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errorMessage}</p>
                  {process.env.NODE_ENV === 'development' && error && 'data' in error && (
                    <div className="mt-2 p-2 bg-red-100 rounded">
                      <p className="text-xs font-mono">
                        {JSON.stringify(error.data, null, 2)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    const { color, icon: Icon } = statusConfig[status] || {};
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Failed to load orders. Please try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your order history
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/meals"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Order Food
            </Link>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Orders
              </button>
              {Object.entries(statusConfig).map(([status, { color }]) => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status as OrderStatus)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === status
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {status.replace(/_/g, ' ')}
                </button>
              ))}
            </nav>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'all'
                    ? 'You have not placed any orders yet.'
                    : `You don't have any ${activeTab.toLowerCase().replace(/_/g, ' ')} orders.`}
                </p>
                <div className="mt-6">
                  <Link
                    to="/meals"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Order Food
                  </Link>
                </div>
              </div>
            ) : (
              filteredOrders.map((order: Order) => (
                <div key={order.id} className="p-6">
                  <div className="md:flex md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Placed on {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="sr-only">Items</h4>
                    <ul className="divide-y divide-gray-200">
                      {order.items.slice(0, 2).map((item) => (
                        <li key={item.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {item.meal.imageUrl ? (
                                <img
                                  className="w-20 h-20 rounded-md object-cover"
                                  src={item.meal.imageUrl}
                                  alt={item.meal.name}
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-md bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">No image</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.meal.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                      {order.items.length > 2 && (
                        <li className="py-2 text-center">
                          <span className="text-sm text-gray-500">
                            +{order.items.length - 2} more items
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-500">Delivery to:</p>
                      <p className="font-medium text-gray-900">
                        {order.deliveryAddress || 'No address provided'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total amount</p>
                      <p className="text-lg font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
