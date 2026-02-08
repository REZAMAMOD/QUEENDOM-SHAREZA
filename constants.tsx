
import { LocationType, GarmentStyle, GenerationStep, GalleryPreset, ModelSettings } from './types';

export const LOCATIONS = [
  { 
    id: LocationType.STUDIO, 
    name: 'Studio Photo', 
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=400',
    description: 'Éclairage studio doux et professionnel, arrière-plan neutre.'
  },
  { 
    id: LocationType.PALACE, 
    name: 'Palais Royal', 
    image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&q=80&w=400',
    description: 'Architecture opulente avec des accents dorés du Rajasthan.'
  },
  { 
    id: LocationType.GARDEN, 
    name: 'Jardin Tropical', 
    image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=400',
    description: 'Verdure luxuriante, fleurs tropicales et sérénité.'
  },
  { 
    id: LocationType.MARKET, 
    name: 'Marché Coloré', 
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=400',
    description: 'Bazar indien vibrant avec textiles et épices.'
  },
  { 
    id: LocationType.BEACH, 
    name: 'Plage au Crépuscule', 
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
    description: 'Bord de mer avec une lumière dorée de fin de journée.'
  },
  { 
    id: LocationType.INTERIOR, 
    name: 'Intérieur Moderne', 
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400',
    description: 'Design contemporain, élégant et épuré.'
  },
  { 
    id: LocationType.TEMPLE, 
    name: 'Temple Ancien', 
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=400',
    description: 'Murs de pierre sculptés et atmosphère historique.'
  },
  { 
    id: LocationType.CITY, 
    name: 'Rue Moderne', 
    image: 'https://images.unsplash.com/photo-1519010470956-6d877008eaa4?auto=format&fit=crop&q=80&w=400',
    description: 'Paysage urbain contemporain et chic.'
  },
];

export const GARMENT_STYLES = [
  { id: GarmentStyle.ABAYA, name: 'Abaya', description: 'Robe ample et élégante' },
  { id: GarmentStyle.SALWAR_KAMEEZ, name: 'Salwar Kameez', description: 'Ensemble tunique et pantalon traditionnel' },
  { id: GarmentStyle.ANARKALI, name: 'Anarkali', description: 'Robe longue évasée style impérial' },
  { id: GarmentStyle.SHARARA, name: 'Sharara', description: 'Ensemble avec pantalon large évasé' },
  { id: GarmentStyle.SAREE, name: 'Saree', description: 'Drapé traditionnel élégant' },
  { id: GarmentStyle.KURTI_PALAZZO, name: 'Kurti Palazzo', description: 'Tunique moderne avec pantalon large' },
  { id: GarmentStyle.KURTI_LEGGING, name: 'Kurti Legging', description: 'Tunique ajustée avec leggings' },
];

export const BOTTOM_COLORS = [
  { name: 'Blanc', hex: '#FFFFFF', class: 'bg-white border-gray-200' },
  { name: 'Crème', hex: '#F5F5DC', class: 'bg-[#F5F5DC] border-gray-300' },
  { name: 'Noir', hex: '#000000', class: 'bg-black border-gray-800' },
  { name: 'Doré', hex: '#D4AF37', class: 'bg-[#D4AF37] border-[#B8860B]' },
  { name: 'Rouge', hex: '#8B0000', class: 'bg-[#8B0000] border-[#800000]' },
  { name: 'Bleu Marine', hex: '#000080', class: 'bg-[#000080] border-[#000060]' },
  { name: 'Vert Bouteille', hex: '#006400', class: 'bg-[#006400] border-[#004d00]' },
  { name: 'Rose', hex: '#FFC0CB', class: 'bg-[#FFC0CB] border-[#FFB6C1]' },
  { name: 'Moutarde', hex: '#FFDB58', class: 'bg-[#FFDB58] border-[#E1C16E]' },
  { name: 'Argent', hex: '#C0C0C0', class: 'bg-[#C0C0C0] border-[#A9A9A9]' },
];

export const MODEL_OPTIONS = {
  ages: ['20s', '30s', '40s'],
  ethnicities: ['North Indian', 'South Indian', 'Global/Mixed'],
  bodies: ['Slim', 'Athletic', 'Curvy']
};

export const MOODS = [
  { id: 'editorial', label: 'Éditorial Mode', desc: 'Net, contrasté, neutre' },
  { id: 'cinematic', label: 'Cinématique', desc: 'Dramatique, sombre' },
  { id: 'golden', label: 'Golden Hour', desc: 'Chaud, solaire, doux' },
  { id: 'polaroid', label: 'Vintage', desc: 'Grain, nostalgique' },
  { id: 'bright', label: 'High Key', desc: 'Lumineux, éclatant' },
];

