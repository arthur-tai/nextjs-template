// Custom hook with useReducer + useContext
import { useEffect } from "react"
import useProduct, { ProductContext } from "@/hooks/useProductSimpleWithContext"
import { STATUS } from "@/constants/common"

import Example2Child from "@/components/Example2"
import AnotherChild from "@/components/Another"

const PageComponent = () => {
  const { store, actions } = useProduct()

  useEffect(() => {
    actions.init()
  }, [])

  // if (
  //   store.status !== STATUS.INIT ||
  //   store.status === STATUS.LOADING
  // ) return null

  return (
    <ProductContext.Provider value={{ store, actions }}>
      <Example2Child />
      <AnotherChild />
    </ProductContext.Provider>
  )
}

export default PageComponent


// about useContext rerender for better perf may use useMemo to memorize components
// const AnotherMemoComponent = useMemo(() => <AnotherChild />, deps)
// or see or use `use-context-selector` library implementation