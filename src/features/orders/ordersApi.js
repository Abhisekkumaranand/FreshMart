import { baseApi } from '../../api/baseApi';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Orders', 'Cart'],
    }),
    getMyOrders: builder.query({
      query: (params) => ({
        url: '/orders/my-orders',
        params,
      }),
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    trackOrder: builder.query({
      query: (id) => `/orders/${id}/track`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Orders'],
    }),
    // Vendor order endpoints
    getVendorOrders: builder.query({
      query: (params) => ({
        url: '/vendor/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        'Orders',
      ],
    }),
    // Admin order endpoints
    getAllOrders: builder.query({
      query: (params) => ({
        url: '/admin/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useTrackOrderQuery,
  useCancelOrderMutation,
  useGetVendorOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAllOrdersQuery,
} = ordersApi;
