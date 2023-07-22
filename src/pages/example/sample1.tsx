// Custom hook with useReducer
import { useEffect } from "react"
import useProduct from "@/hooks/useProductSimple"
import { STATUS } from "@/constants/common"

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        type="button"
        className="text-3xl text-white"
        onClick={actions.getList}
      >
        SAMPLE 1
      </button>
    </main>
  )
}

export default PageComponent