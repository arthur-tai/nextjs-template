import { useProductCtx } from "@/hooks/useProductSimpleWithContext"

const Example2 = () => {
  console.log("--- Example2 Child rerender ---");
  const { actions } = useProductCtx()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        type="button"
        className="text-3xl text-white"
        onClick={actions.getList}
      >
        SAMPLE 2
      </button>
    </main>
  )
}

export default Example2