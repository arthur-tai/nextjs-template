// Provider with useReducer + useContext
import ProductProvider from "@/contexts/Product"
import Example3Child from "@/components/Example3"

const PageComponent = () => {
  return (
    <ProductProvider>
      <Example3Child />
    </ProductProvider>
  )
}

export default PageComponent