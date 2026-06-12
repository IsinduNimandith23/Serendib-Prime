import Link from "next/link";
import type { Product } from "@/lib/types";
import { buttonClass } from "@/components/ui/Button";

const CATEGORIES = ["Tempered", "Curries"];

const inputClass =
  "w-full rounded-xl border border-clay bg-cream px-4 py-2.5 text-cocoa focus-visible:outline-spice";
const labelClass = "mb-1.5 block text-sm font-medium text-cocoa";

export function ProductForm({
  action,
  product,
}: {
  action: (formData: FormData) => void | Promise<void>;
  product?: Product;
}) {
  const p = product;
  return (
    <form action={action} className="space-y-8">
      {/* Basics */}
      <section className="rounded-2xl border border-clay bg-cream p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-cocoa">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className={labelClass}>Name</label>
            <input id="name" name="name" required defaultValue={p?.name} className={inputClass} />
          </div>
          <div>
            <label htmlFor="slug" className={labelClass}>Slug (auto if blank)</label>
            <input id="slug" name="slug" defaultValue={p?.slug} className={inputClass} />
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select id="category" name="category" defaultValue={p?.category ?? CATEGORIES[0]} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tagline" className={labelClass}>Tagline</label>
            <input id="tagline" name="tagline" defaultValue={p?.tagline} className={inputClass} />
          </div>
          <div>
            <label htmlFor="name_si" className={labelClass}>Sinhala name</label>
            <input id="name_si" name="name_si" defaultValue={p?.nameSi} className={inputClass} />
          </div>
          <div>
            <label htmlFor="name_ta" className={labelClass}>Tamil name</label>
            <input id="name_ta" name="name_ta" defaultValue={p?.nameTa} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="image_url" className={labelClass}>Image URL</label>
            <input
              id="image_url"
              name="image_url"
              defaultValue={p?.image}
              placeholder="/tempered-sprats.jpg or https://…"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="price" className={labelClass}>Price (LKR)</label>
            <input id="price" name="price" type="number" min="0" required defaultValue={p?.price} className={inputClass} />
          </div>
          <div>
            <label htmlFor="weight" className={labelClass}>Net weight</label>
            <input id="weight" name="weight" placeholder="400g" defaultValue={p?.weight} className={inputClass} />
          </div>
          <div>
            <label htmlFor="accent" className={labelClass}>Accent colour</label>
            <input id="accent" name="accent" type="color" defaultValue={p?.accent ?? "#b5371f"} className="h-11 w-full cursor-pointer rounded-xl border border-clay bg-cream px-2" />
          </div>
          <div>
            <label htmlFor="sort_order" className={labelClass}>Sort order</label>
            <input id="sort_order" name="sort_order" type="number" defaultValue={p?.sortOrder ?? 100} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Descriptions */}
      <section className="rounded-2xl border border-clay bg-cream p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-cocoa">Descriptions</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="short_description" className={labelClass}>Short description (cards)</label>
            <textarea id="short_description" name="short_description" rows={2} defaultValue={p?.shortDescription} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Full description</label>
            <textarea id="description" name="description" rows={5} defaultValue={p?.description} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label htmlFor="serving_suggestion" className={labelClass}>Serving suggestion</label>
            <input id="serving_suggestion" name="serving_suggestion" defaultValue={p?.servingSuggestion} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Lists */}
      <section className="rounded-2xl border border-clay bg-cream p-6">
        <h2 className="mb-1 font-display text-lg font-semibold text-cocoa">Details</h2>
        <p className="mb-4 text-sm text-cocoa-soft">One item per line (or comma-separated).</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="badges" className={labelClass}>Badges</label>
            <textarea id="badges" name="badges" rows={4} defaultValue={p?.badges.join("\n")} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label htmlFor="ingredients" className={labelClass}>Ingredients</label>
            <textarea id="ingredients" name="ingredients" rows={4} defaultValue={p?.ingredients.join("\n")} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label htmlFor="prep_steps" className={labelClass}>Prep steps</label>
            <textarea id="prep_steps" name="prep_steps" rows={4} defaultValue={p?.prepSteps.join("\n")} className={`${inputClass} resize-none`} />
          </div>
        </div>
      </section>

      {/* Nutrition */}
      <section className="rounded-2xl border border-clay bg-cream p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-cocoa">Nutrition</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { name: "n_serving", label: "Serving size", value: p?.nutrition.servingSize },
            { name: "n_calories", label: "Calories", value: p?.nutrition.calories, type: "number" },
            { name: "n_protein", label: "Protein", value: p?.nutrition.protein },
            { name: "n_carbs", label: "Carbohydrates", value: p?.nutrition.carbs },
            { name: "n_fat", label: "Fat", value: p?.nutrition.fat },
            { name: "n_sodium", label: "Sodium", value: p?.nutrition.sodium },
          ].map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name} className={labelClass}>{f.label}</label>
              <input id={f.name} name={f.name} type={f.type ?? "text"} defaultValue={f.value} className={inputClass} />
            </div>
          ))}
        </div>
      </section>

      {/* Flags & ratings */}
      <section className="rounded-2xl border border-clay bg-cream p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-cocoa">Visibility &amp; ratings</h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox name="active" label="Active (visible in store)" defaultChecked={p?.active ?? true} />
          <Checkbox name="featured" label="Featured (bestseller)" defaultChecked={p?.featured ?? false} />
          <Checkbox name="in_stock" label="In stock" defaultChecked={p?.inStock ?? true} />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rating" className={labelClass}>Rating (0–5)</label>
            <input id="rating" name="rating" type="number" step="0.1" min="0" max="5" defaultValue={p?.rating ?? 4.8} className={inputClass} />
          </div>
          <div>
            <label htmlFor="reviews" className={labelClass}>Review count</label>
            <input id="reviews" name="reviews" type="number" min="0" defaultValue={p?.reviews ?? 0} className={inputClass} />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" className={buttonClass({ variant: "primary", size: "lg" })}>
          {p ? "Save changes" : "Create product"}
        </button>
        <Link href="/admin/products" className={buttonClass({ variant: "outline", size: "lg" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-cocoa">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 cursor-pointer accent-spice"
      />
      {label}
    </label>
  );
}
