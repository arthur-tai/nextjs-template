// 單純使用 useReducer 的 custom hook 封裝
import { useReducer, useMemo } from "react"
import { STATUS, STATUS_TYPE } from "@/constants/common"

// 每個 hook 都可以有自己的 type definition in this file and also will export it
export type ProductStore = {
  status: STATUS_TYPE;
  error: WuCommon.ErrorType;
  products: any[];
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

// initial data with api data
const initialStore: ProductStore = {
  status: STATUS.LOADING as STATUS_TYPE,
  error: null,
  products: []
}

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
        // set loading true, etc...
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
        // set loading true, etc...
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
