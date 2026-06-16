import Link from "next/link";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

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
    <form action={action} className="space-y-6">
      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Section title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField name="name" label="Name" required defaultValue={p?.name} className="sm:col-span-2" />
              <TextField name="slug" label="Slug (auto if blank)" defaultValue={p?.slug} />
              <div>
                <label htmlFor="category" className={labelClass}>Category</label>
                <select id="category" name="category" defaultValue={p?.category ?? CATEGORIES[0]} className={inputClass}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <TextField name="tagline" label="Tagline" defaultValue={p?.tagline} className="sm:col-span-2" />
              <TextField name="name_si" label="Sinhala name" defaultValue={p?.nameSi} />
              <TextField name="name_ta" label="Tamil name" defaultValue={p?.nameTa} />
            </div>
          </Section>

          <Section title="Descriptions">
            <div className="space-y-4">
              <div>
                <label htmlFor="short_description" className={labelClass}>Short description (cards)</label>
                <textarea id="short_description" name="short_description" rows={2} defaultValue={p?.shortDescription} className={cn(inputClass, "resize-none")} />
              </div>
              <div>
                <label htmlFor="description" className={labelClass}>Full description</label>
                <textarea id="description" name="description" rows={5} defaultValue={p?.description} className={cn(inputClass, "resize-none")} />
              </div>
              <TextField name="serving_suggestion" label="Serving suggestion" defaultValue={p?.servingSuggestion} />
            </div>
          </Section>

          <Section title="Details" description="One item per line (or comma-separated).">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="badges" className={labelClass}>Badges</label>
                <textarea id="badges" name="badges" rows={4} defaultValue={p?.badges.join("\n")} className={cn(inputClass, "resize-none")} />
              </div>
              <div>
                <label htmlFor="ingredients" className={labelClass}>Ingredients</label>
                <textarea id="ingredients" name="ingredients" rows={4} defaultValue={p?.ingredients.join("\n")} className={cn(inputClass, "resize-none")} />
              </div>
              <div>
                <label htmlFor="prep_steps" className={labelClass}>Prep steps</label>
                <textarea id="prep_steps" name="prep_steps" rows={4} defaultValue={p?.prepSteps.join("\n")} className={cn(inputClass, "resize-none")} />
              </div>
            </div>
          </Section>

          <Section title="Nutrition">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { name: "n_serving", label: "Serving size", value: p?.nutrition.servingSize },
                { name: "n_calories", label: "Calories", value: p?.nutrition.calories, type: "number" },
                { name: "n_protein", label: "Protein", value: p?.nutrition.protein },
                { name: "n_carbs", label: "Carbohydrates", value: p?.nutrition.carbs },
                { name: "n_fat", label: "Fat", value: p?.nutrition.fat },
                { name: "n_sodium", label: "Sodium", value: p?.nutrition.sodium },
              ].map((f) => (
                <TextField key={f.name} name={f.name} label={f.label} type={f.type ?? "text"} defaultValue={f.value} />
              ))}
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <Section title="Image">
            <ImageUploadField defaultUrl={p?.image} />
          </Section>

          <Section title="Pricing">
            <div className="space-y-4">
              <TextField name="price" label="Price (LKR)" type="number" min="0" required defaultValue={p?.price} />
              <TextField name="weight" label="Net weight" placeholder="400g" defaultValue={p?.weight} />
              <div>
                <label htmlFor="accent" className={labelClass}>Accent colour</label>
                <input id="accent" name="accent" type="color" defaultValue={p?.accent ?? "#b5371f"} className="h-11 w-full cursor-pointer rounded-xl border border-clay bg-cream px-2" />
              </div>
              <TextField name="sort_order" label="Sort order" type="number" defaultValue={p?.sortOrder ?? 100} />
            </div>
          </Section>

          <Section title="Visibility">
            <div className="space-y-3">
              <Checkbox name="active" label="Active (visible in store)" defaultChecked={p?.active ?? true} />
              <Checkbox name="featured" label="Featured (bestseller)" defaultChecked={p?.featured ?? false} />
              <Checkbox name="in_stock" label="In stock" defaultChecked={p?.inStock ?? true} />
            </div>
          </Section>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-clay pt-6">
        <Link href="/admin/products" className={buttonClass({ variant: "outline", size: "lg" })}>
          Cancel
        </Link>
        <button type="submit" className={buttonClass({ variant: "primary", size: "lg" })}>
          {p ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-clay bg-cream p-6">
      <h2 className="font-display text-lg font-semibold text-cocoa">{title}</h2>
      {description && <p className="mt-1 text-sm text-cocoa-soft">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Labelled text/number input. `className` styles the wrapper (e.g. column span). */
function TextField({
  name,
  label,
  className,
  ...props
}: {
  name: string;
  label: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClass}>{label}</label>
      <input id={name} name={name} className={inputClass} {...props} />
    </div>
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
