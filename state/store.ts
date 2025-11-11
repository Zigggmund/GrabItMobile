import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {}
})

// легкий доступ к состояниям с помощью селекторов
export type RootState = ReturnType<typeof store.getState>
// асинхронные действия с помощью dispatch-хука
export type AppDispatch = typeof store.dispatch