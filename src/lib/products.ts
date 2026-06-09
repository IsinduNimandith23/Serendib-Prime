import type { Product } from "./types";

/**
 * Seed catalogue - the single source of truth for the storefront until a
 * Supabase `products` table is connected (see lib/data.ts). Three launch SKUs;
 * the range is built to expand. The Supabase migration in /supabase/schema.sql
 * mirrors these fields and /supabase/seed.sql inserts this exact data.
 */
export const PRODUCTS: Product[] = [
  {
    id: "tempered-sprats",
    slug: "tempered-sprats",
    name: "Tempered Sprats",
    nameSi: "හාල්මැස්සන් තෙම්පරාඩුව",
    nameTa: "நெத்தலி எண்ணெய் பிரட்டல்",
    tagline: "Crispy dried sprats stir-fried with onion, chilli & curry leaf",
    image: "/products/tempered-sprats.png",
    category: "Tempered",
    price: 690,
    weight: "400g",
    shortDescription:
      "Golden dried sprats tempered with onions, chilli and curry leaves - bold, crunchy and ready the moment you open the tin.",
    description:
      "Our Tempered Sprats (haal messo thel dala) are the snack-and-side every Sri Lankan kitchen keeps on hand. Small dried sprats are flash-fried until crisp, then tempered with red onion, green chilli, dried chilli flakes, curry leaves and a squeeze of lime. Smoky, salty, gently fiery - perfect over rice and dhal, stuffed into bread, or eaten straight from the fork.",
    ingredients: [
      "Dried sprats / haal messo (58%)",
      "Red onion",
      "Green & dried chilli",
      "Curry leaves & pandan",
      "Garlic",
      "Lime",
      "Cold-pressed coconut oil",
      "Sea salt",
    ],
    nutrition: {
      servingSize: "100g",
      calories: 210,
      protein: "22g",
      carbs: "7g",
      fat: "11g",
      sodium: "640mg",
    },
    spiceLevel: 3,
    badges: ["Ready to Eat", "No Preservatives", "High Protein"],
    accent: "#f15b2b",
    prepSteps: [
      "Open the easy-peel tin",
      "Eat as-is, or warm in a pan for 1–2 minutes",
      "Finish with a squeeze of lime",
    ],
    servingSuggestion: "Brilliant with rice and dhal, or stuffed into a warm roll.",
    featured: true,
    inStock: true,
    rating: 4.9,
    reviews: 188,
  },
  {
    id: "dried-sprats-curry",
    slug: "dried-sprats-curry",
    name: "Dried Sprats Curry",
    nameSi: "වියළි හාල්මැස්සන් කරිය",
    nameTa: "நெத்தலி கருவாடு கறி",
    tagline: "Dried sprats simmered in a roasted Sri Lankan spice gravy",
    image: "/products/dried-sprats-curry.png",
    category: "Curries",
    price: 790,
    weight: "400g",
    shortDescription:
      "Dried sprats slow-simmered in a dark, roasted curry with goraka and chilli - deep, savoury and full of home.",
    description:
      "Dried sprats braised the village way in a dark-roasted curry of coriander, fennel and pepper, sharpened with tart goraka and a backbone of curry leaves. The little fish drink up the gravy until every bite is intense and satisfying. The taste of a Sunday rice-and-curry table, sealed fresh and ready in two minutes.",
    ingredients: [
      "Dried sprats / haal messo (54%)",
      "Roasted Ceylon curry powder",
      "Onion, garlic, ginger",
      "Goraka (gamboge)",
      "Chilli",
      "Curry leaves & pandan",
      "Cold-pressed coconut oil",
      "Sea salt",
    ],
    nutrition: {
      servingSize: "100g",
      calories: 190,
      protein: "20g",
      carbs: "8g",
      fat: "9g",
      sodium: "610mg",
    },
    spiceLevel: 2,
    badges: ["Ready to Eat", "No Preservatives", "Heat & Serve"],
    accent: "#074a6d",
    prepSteps: [
      "Empty into a saucepan",
      "Warm through for 2–3 minutes",
      "Serve hot with rice or bread",
    ],
    servingSuggestion: "Lovely with red rice, pol sambol and a coconut roti.",
    featured: true,
    inStock: true,
    rating: 4.8,
    reviews: 154,
  },
  {
    id: "dried-sprats-curry-premium",
    slug: "dried-sprats-curry-premium",
    name: "Dried Sprats Curry - Premium",
    nameSi: "වියළි හාල්මැස්සන් කරිය",
    nameTa: "நெத்தலி கருவாடு கறி",
    tagline: "Dried sprats in a creamy roasted-coconut gravy",
    image: "/products/dried-sprats-curry-premium.png",
    category: "Curries",
    price: 890,
    weight: "400g",
    shortDescription:
      "Our premium dried sprats curry, finished in a rich roasted-coconut milk gravy with whole spices - mellow, fragrant and indulgent.",
    description:
      "The premium take on a classic. Dried sprats gently simmered in a smooth roasted-coconut milk gravy with cinnamon, cardamom, black pepper and fresh curry leaves. Rounder and creamier than the everyday curry, with the fish kept tender and whole. A little luxury from the Sri Lankan coast, ready whenever you are.",
    ingredients: [
      "Dried sprats / haal messo (50%)",
      "Coconut milk",
      "Roasted Ceylon curry powder",
      "Onion, garlic, ginger",
      "Cinnamon, cardamom, cloves",
      "Black pepper",
      "Curry leaves & pandan",
      "Sea salt",
    ],
    nutrition: {
      servingSize: "100g",
      calories: 240,
      protein: "19g",
      carbs: "9g",
      fat: "15g",
      sodium: "560mg",
    },
    spiceLevel: 2,
    badges: ["Premium", "Ready to Eat", "Coconut-Rich"],
    accent: "#229ba7",
    prepSteps: [
      "Tip into a pan",
      "Warm gently for 2–3 minutes - do not boil hard",
      "Serve with rice, hoppers or string hoppers",
    ],
    servingSuggestion: "Beautiful over steamed rice or with soft hoppers.",
    featured: true,
    inStock: true,
    rating: 5.0,
    reviews: 96,
  },
];

export const CATEGORIES = ["Tempered", "Curries"] as const;
