import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: ({ category, color, minPrice, maxPrice, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (category && category !== "all") params.append("category", category);
        if (color && color !== "all") params.append("color", color);
        if (minPrice !== undefined) params.append("minPrice", minPrice);
        if (maxPrice !== undefined && maxPrice !== Infinity) params.append("maxPrice", maxPrice);
        params.append("page", page);
        params.append("limit", limit);
        return `/?${params.toString()}`;
      },
      providesTags: ["Products"]
    }),

    searchProducts: builder.query({
      query: (searchQuery) => {
        if (!searchQuery.trim()) return "";
        return `/search?searchQuery=${encodeURIComponent(searchQuery)}`;
      },
      providesTags: ["Products"],
    }),

    fetchProductById: builder.query({
      query: (_id) => `/${_id}`,
      providesTags: (result, error, _id) => [{ type: "Products", _id }],
    }),

    fetchRelatedProducts: builder.query({
      query: (_id) => `/related/${_id}`,
      providesTags: ["Products"],
    }),

    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: `/update-product/${_id}`,
        method: "PATCH",
        body: rest,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (_id) => ({
        url: `/${_id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, _id) => [{ type: "Products", _id }],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useSearchProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery,
} = productsApi;

export default productsApi;