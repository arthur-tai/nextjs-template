import { createContext, useContext, useReducer, useMemo } from "react"
import { STATUS, STATUS_TYPE } from "@/constants/common";

export type ProductStore = {
  status: STATUS_TYPE;
  error: WuCommon.ErrorType;
  products: any[];
}

export type ProductAction = {
  init: () => Promise<void>;
  getList: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
}

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
  payload?: any;
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

const actionsCreator = (dispatch: React.Dispatch<ReducerAction>): ProductAction => ({
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
})

const initialStore: ProductStore = {
  status: STATUS.LOADING as STATUS_TYPE,
  error: null,
  products: [],
}
const ProductContext = createContext<{
  store: ProductStore,
  actions: ProductAction
}>(null!)

const ProductProvider = ({ children }: React.PropsWithChildren) => {
  const [store, dispatch] = useReducer(reducer, initialStore)
  const actions = useMemo(() => actionsCreator(dispatch), [])
  console.log(`🚀 ~ ProductProvider ~ actions: rerender`);

  return (
    <ProductContext.Provider value={{ store, actions }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProductCtx = () => useContext(ProductContext)
export default ProductProvider