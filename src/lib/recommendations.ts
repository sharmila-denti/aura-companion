export interface ProductRecommendation {
  name: string;
  activeIngredient: string;
  usage: string;
  icon: string;
  bestTime: 'morning' | 'night' | 'both' | 'weekly' | 'anytime';
  procedure: string;
  naturalAlternative: {
    name: string;
    ingredients: string;
    preparation: string;
    usage: string;
    bestTime: string;
  };
}

export const skinRecommendations: Record<string, ProductRecommendation[]> = {
  Acne: [
    {
      name: 'Salicylic Acid Cleanser', activeIngredient: 'Salicylic Acid (2%)', icon: '🧴',
      usage: 'Use twice daily to unclog pores & reduce breakouts',
      bestTime: 'both',
      procedure: '1. Wet face with lukewarm water\n2. Apply pea-sized amount\n3. Massage gently for 60 seconds\n4. Rinse thoroughly\n5. Pat dry, follow with moisturizer',
      naturalAlternative: {
        name: 'Honey & Turmeric Mask',
        ingredients: '1 tbsp raw honey + ½ tsp turmeric + 2 drops tea tree oil',
        preparation: 'Mix honey and turmeric into a paste. Add tea tree oil and stir well.',
        usage: 'Apply on affected areas, leave 15-20 min, rinse with lukewarm water',
        bestTime: 'Night — 3 times/week',
      },
    },
    {
      name: 'Benzoyl Peroxide Gel', activeIngredient: 'Benzoyl Peroxide (2.5%)', icon: '💊',
      usage: 'Spot treatment on active pimples at night',
      bestTime: 'night',
      procedure: '1. Cleanse and dry face\n2. Apply tiny dot on pimple only\n3. Let it dry for 5 min\n4. Apply moisturizer around (not over) treated area\n5. Use sunscreen next morning',
      naturalAlternative: {
        name: 'Neem Paste Spot Treatment',
        ingredients: '5-6 fresh neem leaves + few drops of water',
        preparation: 'Grind neem leaves into a fine paste with minimal water.',
        usage: 'Apply directly on pimples as spot treatment, leave 20 min, wash off',
        bestTime: 'Night — daily until pimple subsides',
      },
    },
    {
      name: 'Tea Tree Oil Serum', activeIngredient: 'Tea Tree Oil (5%)', icon: '🌿',
      usage: 'Anti-bacterial, apply on affected areas',
      bestTime: 'night',
      procedure: '1. Cleanse face\n2. Dilute 2-3 drops in carrier oil (jojoba)\n3. Apply on acne-prone areas with fingertips\n4. Leave overnight\n5. Wash off in the morning',
      naturalAlternative: {
        name: 'Aloe Vera & Basil Gel',
        ingredients: '2 tbsp fresh aloe vera gel + 5-6 crushed basil (tulsi) leaves',
        preparation: 'Blend basil leaves, mix with fresh aloe vera gel. Strain if needed.',
        usage: 'Apply thin layer on face, leave 15-20 min, rinse gently',
        bestTime: 'Night — alternate days',
      },
    },
    {
      name: 'Niacinamide Serum', activeIngredient: 'Niacinamide (10%)', icon: '✨',
      usage: 'Controls oil production & minimizes pores',
      bestTime: 'both',
      procedure: '1. After cleansing & toning\n2. Apply 3-4 drops on palm\n3. Press gently into skin (don\'t rub)\n4. Wait 1-2 min to absorb\n5. Follow with moisturizer',
      naturalAlternative: {
        name: 'Rice Water Toner',
        ingredients: '½ cup uncooked rice + 1 cup water',
        preparation: 'Soak rice in water for 30 min, strain. Ferment the water for 24 hrs at room temperature for extra potency.',
        usage: 'Apply with cotton pad after cleansing, let it air dry',
        bestTime: 'Morning & Night — daily',
      },
    },
  ],
  Pigmentation: [
    {
      name: 'Tranexamic Acid Serum', activeIngredient: 'Tranexamic Acid (3%)', icon: '🔬',
      usage: 'Fades dark spots & melasma, apply morning & night',
      bestTime: 'both',
      procedure: '1. Apply after cleansing on dry skin\n2. Use 3-4 drops on dark spots\n3. Pat gently until absorbed\n4. Wait 2 min\n5. Layer moisturizer & sunscreen (AM)',
      naturalAlternative: {
        name: 'Potato Juice Brightener',
        ingredients: '1 raw potato (grated) + 1 tsp lemon juice',
        preparation: 'Grate potato and extract juice through a cloth. Mix with lemon juice.',
        usage: 'Apply on dark spots with cotton, leave 20 min, wash off. Avoid sun after.',
        bestTime: 'Night — daily for 4-6 weeks',
      },
    },
    {
      name: 'Vitamin C Serum', activeIngredient: 'L-Ascorbic Acid (15-20%)', icon: '🍊',
      usage: 'Brightens skin & fades hyperpigmentation in AM',
      bestTime: 'morning',
      procedure: '1. Cleanse & tone\n2. Apply 4-5 drops to face & neck\n3. Pat in gently, avoid eye area\n4. Wait 2-3 min to fully absorb\n5. Apply moisturizer then SPF 50',
      naturalAlternative: {
        name: 'Lemon & Honey Brightening Mask',
        ingredients: '1 tsp fresh lemon juice + 2 tsp raw honey + 1 tsp yogurt',
        preparation: 'Mix all ingredients. Do a patch test first — lemon can be sensitizing.',
        usage: 'Apply on pigmented areas, leave 10-15 min max, rinse with cool water',
        bestTime: 'Night only — 2 times/week (always use SPF next day)',
      },
    },
    {
      name: 'Alpha Arbutin', activeIngredient: 'Alpha Arbutin (2%)', icon: '💧',
      usage: 'Inhibits melanin production, safe for daily use',
      bestTime: 'both',
      procedure: '1. Apply on clean, dry skin\n2. Use 2-3 drops on pigmented areas\n3. Gently press into skin\n4. Can layer with Vitamin C for enhanced effect\n5. Always follow with SPF in AM',
      naturalAlternative: {
        name: 'Bearberry & Licorice Infusion',
        ingredients: '1 tsp dried bearberry leaves + 1 tsp licorice root powder + 1 cup hot water',
        preparation: 'Steep in hot water for 20 min. Strain and cool completely. Store in fridge up to 5 days.',
        usage: 'Apply with cotton pad on dark spots, leave on (no rinse needed)',
        bestTime: 'Morning & Night — daily',
      },
    },
    {
      name: 'Kojic Acid Cream', activeIngredient: 'Kojic Acid (1%)', icon: '🌙',
      usage: 'Lightens dark patches, use at night',
      bestTime: 'night',
      procedure: '1. Cleanse face thoroughly\n2. Apply thin layer on dark patches only\n3. Avoid healthy skin areas\n4. Leave overnight\n5. Wash off in morning, apply SPF',
      naturalAlternative: {
        name: 'Saffron Milk Soak',
        ingredients: '4-5 saffron strands + 2 tbsp raw milk + pinch of turmeric',
        preparation: 'Soak saffron in warm milk for 15 min until milk turns golden. Add turmeric.',
        usage: 'Apply with cotton on face, leave 20 min, rinse with cool water',
        bestTime: 'Night — 3-4 times/week',
      },
    },
  ],
  Oily: [
    {
      name: 'Niacinamide Serum', activeIngredient: 'Niacinamide (10%) + Zinc (1%)', icon: '✨',
      usage: 'Controls sebum & even skin tone, AM & PM',
      bestTime: 'both',
      procedure: '1. Cleanse & tone\n2. Apply 3-4 drops on oily zones (T-zone)\n3. Pat in gently\n4. Wait 1-2 min\n5. Follow with lightweight gel moisturizer',
      naturalAlternative: {
        name: 'Multani Mitti (Fuller\'s Earth) Pack',
        ingredients: '2 tbsp multani mitti + 1 tbsp rose water + 1 tsp lemon juice',
        preparation: 'Mix into a smooth paste. Add more rose water if too thick.',
        usage: 'Apply even layer on face, leave until semi-dry (10-12 min), rinse with cool water',
        bestTime: 'Night — 2 times/week',
      },
    },
    {
      name: 'Oil-Free Gel Moisturizer', activeIngredient: 'Hyaluronic Acid', icon: '💧',
      usage: 'Lightweight hydration without clogging pores',
      bestTime: 'both',
      procedure: '1. Apply after serum step\n2. Use pea-sized amount\n3. Dot on forehead, cheeks, chin\n4. Spread in upward motions\n5. Wait 1 min before SPF',
      naturalAlternative: {
        name: 'Aloe Vera Gel Moisturizer',
        ingredients: 'Fresh aloe vera leaf (inner gel)',
        preparation: 'Scoop out clear gel from aloe leaf. Blend smooth. Store in fridge for up to 1 week.',
        usage: 'Apply thin layer as moisturizer on clean skin',
        bestTime: 'Morning & Night — daily',
      },
    },
    {
      name: 'Clay Mask', activeIngredient: 'Kaolin + Bentonite Clay', icon: '🏺',
      usage: 'Weekly to absorb excess oil & deep cleanse',
      bestTime: 'weekly',
      procedure: '1. Cleanse face first\n2. Apply even layer avoiding eyes & lips\n3. Leave 10-15 min (don\'t let it fully dry)\n4. Mist with water to keep damp\n5. Rinse with lukewarm water, moisturize',
      naturalAlternative: {
        name: 'Besan (Gram Flour) Pack',
        ingredients: '2 tbsp besan + 1 tbsp yogurt + 1 tsp turmeric + rose water',
        preparation: 'Mix all into a thick paste. Adjust consistency with rose water.',
        usage: 'Apply on face, leave 15 min until slightly dry, scrub gently while rinsing',
        bestTime: 'Evening — 2 times/week',
      },
    },
    {
      name: 'BHA Exfoliant', activeIngredient: 'Salicylic Acid (2%)', icon: '🧪',
      usage: '2-3 times/week to keep pores clear',
      bestTime: 'night',
      procedure: '1. After cleansing, apply with cotton pad\n2. Swipe over oily/congested areas\n3. Do NOT rinse off\n4. Wait 2-3 min\n5. Continue with rest of routine',
      naturalAlternative: {
        name: 'Papaya Enzyme Scrub',
        ingredients: '2 tbsp ripe papaya (mashed) + 1 tsp honey',
        preparation: 'Mash ripe papaya until smooth. Mix with honey.',
        usage: 'Apply on face, gently massage in circles for 2 min, leave 5 min, rinse',
        bestTime: 'Night — 2 times/week',
      },
    },
  ],
  Dry: [
    {
      name: 'Hyaluronic Acid Serum', activeIngredient: 'Hyaluronic Acid (2%)', icon: '💧',
      usage: 'Apply on damp skin for deep hydration',
      bestTime: 'both',
      procedure: '1. Cleanse & leave skin slightly damp\n2. Apply 3-4 drops immediately\n3. Press into skin (MUST apply on wet skin)\n4. Seal with moisturizer within 30 sec\n5. Never use on dry skin — it pulls moisture out',
      naturalAlternative: {
        name: 'Honey & Milk Face Pack',
        ingredients: '1 tbsp raw honey + 2 tbsp raw milk + 1 tsp almond oil',
        preparation: 'Warm honey slightly. Mix all ingredients until smooth.',
        usage: 'Apply thick layer on face & neck, leave 20 min, rinse with lukewarm water',
        bestTime: 'Night — 3 times/week',
      },
    },
    {
      name: 'Ceramide Moisturizer', activeIngredient: 'Ceramides + Cholesterol', icon: '🛡️',
      usage: 'Repairs skin barrier, use AM & PM',
      bestTime: 'both',
      procedure: '1. Apply after serum on damp skin\n2. Use generous amount\n3. Press & pat into skin (don\'t rub)\n4. Focus on driest areas\n5. Layer SPF on top in AM',
      naturalAlternative: {
        name: 'Shea Butter & Coconut Balm',
        ingredients: '1 tbsp raw shea butter + 1 tsp virgin coconut oil + 2 drops lavender oil',
        preparation: 'Melt shea butter gently, mix in coconut oil & lavender. Let it solidify at room temp.',
        usage: 'Apply small amount on very dry patches, massage until absorbed',
        bestTime: 'Night — daily for intense repair',
      },
    },
    {
      name: 'Squalane Oil', activeIngredient: 'Plant-derived Squalane', icon: '🫒',
      usage: 'Locks in moisture, mix with moisturizer',
      bestTime: 'night',
      procedure: '1. Apply as last step of nighttime routine\n2. Mix 2-3 drops with moisturizer or apply alone\n3. Press into skin with palms\n4. Focus on dry cheeks & forehead\n5. Leave overnight for deep repair',
      naturalAlternative: {
        name: 'Cold-Pressed Olive Oil Treatment',
        ingredients: 'Extra virgin olive oil (cold-pressed)',
        preparation: 'No prep needed — use directly from bottle.',
        usage: 'Warm 3-4 drops between palms, press gently into dry areas of face',
        bestTime: 'Night — daily (skip if acne-prone)',
      },
    },
    {
      name: 'Gentle Cream Cleanser', activeIngredient: 'Glycerin + Aloe Vera', icon: '🧴',
      usage: 'Non-stripping cleanse, twice daily',
      bestTime: 'both',
      procedure: '1. Use lukewarm water (never hot)\n2. Apply small amount to wet face\n3. Massage 30 seconds max\n4. Rinse gently\n5. Immediately apply serum/moisturizer (within 60 sec)',
      naturalAlternative: {
        name: 'Milk & Honey Cleanser',
        ingredients: '2 tbsp raw milk + 1 tsp honey',
        preparation: 'Mix fresh. Make new batch each time.',
        usage: 'Massage onto face for 1 min, rinse with lukewarm water',
        bestTime: 'Morning & Night — daily',
      },
    },
  ],
  Redness: [
    {
      name: 'Centella Asiatica Serum', activeIngredient: 'Centella (CICA)', icon: '🌱',
      usage: 'Calms inflammation & repairs skin barrier',
      bestTime: 'both',
      procedure: '1. Apply on clean, dry skin\n2. Use 3-4 drops on red/irritated areas\n3. Pat gently — never rub inflamed skin\n4. Wait 2 min\n5. Follow with gentle moisturizer',
      naturalAlternative: {
        name: 'Cucumber & Aloe Soothing Gel',
        ingredients: '½ cucumber (blended) + 2 tbsp aloe vera gel + 1 tsp chamomile tea (cooled)',
        preparation: 'Blend cucumber, strain juice. Mix with aloe & chamomile tea. Store in fridge.',
        usage: 'Apply cold gel on red areas, leave 15-20 min, rinse or leave on',
        bestTime: 'Anytime skin feels irritated — can use multiple times daily',
      },
    },
    {
      name: 'Azelaic Acid Cream', activeIngredient: 'Azelaic Acid (10%)', icon: '🔬',
      usage: 'Reduces redness & rosacea, AM & PM',
      bestTime: 'both',
      procedure: '1. Apply thin layer after cleansing\n2. Focus on red/flushed areas\n3. May tingle slightly — normal\n4. Wait 5 min before next step\n5. Start every other night, build up to daily',
      naturalAlternative: {
        name: 'Oatmeal Calming Mask',
        ingredients: '2 tbsp colloidal oatmeal + 1 tbsp raw honey + 1 tbsp yogurt',
        preparation: 'Grind oats to fine powder. Mix with honey and yogurt until paste forms.',
        usage: 'Apply on face, leave 15-20 min, rinse with cool water. Pat dry gently.',
        bestTime: 'Night — 3-4 times/week',
      },
    },
    {
      name: 'Green Tea Toner', activeIngredient: 'EGCG (Green Tea Extract)', icon: '🍵',
      usage: 'Anti-inflammatory, soothing after cleanse',
      bestTime: 'both',
      procedure: '1. Apply with cotton pad or spray bottle\n2. Gently press onto skin\n3. Don\'t rub or drag\n4. Let air dry or pat dry\n5. Follow with serum',
      naturalAlternative: {
        name: 'DIY Green Tea Mist',
        ingredients: '1 green tea bag + 1 cup hot water + 2 drops chamomile essential oil',
        preparation: 'Steep tea bag for 10 min. Cool completely. Add chamomile oil. Pour into spray bottle. Store in fridge up to 7 days.',
        usage: 'Mist on face after cleansing or anytime skin feels flushed',
        bestTime: 'Morning & Night + throughout day as needed',
      },
    },
    {
      name: 'Aloe Vera Gel', activeIngredient: 'Pure Aloe Vera (98%)', icon: '🌿',
      usage: 'Instant soothing for irritated skin',
      bestTime: 'anytime',
      procedure: '1. Apply generous layer on irritated areas\n2. Can use on damp skin\n3. Let absorb naturally\n4. Can layer moisturizer on top\n5. Safe for multiple daily applications',
      naturalAlternative: {
        name: 'Fresh Aloe Vera Leaf',
        ingredients: '1 fresh aloe vera leaf',
        preparation: 'Cut leaf, scrape out clear inner gel (avoid yellow sap — it irritates). Blend for smooth texture.',
        usage: 'Apply fresh gel directly on skin. Store remaining in fridge for 5-7 days.',
        bestTime: 'Anytime — multiple times daily. Best straight from fridge for cooling effect.',
      },
    },
  ],
  Clear: [
    {
      name: 'Vitamin C Serum', activeIngredient: 'L-Ascorbic Acid (15%)', icon: '🍊',
      usage: 'Maintain glow & protect from free radicals',
      bestTime: 'morning',
      procedure: '1. Apply after cleansing & toning\n2. Use 4-5 drops on face & neck\n3. Pat gently, avoid eye area\n4. Wait 2-3 min\n5. Always follow with SPF 50',
      naturalAlternative: {
        name: 'Orange Peel Powder Pack',
        ingredients: '1 tbsp dried orange peel powder + 1 tbsp yogurt + 1 tsp honey',
        preparation: 'Dry orange peels in sun for 2-3 days, grind to powder. Mix with yogurt & honey.',
        usage: 'Apply on face & neck, leave 15 min, rinse with lukewarm water',
        bestTime: 'Morning — 2-3 times/week',
      },
    },
    {
      name: 'SPF 50 Sunscreen', activeIngredient: 'Zinc Oxide + Titanium Dioxide', icon: '☀️',
      usage: 'Essential daily protection, reapply every 2hrs',
      bestTime: 'morning',
      procedure: '1. Apply as LAST skincare step\n2. Use 2-finger rule (two strips on index + middle finger)\n3. Dot on face, spread evenly\n4. Don\'t forget ears, neck & hands\n5. Reapply every 2 hrs if outdoors',
      naturalAlternative: {
        name: 'DIY Zinc Oxide Sunscreen',
        ingredients: '2 tbsp coconut oil + 1 tbsp shea butter + 1 tbsp zinc oxide powder (non-nano)',
        preparation: 'Melt coconut oil & shea butter. Cool slightly. Mix in zinc oxide powder (wear mask to avoid inhaling). Pour into jar.',
        usage: 'Apply generously on face before sun exposure. SPF ~15-20 only — use commercial SPF for intense sun',
        bestTime: 'Morning — reapply every 2 hrs outdoors',
      },
    },
    {
      name: 'Retinol Serum', activeIngredient: 'Retinol (0.3-0.5%)', icon: '🌙',
      usage: 'Anti-aging prevention, use at night 2-3x/week',
      bestTime: 'night',
      procedure: '1. Cleanse & dry face completely\n2. Apply pea-sized amount to full face\n3. Avoid eye area & corners of nose\n4. Wait 5 min, apply moisturizer\n5. Start 1x/week, build up slowly. ALWAYS use SPF next day.',
      naturalAlternative: {
        name: 'Rosehip Seed Oil',
        ingredients: 'Cold-pressed rosehip seed oil (natural source of tretinoin)',
        preparation: 'No prep needed — rosehip oil naturally contains retinol (Vitamin A).',
        usage: 'Apply 3-4 drops on face at night. Press into skin. Follow with moisturizer.',
        bestTime: 'Night — daily (gentler than synthetic retinol)',
      },
    },
  ],
};

