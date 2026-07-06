import Link from "next/link";
import { getAdminProducts } from "@/lib/data";
import { formatLKR } from "@/lib/utils";
import { buttonClass } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { deleteProduct, toggleProductFlag } from "@/app/admin/actions";
import { IconStar, IconTrash } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-cocoa">Products</h1>
          <p className="mt-1 text-cocoa-soft">{products.length} in your catalogue</p>
        </div>
        <Link href="/admin/products/new" className={buttonClass({ variant: "primary" })}>
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-clay bg-cream p-12 text-center">
          <p className="font-display text-lg text-cocoa">No products yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-cocoa-soft">
            Run <code className="text-cocoa">supabase/seed.sql</code> to import the starter
            catalogue, or add your first product now.
          </p>
          <Link
            href="/admin/products/new"
            className={buttonClass({ variant: "primary", className: "mt-5" })}
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile: stacked list */}
          <ul className="mt-8 divide-y divide-clay overflow-hidden rounded-2xl border border-clay bg-cream sm:hidden">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-4 py-4">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand/40">
                  <ProductImage product={p} sizes="56px" className="p-1" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-cocoa">{p.name}</p>
                  <p className="text-sm text-cocoa-soft">{p.category}</p>
                  <p className="mt-0.5 font-semibold text-cocoa">{formatLKR(p.price)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <form action={toggleProductFlag} className="inline-flex">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="field" value="featured" />
                    <input type="hidden" name="value" value={(!p.featured).toString()} />
                    <button
                      type="submit"
                      aria-label={p.featured ? "Unmark featured" : "Mark featured"}
                      className="cursor-pointer text-gold transition-transform hover:scale-110"
                    >
                      <IconStar filled={p.featured} className="h-5 w-5" />
                    </button>
                  </form>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="font-semibold text-spice hover:text-spice-dark"
                  >
                    Edit
                  </Link>
                  <form action={deleteProduct} className="inline-flex">
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmSubmit
                      message={`Delete "${p.name}"? This cannot be undone.`}
                      aria-label={`Delete ${p.name}`}
                      className="cursor-pointer text-cocoa-soft transition-colors hover:text-spice"
                    >
                      <IconTrash className="h-5 w-5" />
                    </ConfirmSubmit>
                  </form>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-clay bg-cream sm:block">
            <table className="w-full min-w-160 text-base">
              <thead>
                <tr className="text-left text-[15px] text-cocoa-soft">
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 text-center font-semibold">Featured</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sand/40">
                          <ProductImage product={p} sizes="48px" className="p-1" />
                        </span>
                        <span className="font-semibold text-cocoa">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-cocoa-soft">{p.category}</td>
                    <td className="px-5 py-3 font-semibold text-cocoa">{formatLKR(p.price)}</td>
                    <td className="px-5 py-3 text-center">
                      <form action={toggleProductFlag} className="inline">
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="field" value="featured" />
                        <input type="hidden" name="value" value={(!p.featured).toString()} />
                        <button
                          type="submit"
                          aria-label={p.featured ? "Unmark featured" : "Mark featured"}
                          className="cursor-pointer text-gold transition-transform hover:scale-110"
                        >
                          <IconStar filled={p.featured} className="h-5 w-5" />
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="font-semibold text-spice hover:text-spice-dark"
                        >
                          Edit
                        </Link>
                        <form action={deleteProduct} className="inline">
                          <input type="hidden" name="id" value={p.id} />
                          <ConfirmSubmit
                            message={`Delete "${p.name}"? This cannot be undone.`}
                            aria-label={`Delete ${p.name}`}
                            className="cursor-pointer text-cocoa-soft transition-colors hover:text-spice"
                          >
                            <IconTrash className="h-4 w-4" />
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
