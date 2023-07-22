// useContext, useReducer 的 custom hook template
import { createContext, useContext, useMemo, useReducer } from "react"
import { STATUS, STATUS_TYPE } from "@/constants/common"

// 全域的 error type, 定義前後端討論好的 error schema, 處理 error 的時都可以使用同樣邏輯
// btw axios 的第一層攔截器的封裝時，應該先處理好大部分, 則 swr 同...!?

// 每個 hook 都可以有自己的 type definition in this file and also will export it
export type ProductStore = {
  status: STATUS_TYPE;
  error: WuCommon.ErrorType;
  products: any[]; // 這裡可以使用 @types 裡面定義的，因為屬於 api data definition 的範疇
}
export type ProductActions = {
  init: () => Promise<void>;
  getList: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
}
// enum definition about reducer action.type
export enum ProductActionType {
  INIT,
  INIT_SUCCESS,
  INIT_FAIL,
  GET_LIST,
  GET_LIST_SUCCESS,
  GET_LIST_FAIL,
}

// initial data with api data
const initialStore = {
  status: STATUS.LOADING as STATUS_TYPE,
  error: null,
  products: []
}

export const ProductContext = createContext<{
  store: ProductStore,
  actions: ProductActions
}>(null!)
export const useProductCtx = () => useContext(ProductContext)

type ReducerAction = {
  type: ProductActionType;
  payload?: any; // or constraint value
}
const reducer = (store: ProductStore, action: ReducerAction): ProductStore => {
  switch (action.type) {
    case ProductActionType.INIT: {
      return { ...store, status: STATUS.LOADING as STATUS_TYPE }
    }
    case ProductActionType.INIT_SUCCESS: {
      return { ...store, status: STATUS.INIT as STATUS_TYPE }
    }
    case ProductActionType.GET_LIST: {
      return { ...store, status: STATUS.FETCHING as STATUS_TYPE }
    }
    case ProductActionType.GET_LIST_SUCCESS: {
      return { ...store, status: STATUS.FETCHED as STATUS_TYPE }
    }
    case ProductActionType.INIT_FAIL:
    case ProductActionType.GET_LIST_FAIL: {
      // 一起處理 sentry notify
      // sentryService.notify({error, context, etc...})
      return { ...store, error: action.payload.error }
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
const useProduct = (): { store: ProductStore, actions: ProductActions } => {
  const [store, dispatch] = useReducer(reducer, initialStore)
  const actions = useMemo(() => ({
    init: async () => {
      try {
        dispatch({ type: ProductActionType.INIT })

        // something like
        // await Promise.all([FbService.Tracking(), GaService.Tracking()])

        dispatch({ type: ProductActionType.INIT_SUCCESS })
      } catch (error) {
        dispatch({ type: ProductActionType.INIT_FAIL, payload: { error } })
      }
    },
    getList: async () => {
      try {
        // set isLoading true, etc...
        dispatch({ type: ProductActionType.GET_LIST })

        // something like
        // const data = await ProductService.GETv1Products()

        dispatch({
          type: ProductActionType.GET_LIST_SUCCESS,
          payload: { products: [] } // api data
        })
      } catch (error) {
        dispatch({ type: ProductActionType.GET_LIST_FAIL, payload: { error } })
      }
    },
    getProductById: async (id: string) => {
      try {
        // set isLoading true, etc...
        dispatch({ type: ProductActionType.GET_LIST })

        // something like
        // const data = await ProductService.GETv1ProductById(id)

        dispatch({
          type: ProductActionType.GET_LIST_SUCCESS,
          payload: { products: [] } // api data
        })
      } catch (error) {
        dispatch({ type: ProductActionType.GET_LIST_FAIL, payload: { error } })
      }
    },
  }), [])

  return { store, actions }
}

export default useProduct