const TYPE_PROMPTS = {
  carte_visite: 'a professional business card design, compact layout with immediate visual impact, elegant typography, well-organized contact info',
  flyer: 'a promotional flyer design, balanced mix of visuals and information, eye-catching layout with clear call-to-action',
  affiche: 'a large format poster design, strong visual impact, bold typography, clear message hierarchy',
  brochure: 'a professional brochure design, clean editorial layout, well-structured information sections',
  magazine: 'a magazine cover or spread design, editorial excellence, sophisticated layout with dynamic composition',
  packaging: 'a product packaging design, shelf-appeal focus, brand-consistent, modern retail aesthetic',
  menu: 'a restaurant menu design, organized sections, appetizing presentation, elegant food typography',
  invitation: 'an event invitation design, elegant and refined, ceremonial feel, beautiful typography',
  cv: 'a professional resume/CV design, clean and organized, modern professional layout, easy to scan',
  couverture_livre: 'a book cover design, captivating visual, genre-appropriate styling, compelling typography',
  ticket_boissons: 'a drinks ticket / beverage voucher design, compact ticket format with perforated edge style, bold drink name, event branding, easy to read at a glance',
};

const STYLE_PROMPTS = {
  premium: 'premium high-end aesthetic, rich textures, gold accents, sophisticated gradients',
  moderne: 'modern contemporary style, clean geometric shapes, vibrant colors, bold sans-serif fonts',
  minimaliste: 'minimalist design, maximum white space, simple typography, understated elegance',
  fun: 'playful colorful style, dynamic shapes, energetic composition, friendly rounded fonts',
  luxe: 'luxury aesthetic, dark backgrounds, gold and metallic accents, serif fonts, opulent feel',
  retro: 'vintage retro style, muted color palette, classic typography, nostalgic textures',
  corporate: 'professional corporate style, structured grid, blue and neutral tones, formal typography',
};

const DIM_PROMPTS = {
  A4: '210x297mm A4 format',
  A5: '148x210mm A5 format',
  A3: '297x420mm A3 large format',
  carre: '210x210mm square format',
  carte_visite: '85x55mm business card format',
  ticket: '210x99mm ticket format (A4 folded in 3, landscape strip)',
  personnalise: 'custom format',
};

export function getAllMediaUrls(data) {
  const urls = [];
  // Template first so the AI sees the layout reference first
  if (data.template_url) urls.push(data.template_url);
  if (data.logos?.length) data.logos.forEach(l => urls.push(l.url));
  if (data.images?.length) data.images.forEach(i => urls.push(i.url));
  // fallback legacy fields
  if (data.logo_url && !data.logos?.length) urls.push(data.logo_url);
  if (data.reference_image_url && !data.images?.length) urls.push(data.reference_image_url);
  return urls;
}

export function buildDesignPrompt(data, isPremium = false) {
  const typeDesc = TYPE_PROMPTS[data.support_type] || 'a professional print design';
  const styleDesc = STYLE_PROMPTS[data.style] || STYLE_PROMPTS.moderne;
  const dimDesc = DIM_PROMPTS[data.dimensions] || '';
  const orient = data.orientation === 'paysage' ? 'landscape orientation' : 'portrait orientation';

  const hasTemplate = !!data.template_url;

  let prompt = hasTemplate
    ? `CRITICAL: The first image provided is a LAYOUT TEMPLATE / BASE MODEL. Reproduce its exact layout, structure, proportions, zones and visual hierarchy pixel-for-pixel. Only replace: text content with the new texts below, logos with the provided logos, photos with the provided photos, colors with the brand colors below. Do NOT change the grid, the zones positions, the spacing, the font sizes ratios, or any structural element. Output: ${typeDesc}, ${dimDesc}, ${orient}.`
    : `Create ${typeDesc}. ${dimDesc}, ${orient}. Style: ${styleDesc}.`;

  if (data.primary_color) {
    prompt += ` Use ${data.primary_color} as primary brand color.`;
  }
  if (data.secondary_color) {
    prompt += ` Use ${data.secondary_color} as secondary accent color.`;
  }
  if (data.title_text) {
    prompt += ` Main title text: "${data.title_text}".`;
  }
  if (data.subtitle_text) {
    prompt += ` Subtitle: "${data.subtitle_text}".`;
  }
  if (data.body_text) {
    prompt += ` Body content: "${data.body_text}".`;
  }
  if (data.contact_info) {
    prompt += ` Contact info to include: "${data.contact_info}".`;
  }

  const logoCount = data.logos?.length || 0;
  const imageCount = data.images?.length || 0;
  if (logoCount > 0) {
    prompt += ` Incorporate ${logoCount} logo(s) provided — place the main logo prominently, others as secondary brand elements.`;
  }
  if (imageCount > 0) {
    prompt += ` Use all ${imageCount} photo(s) in a modern auto-layout: creative grid, masonry, full-bleed, or editorial magazine-style arrangement depending on the support type. Make it visually striking and professional.`;
  }
  if (logoCount === 0 && imageCount === 0) {
    prompt += ' Create an original graphic layout with strong visual elements, icons, and shapes.';
  }

  if (data.ai_instructions) {
    prompt += ` IMPORTANT INSTRUCTIONS TO FOLLOW STRICTLY: ${data.ai_instructions}.`;
  }

  prompt += ' Print-ready quality, proper margins and bleed areas, professional typography hierarchy, cohesive visual design. High resolution, photorealistic mockup.';

  if (isPremium) {
    prompt += ' PREMIUM VERSION: Add luxury finishing touches — foil stamping effect, embossed textures, spot UV coating appearance, premium paper texture, refined shadows and depth effects. Ultra-premium, award-winning design quality.';
  }

  return prompt;
}