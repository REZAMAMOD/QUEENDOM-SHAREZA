
export enum LocationType {
  STUDIO = 'Studio photo professionnel',
  PALACE = 'Palais indien royal',
  GARDEN = 'Jardin tropical luxuriant',
  MARKET = 'Marché de rue indien coloré',
  BEACH = 'Plage au coucher du soleil',
  INTERIOR = 'Intérieur moderne et élégant',
  TEMPLE = 'Temple ancien',
  CITY = 'Rue de ville moderne',
  CUSTOM = 'Lieu personnalisé'
}

export enum GarmentStyle {
  ABAYA = 'Abaya',
  SALWAR_KAMEEZ = 'Salwar Kameez',
  ANARKALI = 'Anarkali',
  SHARARA = 'Sharara',
  SAREE = 'Saree',
  KURTI_PALAZZO = 'Kurti Palazzo',
  KURTI_LEGGING = 'Kurti Legging'
}

export interface GenerationStep {
  id: number;
  label: string;
  description: string;
}

export interface GeneratedResult {
  id: string; // Unique ID for each image
  label: string;
  image: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  date: number;
  garmentStyle: GarmentStyle;
  location: LocationType;
  results: GeneratedResult[];
  thumbnail: string;
}

export interface GalleryPreset {
  id: string;
  title: string;
  description: string;
  image: string;
  location: LocationType;
  style: GarmentStyle;
}

export interface ModelSettings {
  age: '20s' | '30s' | '40s';
  ethnicity: 'North Indian' | 'South Indian' | 'Global/Mixed';
  bodyType: 'Slim' | 'Curvy' | 'Athletic';
}

export interface AppState {
  // Navigation
  currentView: 'create' | 'history' | 'gallery';
  
  // Generation Data
  imageFlat: string | null;
  imageMannequin: string | null;
  location: LocationType;
  customLocation: string; // Text input for custom location
  garmentStyle: GarmentStyle;
  bottomColor: string | null; // Name of color or Hex
  selectedPoses: string[]; // Array of Pose IDs
  customPose: string; // Text input for custom pose
  
  // New Settings
  modelSettings: ModelSettings;
  mood: string; // Cinematic, Daylight, etc.
  
  // Process State
  isGenerating: boolean;
  progress: string; // e.g., "1/5"
  results: GeneratedResult[];
  error: string | null;
  isHighQuality: boolean;
  
  // History
  history: HistoryItem[];
  historyFilter: string; // 'ALL' or GarmentStyle
}
