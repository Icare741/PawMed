import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/app/middlewares/ReduxMiddlewares';
import { Order } from '@/components/services/types/orders';
import { REACT_APP_API_URL } from '../../config';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await axiosInstance.get(`${REACT_APP_API_URL}/orders?page=${page}&limit=${limit}`);
    return response.data;
  }
);

export const addOrder = createAsyncThunk(
  'orders/addOrder',
  async (orderData: Partial<Order>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${REACT_APP_API_URL}/orders`, orderData);
      return response.data as Order;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue lors de l\'ajout de la commande');
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async (orderData: Order, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${REACT_APP_API_URL}/orders/${orderData.id}`, orderData);
      return response.data as Order;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour de la commande');
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${REACT_APP_API_URL}/orders/${orderId}`);
      return orderId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue lors de la suppression de la commande');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<{ data: Order[], meta: { current_page: number, last_page: number } }>) => {
        state.isLoading = false;
        state.orders = action.payload.data;
        state.currentPage = action.payload.meta.current_page;
        state.totalPages = action.payload.meta.last_page;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Une erreur est survenue lors de la récupération des commandes';
      })
      .addCase(addOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        state.orders.push(action.payload);
        state.error = null;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Une erreur est survenue lors de l\'ajout de la commande';
      })
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Une erreur est survenue lors de la mise à jour de la commande';
      })
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Une erreur est survenue lors de la suppression de la commande';
      });
  },
});

export const { setCurrentPage } = ordersSlice.actions;
export default ordersSlice.reducer;