export const STEPS: GenerationStep[] = [
  { id: 1, label: 'Télécharger', description: 'Photos du vêtement' },
  { id: 2, label: 'Paramètres', description: 'Style, Lieu, Casting' },
  { id: 3, label: 'Générer', description: 'Shooting & Export' },
];

export const POSES = [
  { 
    id: 'solo', 
    label: 'Solo Éditorial', 
    prompt: "The model is standing naturally in a relaxed elegant pose, full body visible from head to toe, front-facing, looking slightly to the side with a gentle confident expression. Arms relaxed at sides or one hand on hip. High-fashion editorial style."
  },
  { 
    id: 'front', 
    label: 'Vue de Face', 
    prompt: "The model is standing perfectly straight facing the camera directly, arms slightly away from body to show the full garment from the front. Full body head to toe. Neutral confident expression. Technical fashion view."
  },
  { 
    id: 'back', 
    label: 'Vue de Dos', 
    prompt: "The model is standing with her back to the camera, head turned slightly to show her profile. Full body visible head to toe. This shows the complete back design of the garment, all back embroidery and details visible."
  },
  { 
    id: 'side', 
    label: 'Vue de Côté', 
    prompt: "The model is standing in a side profile view (left or right side), showing the silhouette and draping of the garment. Full body visible head to toe. One foot slightly in front of the other for a natural stance."
  },
  { 
    id: 'seated', 
    label: 'Assise', 
    prompt: "The model is seated elegantly on a luxurious chair or settee appropriate for the location, the garment draping beautifully around her. Knees together, slight angle to camera. Upper body and garment fully visible. Graceful and regal posture."
  }
];

export const SOCIAL_FORMATS = [
  { id: 'story', label: 'Story', ratio: '9/16', width: 'w-[180px]', height: 'h-[320px]' },
  { id: 'post', label: 'Post', ratio: '4/5', width: 'w-[200px]', height: 'h-[250px]' },
  { id: 'square', label: 'Carré', ratio: '1/1', width: 'w-[200px]', height: 'h-[200px]' },
];

export const INSPIRATION_GALLERY: GalleryPreset[] = [
  {
    id: 'royal-saree',
    title: 'Maharani Vibe',
    description: 'Saree traditionnel dans un palais du Rajasthan',
    location: LocationType.PALACE,
    style: GarmentStyle.SAREE,
    image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'modern-kurti',
    title: 'Urban Chic',
    description: 'Kurti Palazzo dans un environnement urbain moderne',
    location: LocationType.CITY,
    style: GarmentStyle.KURTI_PALAZZO,
    image: 'https://images.unsplash.com/photo-1519010470956-6d877008eaa4?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'wedding-anarkali',
    title: 'Jardin de Mariage',
    description: 'Anarkali fluide dans un jardin luxuriant',
    location: LocationType.GARDEN,
    style: GarmentStyle.ANARKALI,
    image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'sunset-abaya',
    title: 'Désert Doré',
    description: 'Abaya élégante à la lumière du coucher de soleil',
    location: LocationType.BEACH,
    style: GarmentStyle.ABAYA,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400'
  }
];

export const FASHION_PROMPT_TEMPLATE = (
  location: string, 
  garmentStyle: string, 
  poseDescription: string, 
  bottomColor: string | null,
  model: ModelSettings,
  mood: string
) => `
ULTRA-REALISTIC PROFESSIONAL FASHION PHOTOGRAPHY. 
CRITICAL: This must look like a real photograph, NOT an AI-generated image. Avoid all AI artifacts.

PARAMETERS:
LOCATION: ${location}.
GARMENT STYLE: ${garmentStyle}.
POSE: ${poseDescription}
MOOD/ATMOSPHERE: ${mood}.

MODEL DESCRIPTION:
A consistent female model.
- AGE: ${model.age} appearance.
- BODY: ${model.bodyType} build.
- ETHNICITY: ${model.ethnicity}.
- FACE: Natural skin texture with visible pores, subtle skin texture, micro-imperfections like tiny freckles. Natural subsurface scattering on the skin. Realistic eye reflections. Individual hair strands visible. NO airbrushed look.

${bottomColor ? `
IMPORTANT - BOTTOM GARMENT:
The source images primarily show the top garment.
You MUST generate a matching bottom (${garmentStyle.includes('Palazzo') ? 'Wide-leg Palazzo pants' : 'Fitted Leggings'}) to complete the outfit.
COLOR REQUIREMENT: The bottom garment MUST be strictly '${bottomColor}' in color.
Make it look realistic with proper fabric texture matching the top style.` : ''}

TASK: Transform the Indian garment from the provided source images into a photo of it being worn by the model. 
CLOTHING: The garment must be the exact same as in the source images, but perfectly fitted and draped on the model naturally.
CAMERA: Canon EOS R5, 85mm f/1.4 lens.
LIGHTING: Professional lighting matching the '${mood}' atmosphere.
OUTPUT: High-end editorial photoshoot quality.
`;
