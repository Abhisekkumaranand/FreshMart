import { baseApi } from '../../api/baseApi';

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendorDashboard: builder.query({
      query: () => '/vendor/dashboard',
      providesTags: ['Dashboard'],
    }),
    getVendorAnalytics: builder.query({
      query: (params) => ({
        url: '/vendor/analytics',
        params,
      }),
      providesTags: ['Dashboard'],
    }),
    getVendorProfile: builder.query({
      query: () => '/vendor/store-profile',
      providesTags: ['Vendor'],
    }),
    updateVendorProfile: builder.mutation({
      query: (data) => ({
        url: '/vendor/store-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Vendor'],
    }),
    getVendorProducts: builder.query({
      query: (params) => ({
        url: '/vendor/products',
        params,
      }),
      providesTags: [{ type: 'Products', id: 'VENDOR_LIST' }],
    }),
    getVendorOrders: builder.query({
      query: (params) => ({
        url: '/vendor/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),
    getLowStockProducts: builder.query({
      query: () => '/vendor/products/low-stock',
      providesTags: [{ type: 'Products', id: 'LOW_STOCK' }],
    }),
    getTopSellingProducts: builder.query({
      query: () => '/vendor/analytics/top-products',
      providesTags: ['Dashboard'],
    }),
    // Public vendor endpoints
    getVendors: builder.query({
      query: (params) => ({
        url: '/vendors',
        params,
      }),
      providesTags: ['Vendors'],
    }),
    getVendorById: builder.query({
      query: (id) => `/vendors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Vendor', id }],
    }),
  }),
});

export const {
  useGetVendorDashboardQuery,
  useGetVendorAnalyticsQuery,
  useGetVendorProfileQuery,
  useUpdateVendorProfileMutation,
  useGetVendorProductsQuery,
  useGetVendorOrdersQuery,
  useGetLowStockProductsQuery,
  useGetTopSellingProductsQuery,
  useGetVendorsQuery,
  useGetVendorByIdQuery,
} = vendorApi;
