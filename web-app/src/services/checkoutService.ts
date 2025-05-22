import { CartItem } from "../store/slices/cartSlice";

/**
 * Configuration for API endpoints
 * This should be updated when the backend is ready
 */
// Get environment variables safely with fallbacks
const getEnvVariable = (key: string, fallback: string): string => {
  try {
    // @ts-ignore - Vite specific environment variables
    return (import.meta.env?.[key] || fallback) as string;
  } catch (e) {
    return fallback;
  }
};

const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: getEnvVariable("VITE_API_URL", "http://localhost:3001/api"),
  // Endpoints for different operations
  ENDPOINTS: {
    HEALTH: "/health",
    ORDERS: "/orders",
    PAYMENT_VALIDATION: "/payments/validate",
    PAYMENT_PROCESS: "/payments/process",
    USER: "/users/me",
    DELIVERY_ESTIMATE: "/delivery/estimate",
  },
  // Timeout for API requests in milliseconds
  TIMEOUT: 15000,
};

// Environments
type Environment = "development" | "test" | "production";

// Types for checkout service
export interface DeliveryDetails {
  address: string;
  campus: string;
  building: string;
  roomNumber: string;
  phoneNumber: string;
  deliveryInstructions: string;
  deliveryTime: string;
}

export interface PaymentDetails {
  method: "credit-card" | "mobile-money" | "cash" | "";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  mobileMoneyProvider?: string;
  mobileMoneyNumber?: string;
}

export interface OrderResponse {
  success: boolean;
  orderNumber: string;
  estimatedDelivery: {
    minMinutes: number;
    maxMinutes: number;
  };
  error?: string;
  transactionId?: string;
}

export interface CheckoutData {
  deliveryDetails: DeliveryDetails;
  paymentDetails: PaymentDetails;
  items: CartItem[];
  total: number;
  userId?: number;
}

/**
 * HTTP request wrapper with timeout and error handling
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns Promise with the response data
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Utility to get the current environment
 */
const getEnvironment = (): Environment => {
  // Try to get environment using Vite's approach
  try {
    // @ts-ignore - Vite specific
    const mode = import.meta.env?.MODE;
    if (mode === "test") return "test";
    if (mode === "production") return "production";
  } catch (e) {
    // Fallback to Node approach if Vite's approach fails
    if (process.env.NODE_ENV === "test") return "test";
    if (process.env.NODE_ENV === "production") return "production";
  }
  return "development";
};

/**
 * Utility to check if the app is running in a development environment
 */
const isDevelopment = (): boolean => {
  return getEnvironment() === "development";
};

/**
 * Utility to check if the backend is available
 * In a real application, this might ping a health endpoint
 */
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // Short timeout for health check
        signal: AbortSignal.timeout(3000),
      }
    );
    return response.ok;
  } catch (error) {
    console.warn("Backend health check failed:", error);
    return false;
  }
};

/**
 * Service to handle checkout operations
 * Will use real API in production and fall back to mock data in development
 */
