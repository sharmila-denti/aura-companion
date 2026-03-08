export interface ProductRecommendation {
  name: string;
  activeIngredient: string;
  usage: string;
  icon: string;
}

export const skinRecommendations: Record<string, ProductRecommendation[]> = {
  Acne: [
    { name: 'Salicylic Acid Cleanser', activeIngredient: 'Salicylic Acid (2%)', usage: 'Use twice daily to unclog pores & reduce breakouts', icon: '🧴' },
    { name: 'Benzoyl Peroxide Gel', activeIngredient: 'Benzoyl Peroxide (2.5%)', usage: 'Spot treatment on active pimples at night', icon: '💊' },
    { name: 'Tea Tree Oil Serum', activeIngredient: 'Tea Tree Oil (5%)', usage: 'Anti-bacterial, apply on affected areas', icon: '🌿' },
    { name: 'Niacinamide Serum', activeIngredient: 'Niacinamide (10%)', usage: 'Controls oil production & minimizes pores', icon: '✨' },
  ],
  Pigmentation: [
    { name: 'Tranexamic Acid Serum', activeIngredient: 'Tranexamic Acid (3%)', usage: 'Fades dark spots & melasma, apply morning & night', icon: '🔬' },
    { name: 'Vitamin C Serum', activeIngredient: 'L-Ascorbic Acid (15-20%)', usage: 'Brightens skin & fades hyperpigmentation in AM', icon: '🍊' },
    { name: 'Alpha Arbutin', activeIngredient: 'Alpha Arbutin (2%)', usage: 'Inhibits melanin production, safe for daily use', icon: '💧' },
    { name: 'Kojic Acid Cream', activeIngredient: 'Kojic Acid (1%)', usage: 'Lightens dark patches, use at night', icon: '🌙' },
  ],
  Oily: [
    { name: 'Niacinamide Serum', activeIngredient: 'Niacinamide (10%) + Zinc (1%)', usage: 'Controls sebum & even skin tone, AM & PM', icon: '✨' },
    { name: 'Oil-Free Gel Moisturizer', activeIngredient: 'Hyaluronic Acid', usage: 'Lightweight hydration without clogging pores', icon: '💧' },
    { name: 'Clay Mask', activeIngredient: 'Kaolin + Bentonite Clay', usage: 'Weekly to absorb excess oil & deep cleanse', icon: '🏺' },
    { name: 'BHA Exfoliant', activeIngredient: 'Salicylic Acid (2%)', usage: '2-3 times/week to keep pores clear', icon: '🧪' },
  ],
  Dry: [
    { name: 'Hyaluronic Acid Serum', activeIngredient: 'Hyaluronic Acid (2%)', usage: 'Apply on damp skin for deep hydration', icon: '💧' },
    { name: 'Ceramide Moisturizer', activeIngredient: 'Ceramides + Cholesterol', usage: 'Repairs skin barrier, use AM & PM', icon: '🛡️' },
    { name: 'Squalane Oil', activeIngredient: 'Plant-derived Squalane', usage: 'Locks in moisture, mix with moisturizer', icon: '🫒' },
    { name: 'Gentle Cream Cleanser', activeIngredient: 'Glycerin + Aloe Vera', usage: 'Non-stripping cleanse, twice daily', icon: '🧴' },
  ],
  Redness: [
    { name: 'Centella Asiatica Serum', activeIngredient: 'Centella (CICA)', usage: 'Calms inflammation & repairs skin barrier', icon: '🌱' },
    { name: 'Azelaic Acid Cream', activeIngredient: 'Azelaic Acid (10%)', usage: 'Reduces redness & rosacea, AM & PM', icon: '🔬' },
    { name: 'Green Tea Toner', activeIngredient: 'EGCG (Green Tea Extract)', usage: 'Anti-inflammatory, soothing after cleanse', icon: '🍵' },
    { name: 'Aloe Vera Gel', activeIngredient: 'Pure Aloe Vera (98%)', usage: 'Instant soothing for irritated skin', icon: '🌿' },
  ],
  Clear: [
    { name: 'Vitamin C Serum', activeIngredient: 'L-Ascorbic Acid (15%)', usage: 'Maintain glow & protect from free radicals', icon: '🍊' },
    { name: 'SPF 50 Sunscreen', activeIngredient: 'Zinc Oxide + Titanium Dioxide', usage: 'Essential daily protection, reapply every 2hrs', icon: '☀️' },
    { name: 'Retinol Serum', activeIngredient: 'Retinol (0.3-0.5%)', usage: 'Anti-aging prevention, use at night 2-3x/week', icon: '🌙' },
  ],
};

