-- ============================================================
-- Serendib Prime - starter catalogue (3 launch SKUs)
-- Run AFTER schema.sql. Safe to re-run (clears products first).
-- ============================================================
delete from public.products;

insert into public.products
  (slug, name, name_si, name_ta, tagline, image_url, category, price, weight,
   short_description, description, ingredients, nutrition, spice_level, badges,
   accent, prep_steps, serving_suggestion, featured, active, in_stock,
   sort_order)
values
(
  'tempered-sprats', 'Tempered Sprats',
  'හාල්මැස්සන් තෙම්පරාඩුව', 'நெத்தலி எண்ணெய் பிரட்டல்',
  $$Crispy dried sprats stir-fried with onion, chilli & curry leaf$$,
  '/products/tempered-sprats.png', 'Tempered', 690, '400g',
  $$Golden dried sprats tempered with onions, chilli and curry leaves - bold, crunchy and ready the moment you open the tin.$$,
  $$Our Tempered Sprats (haal messo thel dala) are the snack-and-side every Sri Lankan kitchen keeps on hand. Small dried sprats are flash-fried until crisp, then tempered with red onion, green chilli, dried chilli flakes, curry leaves and a squeeze of lime. Smoky, salty, gently fiery.$$,
  $$["Dried sprats / haal messo (58%)","Red onion","Green & dried chilli","Curry leaves & pandan","Garlic","Lime","Cold-pressed coconut oil","Sea salt"]$$::jsonb,
  $${"servingSize":"100g","calories":210,"protein":"22g","carbs":"7g","fat":"11g","sodium":"640mg"}$$::jsonb,
  3, $$["Ready to Eat","No Preservatives","High Protein"]$$::jsonb, '#f15b2b',
  $$["Open the easy-peel tin","Eat as-is, or warm in a pan for 1–2 minutes","Finish with a squeeze of lime"]$$::jsonb,
  $$Brilliant with rice and dhal, or stuffed into a warm roll.$$, true, true, true, 1
),
(
  'dried-sprats-curry', 'Dried Sprats Curry',
  'වියළි හාල්මැස්සන් කරිය', 'நெத்தலி கருவாடு கறி',
  $$Dried sprats simmered in a roasted Sri Lankan spice gravy$$,
  '/products/dried-sprats-curry.png', 'Curries', 790, '400g',
  $$Dried sprats slow-simmered in a dark, roasted curry with goraka and chilli - deep, savoury and full of home.$$,
  $$Dried sprats braised the village way in a dark-roasted curry of coriander, fennel and pepper, sharpened with tart goraka and a backbone of curry leaves. The little fish drink up the gravy until every bite is intense and satisfying.$$,
  $$["Dried sprats / haal messo (54%)","Roasted Ceylon curry powder","Onion, garlic, ginger","Goraka (gamboge)","Chilli","Curry leaves & pandan","Cold-pressed coconut oil","Sea salt"]$$::jsonb,
  $${"servingSize":"100g","calories":190,"protein":"20g","carbs":"8g","fat":"9g","sodium":"610mg"}$$::jsonb,
  2, $$["Ready to Eat","No Preservatives","Heat & Serve"]$$::jsonb, '#074a6d',
  $$["Empty into a saucepan","Warm through for 2–3 minutes","Serve hot with rice or bread"]$$::jsonb,
  $$Lovely with red rice, pol sambol and a coconut roti.$$, true, true, true, 2
),
(
  'dried-sprats-curry-premium', 'Dried Sprats Curry - Premium',
  'වියළි හාල්මැස්සන් කරිය', 'நெத்தலி கருவாடு கறி',
  $$Dried sprats in a creamy roasted-coconut gravy$$,
  '/products/dried-sprats-curry-premium.png', 'Curries', 890, '400g',
  $$Our premium dried sprats curry, finished in a rich roasted-coconut milk gravy with whole spices - mellow, fragrant and indulgent.$$,
  $$The premium take on a classic. Dried sprats gently simmered in a smooth roasted-coconut milk gravy with cinnamon, cardamom, black pepper and fresh curry leaves. Rounder and creamier than the everyday curry, with the fish kept tender and whole.$$,
  $$["Dried sprats / haal messo (50%)","Coconut milk","Roasted Ceylon curry powder","Onion, garlic, ginger","Cinnamon, cardamom, cloves","Black pepper","Curry leaves & pandan","Sea salt"]$$::jsonb,
  $${"servingSize":"100g","calories":240,"protein":"19g","carbs":"9g","fat":"15g","sodium":"560mg"}$$::jsonb,
  2, $$["Premium","Ready to Eat","Coconut-Rich"]$$::jsonb, '#229ba7',
  $$["Tip into a pan","Warm gently for 2–3 minutes - do not boil hard","Serve with rice, hoppers or string hoppers"]$$::jsonb,
  $$Beautiful over steamed rice or with soft hoppers.$$, true, true, true, 3
);