export const hairRecommendations: Record<string, ProductRecommendation[]> = {
  'Hair Fall': [
    {
      name: 'Redensyl Serum', activeIngredient: 'Redensyl (3%)', icon: '🧬',
      usage: 'Apply on scalp daily, stimulates hair stem cells',
      bestTime: 'night',
      procedure: '1. Part hair into sections\n2. Apply drops directly on scalp\n3. Massage in circular motions for 3-5 min\n4. Leave overnight\n5. Wash off next morning. Results in 8-12 weeks.',
      naturalAlternative: {
        name: 'Onion Juice Hair Treatment',
        ingredients: '2 medium onions (juiced) + 1 tbsp coconut oil',
        preparation: 'Blend onions, strain juice through cloth. Mix with coconut oil.',
        usage: 'Apply on scalp, massage for 5 min, leave 30-45 min, wash with mild shampoo',
        bestTime: 'Day (before wash) — 2-3 times/week for 8 weeks',
      },
    },
    {
      name: 'Minoxidil Solution', activeIngredient: 'Minoxidil (2-5%)', icon: '💊',
      usage: 'Apply on scalp twice daily for regrowth',
      bestTime: 'both',
      procedure: '1. Apply 1ml on dry scalp\n2. Focus on thinning areas\n3. Use dropper directly on scalp\n4. Massage gently for 2 min\n5. Don\'t wash for 4 hrs. Use consistently — stopping reverses results.',
      naturalAlternative: {
        name: 'Rosemary Oil Scalp Massage',
        ingredients: '10 drops rosemary essential oil + 2 tbsp coconut/olive oil',
        preparation: 'Mix rosemary oil with carrier oil. Warm slightly between palms.',
        usage: 'Massage into scalp for 5-10 min with fingertips. Leave 1-2 hrs or overnight.',
        bestTime: 'Night — daily (shown to rival minoxidil in studies)',
      },
    },
    {
      name: 'Biotin Supplement', activeIngredient: 'Biotin (10,000 mcg)', icon: '💊',
      usage: 'One tablet daily for stronger hair',
      bestTime: 'morning',
      procedure: '1. Take 1 tablet with breakfast\n2. Drink full glass of water\n3. Be consistent — results in 3-6 months\n4. May also strengthen nails\n5. Consult doctor if on other medications',
      naturalAlternative: {
        name: 'Biotin-Rich Diet Plan',
        ingredients: 'Eggs, almonds, sweet potatoes, spinach, bananas',
        preparation: 'Include these biotin-rich foods daily: 2 eggs + handful of almonds + 1 banana.',
        usage: 'Eat as part of daily diet. No supplements needed if diet is rich in biotin.',
        bestTime: 'Breakfast & lunch — daily',
      },
    },
    {
      name: 'Caffeine Shampoo', activeIngredient: 'Caffeine Complex', icon: '☕',
      usage: 'Stimulates follicles, use 3-4x/week',
      bestTime: 'morning',
      procedure: '1. Wet hair thoroughly\n2. Apply and lather\n3. Leave on scalp for 2-3 min (important!)\n4. Massage scalp while waiting\n5. Rinse thoroughly. Don\'t use daily — alternate with gentle shampoo.',
      naturalAlternative: {
        name: 'Coffee Rinse',
        ingredients: '2 cups brewed black coffee (cooled) + 1 tbsp apple cider vinegar',
        preparation: 'Brew strong coffee, let it cool completely. Mix in ACV.',
        usage: 'After shampooing, pour through hair as final rinse. Massage scalp. Leave 5 min, rinse with water.',
        bestTime: 'Morning (wash day) — 2-3 times/week',
      },
    },
  ],
  'Dandruff': [
    {
      name: 'Ketoconazole Shampoo', activeIngredient: 'Ketoconazole (2%)', icon: '🧴',
      usage: 'Anti-fungal, use 2-3 times/week',
      bestTime: 'anytime',
      procedure: '1. Wet scalp thoroughly\n2. Apply and work into lather on scalp\n3. Leave for 3-5 min (critical for effectiveness)\n4. Rinse well\n5. Follow with regular conditioner on ends only',
      naturalAlternative: {
        name: 'Apple Cider Vinegar Rinse',
        ingredients: '2 tbsp raw ACV + 1 cup warm water + 3 drops tea tree oil',
        preparation: 'Mix ACV with warm water. Add tea tree oil.',
        usage: 'After shampoo, pour on scalp, massage 2 min, rinse with cool water',
        bestTime: 'Wash days — 2-3 times/week',
      },
    },
    {
      name: 'Zinc Pyrithione Shampoo', activeIngredient: 'Zinc Pyrithione (1%)', icon: '🧴',
      usage: 'Controls flaking, alternate with regular shampoo',
      bestTime: 'anytime',
      procedure: '1. Apply to wet scalp\n2. Massage into scalp for 2-3 min\n3. Leave for 1-2 min more\n4. Rinse thoroughly\n5. Alternate with regular shampoo to prevent resistance',
      naturalAlternative: {
        name: 'Fenugreek (Methi) Seed Paste',
        ingredients: '2 tbsp fenugreek seeds (soaked overnight) + 2 tbsp yogurt',
        preparation: 'Soak seeds overnight. Grind to smooth paste. Mix with yogurt.',
        usage: 'Apply on scalp, leave 30-45 min, wash with mild shampoo',
        bestTime: 'Morning (before wash) — 2 times/week',
      },
    },
    {
      name: 'Salicylic Acid Scalp Serum', activeIngredient: 'Salicylic Acid (3%)', icon: '🧪',
      usage: 'Exfoliates scalp buildup, weekly treatment',
      bestTime: 'weekly',
      procedure: '1. Apply to dry scalp before washing\n2. Section hair and apply along partings\n3. Massage gently for 3 min\n4. Leave 10-15 min\n5. Shampoo and condition as normal',
      naturalAlternative: {
        name: 'Lemon & Coconut Oil Scrub',
        ingredients: '2 tbsp coconut oil + 1 tbsp lemon juice + 1 tbsp sugar (fine)',
        preparation: 'Mix coconut oil with lemon juice. Add fine sugar as exfoliant.',
        usage: 'Gently scrub scalp with fingertips for 5 min. Wash off with shampoo.',
        bestTime: 'Before wash — once/week',
      },
    },
    {
      name: 'Tea Tree Oil', activeIngredient: 'Tea Tree Oil (5%)', icon: '🌿',
      usage: 'Add 2-3 drops to shampoo, anti-microbial',
      bestTime: 'anytime',
      procedure: '1. Add 2-3 drops to your regular shampoo\n2. Mix in palm before applying\n3. Massage into scalp for 3 min\n4. Rinse well\n5. Can also add to coconut oil for pre-wash treatment',
      naturalAlternative: {
        name: 'Neem Oil Scalp Treatment',
        ingredients: '1 tbsp neem oil + 2 tbsp coconut oil + 5 drops tea tree oil',
        preparation: 'Warm coconut oil, mix in neem oil and tea tree oil.',
        usage: 'Apply on scalp, massage for 5 min, leave 30 min minimum. Wash with shampoo.',
        bestTime: 'Night or 1hr before wash — 2 times/week',
      },
    },
  ],
  'Dryness': [
    {
      name: 'Argan Oil Treatment', activeIngredient: 'Pure Argan Oil', icon: '🫒',
      usage: 'Apply on damp ends after washing',
      bestTime: 'both',
      procedure: '1. Towel dry hair gently\n2. Take 2-3 drops on palms\n3. Rub palms together to warm\n4. Apply on mid-lengths to ends only\n5. Never apply on roots — causes greasy look',
      naturalAlternative: {
        name: 'Coconut Milk Hair Mask',
        ingredients: '½ cup fresh coconut milk + 1 tbsp honey + 1 tbsp olive oil',
        preparation: 'Mix all ingredients. Warm slightly (not hot).',
        usage: 'Apply root to tip, cover with shower cap, leave 30-45 min, wash with shampoo',
        bestTime: 'Before wash — once/week',
      },
    },
    {
      name: 'Deep Conditioning Mask', activeIngredient: 'Keratin + Shea Butter', icon: '🧖',
      usage: 'Weekly deep treatment for 20 minutes',
      bestTime: 'weekly',
      procedure: '1. Shampoo hair first\n2. Squeeze out excess water\n3. Apply thick layer from mid-length to ends\n4. Cover with shower cap or warm towel\n5. Leave 20-30 min, rinse with cool water to seal cuticle',
      naturalAlternative: {
        name: 'Banana & Avocado Mask',
        ingredients: '1 ripe banana + ½ ripe avocado + 1 tbsp honey + 1 tbsp olive oil',
        preparation: 'Blend all ingredients until completely smooth (no chunks — they\'re hard to wash out).',
        usage: 'Apply on damp hair, cover with cap, leave 30 min. Rinse thoroughly, shampoo once.',
        bestTime: 'Before wash — once/week',
      },
    },
    {
      name: 'Leave-in Conditioner', activeIngredient: 'Coconut Oil + Protein', icon: '💧',
      usage: 'Apply on towel-dried hair, don\'t rinse',
      bestTime: 'both',
      procedure: '1. Apply on towel-dried or damp hair\n2. Use spray or cream on mid-lengths to ends\n3. Comb through with wide-tooth comb\n4. Style as normal\n5. Don\'t apply on roots',
      naturalAlternative: {
        name: 'Aloe Vera Leave-in Spray',
        ingredients: '3 tbsp aloe vera gel + 1 cup water + 1 tsp coconut oil + 5 drops essential oil',
        preparation: 'Blend aloe gel with water until smooth. Mix in oils. Pour into spray bottle.',
        usage: 'Spray on damp hair after washing. Don\'t rinse. Style as usual.',
        bestTime: 'After every wash — morning or night',
      },
    },
  ],
  'Oily Scalp': [
    {
      name: 'Clarifying Shampoo', activeIngredient: 'Charcoal + AHA', icon: '🧴',
      usage: 'Deep cleanses scalp, use 1-2x/week',
      bestTime: 'anytime',
      procedure: '1. Wet hair thoroughly\n2. Apply on scalp only, not lengths\n3. Massage 2-3 min\n4. Rinse well\n5. Always follow with conditioner on ends — clarifying shampoos are stripping',
      naturalAlternative: {
        name: 'Baking Soda Scalp Detox',
        ingredients: '1 tbsp baking soda + 3 tbsp water',
        preparation: 'Mix into thin paste.',
        usage: 'Apply on scalp only, massage 2 min. Rinse, follow with ACV rinse.',
        bestTime: 'Once every 2 weeks only — too frequent use disrupts pH',
      },
    },
    {
      name: 'Apple Cider Vinegar Rinse', activeIngredient: 'ACV (Diluted)', icon: '🍎',
      usage: 'Balances scalp pH, use after shampoo weekly',
      bestTime: 'weekly',
      procedure: '1. Mix 2 tbsp ACV in 1 cup cool water\n2. After shampooing, pour over scalp\n3. Massage 1-2 min\n4. Leave 2-3 min\n5. Rinse with cool water',
      naturalAlternative: {
        name: 'Lemon & Green Tea Rinse',
        ingredients: '1 cup brewed green tea (cooled) + juice of 1 lemon',
        preparation: 'Brew green tea, cool completely. Add fresh lemon juice.',
        usage: 'Pour on scalp after shampooing, massage gently, rinse after 3 min',
        bestTime: 'Wash days — 1-2 times/week',
      },
    },
    {
      name: 'Niacinamide Scalp Serum', activeIngredient: 'Niacinamide (5%)', icon: '✨',
      usage: 'Controls oil at roots, apply to dry scalp',
      bestTime: 'night',
      procedure: '1. Part hair into sections\n2. Apply drops on dry scalp\n3. Massage for 2 min\n4. Don\'t rinse — leave on\n5. Wash hair next morning as usual',
      naturalAlternative: {
        name: 'Rice Water Scalp Tonic',
        ingredients: '½ cup rice water (fermented 24hrs) + 3 drops peppermint oil',
        preparation: 'Soak rice in water for 30 min, strain. Let rice water ferment at room temp for 24 hrs. Add peppermint oil.',
        usage: 'Apply on scalp with cotton, massage gently. Leave 20 min, rinse.',
        bestTime: 'Before wash — 2 times/week',
      },
    },
  ],
  'Thinning': [
    {
      name: 'Procapil Serum', activeIngredient: 'Procapil (3%)', icon: '🧬',
      usage: 'Strengthens hair anchoring, apply nightly',
      bestTime: 'night',
      procedure: '1. Apply on clean, dry scalp\n2. Part hair and apply along partings\n3. Massage for 3-5 min\n4. Leave overnight\n5. Wash in morning. Use consistently for 3-6 months.',
      naturalAlternative: {
        name: 'Bhringraj Oil Treatment',
        ingredients: '2 tbsp bhringraj oil + 1 tbsp castor oil + 5 drops rosemary oil',
        preparation: 'Mix all oils. Warm slightly between palms.',
        usage: 'Massage into scalp for 10 min with fingertips (not nails). Leave 2 hrs or overnight.',
        bestTime: 'Night — 3 times/week',
      },
    },
    {
      name: 'Rosemary Oil', activeIngredient: 'Rosemary Essential Oil', icon: '🌿',
      usage: 'Massage into scalp 2-3x/week, rivals minoxidil',
      bestTime: 'night',
      procedure: '1. Mix 5-6 drops with 1 tbsp carrier oil\n2. Part hair into sections\n3. Apply on scalp\n4. Massage in circular motions for 5 min\n5. Leave minimum 2 hrs, preferably overnight',
      naturalAlternative: {
        name: 'Rosemary Water Rinse',
        ingredients: '3-4 fresh rosemary sprigs + 2 cups water',
        preparation: 'Boil rosemary in water for 15 min. Strain and cool. Store in fridge up to 1 week.',
        usage: 'Use as final rinse after shampooing. Don\'t rinse out. Can also spray on scalp daily.',
        bestTime: 'After every wash + daily as scalp spray',
      },
    },
    {
      name: 'Peptide Hair Serum', activeIngredient: 'Copper Peptides', icon: '🔬',
      usage: 'Promotes thicker growth, daily scalp application',
      bestTime: 'night',
      procedure: '1. Apply on clean, dry scalp\n2. Use dropper to apply along partings\n3. Massage gently for 2 min\n4. Leave on — don\'t rinse\n5. Style hair as normal',
      naturalAlternative: {
        name: 'Egg & Castor Oil Protein Mask',
        ingredients: '1 whole egg + 1 tbsp castor oil + 1 tbsp olive oil',
        preparation: 'Whisk egg well. Mix in oils until uniform.',
        usage: 'Apply on scalp & hair, leave 30-40 min. Wash with COOL water (hot water cooks the egg!).',
        bestTime: 'Before wash — once/week',
      },
    },
    {
      name: 'Saw Palmetto Supplement', activeIngredient: 'Saw Palmetto Extract', icon: '💊',
      usage: 'Blocks DHT naturally, one capsule daily',
      bestTime: 'morning',
      procedure: '1. Take 1 capsule (320mg) with food\n2. Take with breakfast for best absorption\n3. Be consistent — results in 3-6 months\n4. Consult doctor if on hormonal medications\n5. Not recommended during pregnancy',
      naturalAlternative: {
        name: 'Pumpkin Seed Oil (Oral)',
        ingredients: 'Cold-pressed pumpkin seed oil capsules or 1 tbsp oil',
        preparation: 'Take as capsule or add oil to salads/smoothies.',
        usage: 'Take 1000mg daily or 1 tbsp oil with meals. Also a natural DHT blocker.',
        bestTime: 'Morning with breakfast — daily',
      },
    },
  ],
  'Frizzy': [
    {
      name: 'Keratin Treatment Spray', activeIngredient: 'Hydrolyzed Keratin', icon: '✨',
      usage: 'Smooths cuticle, spray on damp hair',
      bestTime: 'both',
      procedure: '1. Wash hair and towel dry\n2. Spray evenly on mid-lengths to ends\n3. Comb through with wide-tooth comb\n4. Can blow-dry or air dry\n5. Reapply after each wash',
      naturalAlternative: {
        name: 'Flaxseed Gel',
        ingredients: '¼ cup flaxseeds + 2 cups water + 1 tsp aloe vera gel',
        preparation: 'Boil flaxseeds in water on medium heat, stirring constantly. When liquid gets gel-like consistency, strain immediately. Mix in aloe vera. Store in fridge 2 weeks.',
        usage: 'Apply on damp hair as styling gel. Scrunching motion for curly, smooth for straight.',
        bestTime: 'After every wash — morning or night',
      },
    },
    {
      name: 'Anti-Frizz Serum', activeIngredient: 'Silicone + Argan Oil', icon: '💧',
      usage: 'Apply tiny amount on dry ends',
      bestTime: 'both',
      procedure: '1. Take 1-2 drops only\n2. Rub between palms\n3. Apply on dry ends with smoothing motion\n4. Can also use before heat styling\n5. Avoid roots — causes buildup',
      naturalAlternative: {
        name: 'Coconut Oil & Shea Butter Balm',
        ingredients: '1 tbsp virgin coconut oil + 1 tbsp shea butter + 5 drops argan oil',
        preparation: 'Melt coconut oil & shea butter. Mix in argan oil. Let it solidify. Whip with fork for fluffy texture.',
        usage: 'Tiny pea-sized amount — warm between palms, smooth over frizzy ends',
        bestTime: 'Morning (styling) & Night (overnight treatment on ends)',
      },
    },
    {
      name: 'Silk Protein Mask', activeIngredient: 'Silk Amino Acids', icon: '🧖',
      usage: 'Weekly mask for 15 min, smooths & softens',
      bestTime: 'weekly',
      procedure: '1. Apply after shampooing on damp hair\n2. Focus on mid-lengths to ends\n3. Cover with shower cap\n4. Leave 15-20 min\n5. Rinse with COOL water to seal cuticle',
      naturalAlternative: {
        name: 'Yogurt & Honey Smoothing Mask',
        ingredients: '3 tbsp plain yogurt + 1 tbsp honey + 1 tbsp olive oil + 1 egg white',
        preparation: 'Mix all ingredients until smooth. No heating needed.',
        usage: 'Apply on damp hair, cover with cap, leave 30 min. Rinse with cool water, shampoo once.',
        bestTime: 'Before wash — once/week',
      },
    },
  ],
};

export function getSkinRecommendations(conditions: string[]): { condition: string; products: ProductRecommendation[] }[] {
  return conditions
    .filter(c => skinRecommendations[c])
    .map(c => ({ condition: c, products: skinRecommendations[c] }));
}

export function getHairRecommendations(concerns: string[]): { concern: string; products: ProductRecommendation[] }[] {
  return concerns
    .filter(c => hairRecommendations[c])
    .map(c => ({ concern: c, products: hairRecommendations[c] }));
}

export function getBestTimeLabel(time: ProductRecommendation['bestTime']): { label: string; emoji: string } {
  switch (time) {
    case 'morning': return { label: 'Morning', emoji: '🌅' };
    case 'night': return { label: 'Night', emoji: '🌙' };
    case 'both': return { label: 'AM & PM', emoji: '🔄' };
    case 'weekly': return { label: 'Weekly', emoji: '📅' };
    case 'anytime': return { label: 'Anytime', emoji: '⏰' };
  }
}