export const hairRecommendations: Record<string, ProductRecommendation[]> = {
  'Hair Fall': [
    { name: 'Redensyl Serum', activeIngredient: 'Redensyl (3%)', usage: 'Apply on scalp daily, stimulates hair stem cells', icon: '🧬' },
    { name: 'Minoxidil Solution', activeIngredient: 'Minoxidil (2-5%)', usage: 'Apply on scalp twice daily for regrowth', icon: '💊' },
    { name: 'Biotin Supplement', activeIngredient: 'Biotin (10,000 mcg)', usage: 'One tablet daily for stronger hair', icon: '💊' },
    { name: 'Caffeine Shampoo', activeIngredient: 'Caffeine Complex', usage: 'Stimulates follicles, use 3-4x/week', icon: '☕' },
  ],
  'Dandruff': [
    { name: 'Ketoconazole Shampoo', activeIngredient: 'Ketoconazole (2%)', usage: 'Anti-fungal, use 2-3 times/week', icon: '🧴' },
    { name: 'Zinc Pyrithione Shampoo', activeIngredient: 'Zinc Pyrithione (1%)', usage: 'Controls flaking, alternate with regular shampoo', icon: '🧴' },
    { name: 'Salicylic Acid Scalp Serum', activeIngredient: 'Salicylic Acid (3%)', usage: 'Exfoliates scalp buildup, weekly treatment', icon: '🧪' },
    { name: 'Tea Tree Oil', activeIngredient: 'Tea Tree Oil (5%)', usage: 'Add 2-3 drops to shampoo, anti-microbial', icon: '🌿' },
  ],
  'Dryness': [
    { name: 'Argan Oil Treatment', activeIngredient: 'Pure Argan Oil', usage: 'Apply on damp ends after washing', icon: '🫒' },
    { name: 'Deep Conditioning Mask', activeIngredient: 'Keratin + Shea Butter', usage: 'Weekly deep treatment for 20 minutes', icon: '🧖' },
    { name: 'Leave-in Conditioner', activeIngredient: 'Coconut Oil + Protein', usage: 'Apply on towel-dried hair, don\'t rinse', icon: '💧' },
  ],
  'Oily Scalp': [
    { name: 'Clarifying Shampoo', activeIngredient: 'Charcoal + AHA', usage: 'Deep cleanses scalp, use 1-2x/week', icon: '🧴' },
    { name: 'Apple Cider Vinegar Rinse', activeIngredient: 'ACV (Diluted)', usage: 'Balances scalp pH, use after shampoo weekly', icon: '🍎' },
    { name: 'Niacinamide Scalp Serum', activeIngredient: 'Niacinamide (5%)', usage: 'Controls oil at roots, apply to dry scalp', icon: '✨' },
  ],
  'Thinning': [
    { name: 'Procapil Serum', activeIngredient: 'Procapil (3%)', usage: 'Strengthens hair anchoring, apply nightly', icon: '🧬' },
    { name: 'Rosemary Oil', activeIngredient: 'Rosemary Essential Oil', usage: 'Massage into scalp 2-3x/week, rivals minoxidil', icon: '🌿' },
    { name: 'Peptide Hair Serum', activeIngredient: 'Copper Peptides', usage: 'Promotes thicker growth, daily scalp application', icon: '🔬' },
    { name: 'Saw Palmetto Supplement', activeIngredient: 'Saw Palmetto Extract', usage: 'Blocks DHT naturally, one capsule daily', icon: '💊' },
  ],
  'Frizzy': [
    { name: 'Keratin Treatment Spray', activeIngredient: 'Hydrolyzed Keratin', usage: 'Smooths cuticle, spray on damp hair', icon: '✨' },
    { name: 'Anti-Frizz Serum', activeIngredient: 'Silicone + Argan Oil', usage: 'Apply tiny amount on dry ends', icon: '💧' },
    { name: 'Silk Protein Mask', activeIngredient: 'Silk Amino Acids', usage: 'Weekly mask for 15 min, smooths & softens', icon: '🧖' },
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
