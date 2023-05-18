import { apiSlice as globalApiSlice } from "../../app/api/apiSlice";

export const apiSlice = globalApiSlice.injectEndpoints({
    tagTypes: ['Items'],
    endpoints: (builder) => ({
        getItems: builder.query({
            query: () => '/items',
            providesTags: ['Items']
        }),
        addItem: builder.mutation({
            query: (Items) => ({
                url: '/items',
                method: 'POST',
                body: Items
            }),
            invalidatesTags: ['Items']
        }),
        updateItem: builder.mutation({
            query: (Items) => ({
                url: `/items/${Items.id}`,
                method: 'PATCH',
                body: Items
            }),
            invalidatesTags: ['Items']
        }),
        deleteItem: builder.mutation({
            query: ({ id }) => ({
                url: `/items/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Items']
        }),
    })
})

export const {
    useGetItemsQuery,
    useAddItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation
} = apiSlice