import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Custom fetch function with detailed logging
const customFetch = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  // Log the full request URL and method
  const url = input.toString();
  console.log(`API Request: ${init?.method || "GET"} ${url}`);

  // Log request headers if they exist
  if (init?.headers) {
    console.log("Request Headers:", JSON.stringify(init.headers, null, 2));
  }

  // Log request body if it exists
  if (init?.body) {
    console.log("Request Body:", init.body);
  }

  const response = await fetch(input, init);
  console.log("API Response Status:", response.status, response.statusText);

  // Clone the response to read it and still return it
  const responseClone = response.clone();

  // Log response data without affecting the response stream
  try {
    const data = await response.json();
    console.log("API Response Data:", data);
  } catch (error) {
    const text = await response.text();
    console.log("API Response (non-JSON):", text);
  }

  return responseClone;
};

// Define a base API service
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    fetchFn: customFetch,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Meal", "Order", "Vendor", "Subscription"],
  keepUnusedDataFor: 30,
  endpoints: () => ({}),
});
