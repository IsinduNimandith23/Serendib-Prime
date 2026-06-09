import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-cocoa">Add product</h1>
      <p className="mt-1 mb-8 text-cocoa-soft">
        Create a new item for your catalogue.
      </p>
      <ProductForm action={createProduct} />
    </div>
  );
}
