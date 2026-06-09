import { notFound } from "next/navigation";
import { getAdminProductById } from "@/lib/data";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getAdminProductById(id);
  if (!product) notFound();

  const action = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-cocoa">Edit product</h1>
      <p className="mt-1 mb-8 text-cocoa-soft">{product.name}</p>
      <ProductForm action={action} product={product} />
    </div>
  );
}
