import { useProductCtx } from "@/contexts/Product"

const Counter = () => {
  const { actions } = useProductCtx()
  console.log(`🚀 ~ Counter ~ rerender`);

  return (
    <div>
      <button type="button" className="text-3xl text-white" onClick={actions.init}>
        CLICK ME
      </button>
    </div>
  )
}

export default Counter