class CheckoutService {
  /**
   * Place an order with the provided checkout data
   * @param checkoutData - The complete checkout data including delivery, payment and items
   * @returns Promise with the order response
   *
   * Backend API: POST /api/orders
   * Request body: CheckoutData
   * Response: OrderResponse
   */
  async placeOrder(checkoutData: CheckoutData): Promise<OrderResponse> {
    // Check if we should use mock data
    const useMockData = isDevelopment() && !(await isBackendAvailable());

    if (useMockData) {
      console.info("[Checkout Service] Using mock data for order placement");
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Return mock order response
      return {
        success: true,
        orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        estimatedDelivery: {
          minMinutes: 30,
          maxMinutes: 45,
        },
        transactionId: `TXN-${Date.now()}`,
      };
    } else {
      // Real API implementation
      try {
        console.info("[Checkout Service] Placing order with backend API");
        // Real API call
        const data = await fetchWithTimeout(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(checkoutData),
          }
        );

        return {
          success: true,
          orderNumber: data.orderNumber,
          estimatedDelivery: data.estimatedDelivery,
          transactionId: data.transactionId,
        };
      } catch (error) {
        console.error("[Checkout Service] Order placement failed:", error);
        // For now, return mock data until backend is ready
        if (isDevelopment()) {
          console.info(
            "[Checkout Service] Falling back to mock data due to API error"
          );
          await new Promise((resolve) => setTimeout(resolve, 1500));
          return {
            success: true,
            orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
            estimatedDelivery: {
              minMinutes: 30,
              maxMinutes: 45,
            },
            transactionId: `TXN-${Date.now()}`,
          };
        }

        return {
          success: false,
          orderNumber: "",
          estimatedDelivery: {
            minMinutes: 0,
            maxMinutes: 0,
          },
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        };
      }
    }
  }

  /**
   * Validate payment details with payment processor
   * @param paymentDetails - The payment details to validate
   * @returns Promise with validation result
   *
   * Backend API: POST /api/payments/validate
   * Request body: PaymentDetails
   * Response: { valid: boolean, message?: string }
   */
  async validatePayment(
    paymentDetails: PaymentDetails
  ): Promise<{ valid: boolean; message?: string }> {
    // For development, always return valid payment
    if (isDevelopment() && !(await isBackendAvailable())) {
      console.info("[Checkout Service] Using mock data for payment validation");
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { valid: true };
    }

    // In production, this would connect to a payment processor
    try {
      console.info("[Checkout Service] Validating payment with backend API");
      const data = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENT_VALIDATION}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentDetails),
        }
      );

      return {
        valid: data.valid,
        message: data.message,
      };
    } catch (error) {
      console.error("[Checkout Service] Payment validation failed:", error);
      // For development fallback
      if (isDevelopment()) {
        return { valid: true };
      }

      return {
        valid: false,
        message:
          error instanceof Error ? error.message : "Payment validation failed",
      };
    }
  }

  /**
   * Get estimated delivery time based on delivery details
   * @param deliveryDetails - The delivery details to use for estimation
   * @returns Promise with estimated delivery time
   *
   * Backend API: POST /api/delivery/estimate
   * Request body: DeliveryDetails
   * Response: { minMinutes: number, maxMinutes: number }
   */
  async getDeliveryEstimate(deliveryDetails: DeliveryDetails): Promise<{
    minMinutes: number;
    maxMinutes: number;
  }> {
    if (isDevelopment() && !(await isBackendAvailable())) {
      console.info("[Checkout Service] Using mock data for delivery estimate");
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        minMinutes: 30,
        maxMinutes: 45,
      };
    }

    try {
      console.info(
        "[Checkout Service] Getting delivery estimate from backend API"
      );
      const data = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELIVERY_ESTIMATE}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deliveryDetails),
        }
      );

      return {
        minMinutes: data.minMinutes,
        maxMinutes: data.maxMinutes,
      };
    } catch (error) {
      console.error(
        "[Checkout Service] Failed to get delivery estimate:",
        error
      );
      // Default fallback
      return {
        minMinutes: 30,
        maxMinutes: 45,
      };
    }
  }

  /**
   * Get mock data for testing and development
   */
  getMockCartItems(): CartItem[] {
    return [
      {
        mealId: 1,
        name: "Ndolé with Plantains",
        price: 3500,
        quantity: 2,
        imageUrl: "/meals/ndole.jpg",
        vendorName: "Mama Africa Kitchen",
        specialInstructions: "Extra spicy please",
      },
      {
        mealId: 2,
        name: "Jollof Rice with Chicken",
        price: 3000,
        quantity: 1,
        imageUrl: "/meals/jollof-rice.jpg",
        vendorName: "Mama Africa Kitchen",
      },
    ];
  }

  /**
   * Get mock user data for testing and development
   */
  getMockUser() {
    return {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      phoneNumber: "237612345678",
    };
  }
}

// Export singleton instance
export const checkoutService = new CheckoutService();

// Export default for mocking in tests
export default CheckoutService;
