import ProductProvider from "@/contexts/Product"
import TestComponent from "@/components/Example3"
import TestAnother from "@/components/Another"

export default function PageComponent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ProductProvider>
        <TestAnother />
        <TestComponent />
      </ProductProvider>
    </main>
  )
}
