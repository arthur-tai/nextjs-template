import { useEffect } from "react"
import { useProductCtx } from "@/contexts/Product"
import { STATUS } from "@/constants/common"

import AnotherChild from "../Another"

const Example3 = () => {
  console.log('--- Example3 Child rerender ---');
  const { store, actions } = useProductCtx()

  useEffect(() => {
    actions.init()
  }, [])

  // if (
  //   store.status !== STATUS.INIT ||
  //   store.status === STATUS.LOADING
  // ) return null

  return (
    <main className="flex min-h-screen items-center justify-center flex-col p-24">
      <button
        type="button"
        className="text-3xl text-white"
        onClick={actions.getList}
      >
        SAMPLE 3
      </button>
      <AnotherChild />
    </main>
  )
}

export default Example3