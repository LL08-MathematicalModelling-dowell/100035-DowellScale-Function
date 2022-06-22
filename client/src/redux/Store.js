// Combine Reducer is used to persist two or more reducers
import {configureStore, combineReducers} from '@reduxjs/toolkit'
// import {configureStore} from '@reduxjs/toolkit'
import settingsReducer from './SettingsSlice'
import responseReducer from './ResponseSlice'

// persit
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage' 

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({response: responseReducer, settings: settingsReducer})
  
// const persistedReducer = persistReducer(persistConfig, rootReducer)
  


export const store = configureStore({
    reducer:rootReducer,

    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)