import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../lib/constants';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: [
    'User',
    'Users',
    'Products',
    'Product',
    'Categories',
    'Cart',
    'Orders',
    'Order',
    'Vendors',
    'Vendor',
    'Reviews',
    'Dashboard',
  ],
  endpoints: () => ({}),
});
