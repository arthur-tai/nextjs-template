// useContext, useReducer 的 custom hook template
// 若單純使用 useReducer 的話也可以，就不用實作 useContext 相關的內容就好
import { createContext, useContext, useReducer } from "react"

// 應該可以定義一個全域的 error type, 盡可能用一樣的資料結構，讓每個人處理 error 的時候都可以使用統一的邏輯!?
// btw 盡可能在例如： axios 的第一層攔截器的封裝時，應該先處理好大部分, 則 swr 同...!?
type ErrorType = {
  code: 200, message: ''
} | null

// 每個 hook 都可以有自己的 type definition in this file and also will export it
export type ProductsStore = {
  status: string, // 應該可以定義一個共用的 status type, 同樣可以使用統一邏輯處理
  error: ErrorType,
  products: any[] // 這裡可以使用 @types 裡面定義的，因為屬於 api data definition 的範疇
}
export type ProductsAction = {
  init: () => Promise<void>,
  getList: () => Promise<void>,
  getProductById: (id: string) => Promise<void>,
}

// enum definition about reducer action.type
export enum ActionType {
  INIT,
  INIT_SUCCESS,
  INIT_FAIL,
  GET_LIST,
  GET_LIST_SUCCESS,
  GET_LIST_FAIL,
}

// initial data with api data
const initialStore = {
  status: "loading", // 應該可以定義一個全域的 status 常數, 統一使用
  error: null,
  products: []
}

export const ProductsContext = createContext(null)
export const useProductsCtx = () => useContext(ProductsContext)

type ReducerAction = {
  type: ActionType;
  payload?: any; // or constraint value
}
const reducer = (store: ProductsStore, action: ReducerAction): ProductsStore => {
  switch (action.type) {
    case ActionType.INIT: {
      return { ...store, status: "loading" } // if has status constant then use it
    }
    case ActionType.INIT_SUCCESS: {
      return { ...store, status: "init" } // if has status constant then use it
    }
    case ActionType.INIT_FAIL: {
      return { ...store, status: "init", error: action.payload.error as ErrorType }
    }
    default:
      return store
  }
}

// 主要因為 dispatch 會造成 rerender, 如果直接傳出去感覺會比較不安全,
// 類似於外界都可以拿到 dispatch 這個炸彈，隨時引爆

/**
 * 透過一層封裝(底下的 action object)，達成類似 suga/thunk 等非同步處理(side effect)，
 * 也可以把 api call 或 api 資料處理都放在這個 hook 中，而不是直接散落在各個 component 內
 */
const useProducts = (): { store: ProductsStore, action: ProductsAction } => {
  const [store, dispatch] = useReducer(reducer, initialStore)

  const action = {
    init: async () => {
      try {
        dispatch({ type: ActionType.INIT })

        // something like
        // const data = await FbService.Tracking()

        dispatch({
          type: ActionType.INIT_SUCCESS,
          payload: { products: [1, 2, 3, 4, 5] } // api data
        })
      } catch (error) {
        dispatch({ type: ActionType.INIT_FAIL, payload: { error } })
      }
    },
    getList: async () => {
      try {
        // set isLoading true, etc...
        dispatch({ type: ActionType.GET_LIST })

        // something like
        // const data = await ProductService.GETv1Products()

        dispatch({
          type: ActionType.GET_LIST_SUCCESS,
          payload: { products: [] } // api data
        })
      } catch (error) {
        dispatch({ type: ActionType.GET_LIST_FAIL, payload: { error } })
      }
    },
    getProductById: async (id: string) => {
      try {
        // set isLoading true, etc...
        dispatch({ type: ActionType.GET_LIST })

        // something like
        // const data = await ProductService.GETv1ProductById(id)

        dispatch({
          type: ActionType.GET_LIST_SUCCESS,
          payload: { products: [] } // api data
        })
      } catch (error) {
        dispatch({ type: ActionType.GET_LIST_FAIL, payload: { error } })
      }
    },
  }

  return { store, action }
}

export default useProducts

/*
How parent component use this custom hook of useContext and useReducer

import { useEffect } from "react"
import useProducts, { ProductsContext } from "@/hooks/useProducts"

const PageComponent = ()=>{
  const { store, action } = useProducts()
  
  useEffect(()=>{
    action.init()
  },[])

  return (
    <ProductsContext.Provider value={{store, action}}>
      {store.status === "loading" ? null: children}
    </ProductsContext.Provider>
  )
}

---
In child component

import { useProductsCtx } from "@/hooks/useProducts"
const ChildComponent = ()=>{
  const { store, action } = useProductsCtx()

  return (
    <div>
      <button onClick={action.getList}>get list</button>
    </div>
  )
}
*/