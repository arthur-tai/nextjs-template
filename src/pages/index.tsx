import ProductProvider from "@/contexts/Product"
import TestComponent from "@/components/Count"
import TestAnother from "@/components/Count/TestAnother"

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
