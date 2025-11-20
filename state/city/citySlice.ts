// срез счетчика

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CityKey, cityKeys } from '@/constants/cities';

import { storage } from '@/services/storage/asyncStorageService';

const CITY_KEY = 'city';
const defaultCity = cityKeys[0];

// один раз, только при старте приложения
export const loadCity = createAsyncThunk('city/loadCity', async () => {
  const saved = await storage.get<string>(CITY_KEY);
  return saved ?? defaultCity;
});

export const saveCity = createAsyncThunk(
  'city/saveCity',
  async (city: string) => {
    await storage.set(CITY_KEY, city);
    return city;
  },
);

interface CityState {
  cities: CityKey[];
  currentCity: CityKey;
  isLoading: boolean;
}

const initialState: CityState = {
  currentCity: defaultCity,
  cities: cityKeys,
  isLoading: true,
};

// объявление слоя
const citySlice = createSlice({
  name: 'city',
  initialState,
  // синхронные
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadCity.pending, state => {
        state.isLoading = true;
      })
      // при pending ui блокируется - еще не загрузилось
      .addCase(loadCity.fulfilled, (state, action: PayloadAction<string>) => {
        state.currentCity = action.payload;
        state.isLoading = false;
      })
      // для save pending не нужно - операция выбора и так быстрая
      .addCase(saveCity.fulfilled, (state, action: PayloadAction<string>) => {
        state.currentCity = action.payload;
      });
  },
});

// экспорт редьюсера (доступен благодаря createSlice)
export default citySlice.reducer;
