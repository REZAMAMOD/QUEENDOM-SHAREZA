
import React, { useState, useEffect, useRef } from 'react';
import { LocationType, AppState, GarmentStyle, GeneratedResult, HistoryItem } from './types';
import { LOCATIONS, STEPS, GARMENT_STYLES, POSES, BOTTOM_COLORS, INSPIRATION_GALLERY, SOCIAL_FORMATS, MODEL_OPTIONS, MOODS } from './constants';
import { geminiService } from './services/geminiService';
import { saveHistoryItem, getAllHistory, clearAllHistory, deleteHistoryItem } from './utils/db';
import { useApiKey } from './hooks/useApiKey';
import { ApiKeySetup } from './components/ApiKeySetup';

// --- Sous-composants UI ---

const Sidebar: React.FC<{ 
  currentView: string; 
  setView: (v: any) => void;
  countHistory: number;
  isHighQuality: boolean;
  onSettingsClick?: () => void;
}> = ({ currentView, setView, countHistory, isHighQuality, onSettingsClick }) => (
  <div className="w-20 lg:w-64 bg-burgundy text-white flex flex-col justify-between shadow-2xl z-20 transition-all fixed h-full lg:relative">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 indian-gradient rounded-full flex items-center justify-center text-[#D4AF37] font-serif text-xl italic border border-[#D4AF37] shrink-0">V</div>
        <h1 className="text-xl font-bold tracking-tight uppercase hidden lg:block text-[#D4AF37]">Vastra-AI</h1>
      </div>
      
      <nav className="space-y-4">
        <button 
          onClick={() => setView('create')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${currentView === 'create' ? 'bg-white/10 text-[#D4AF37] font-bold border-r-4 border-[#D4AF37]' : 'hover:bg-white/5 text-gray-300'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          <span className="hidden lg:block uppercase text-xs tracking-widest">Studio</span>
        </button>

        <button 
          onClick={() => setView('gallery')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${currentView === 'gallery' ? 'bg-white/10 text-[#D4AF37] font-bold border-r-4 border-[#D4AF37]' : 'hover:bg-white/5 text-gray-300'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <span className="hidden lg:block uppercase text-xs tracking-widest">Inspiration</span>
        </button>

        <button 
          onClick={() => setView('history')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${currentView === 'history' ? 'bg-white/10 text-[#D4AF37] font-bold border-r-4 border-[#D4AF37]' : 'hover:bg-white/5 text-gray-300'}`}
        >
          <div className="relative">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
             {countHistory > 0 && <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-burgundy text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{countHistory}</span>}
          </div>
          <span className="hidden lg:block uppercase text-xs tracking-widest">Portfolio</span>
        </button>

        {onSettingsClick && (
          <button 
            onClick={onSettingsClick}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:bg-white/5 text-gray-300 mt-4 border-t border-white/10 pt-6"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span className="hidden lg:block uppercase text-xs tracking-widest">Clé API</span>
          </button>
        )}
      </nav>
    </div>
    
    <div className="p-6 hidden lg:block">
      <div className="bg-black/20 rounded-xl p-4 text-xs text-gray-300">
        <p className="font-bold text-[#D4AF37] mb-2">Workstation V2.0</p>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${isHighQuality ? 'bg-[#D4AF37]' : 'bg-gray-500'}`}></div>
          <p>{isHighQuality ? 'Mode Prestige : ACTIF' : 'Mode Standard'}</p>
        </div>
        <p className="opacity-50">Storage: IndexedDB</p>
      </div>
    </div>
  </div>
);

const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="max-w-3xl mx-auto mb-10 pt-4 md:pt-0">
    <div className="flex justify-between relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 -z-10"></div>
      {STEPS.map((step) => (
        <div key={step.id} className="flex flex-col items-center bg-[#fcf9f2] px-4 z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
            currentStep >= step.id ? 'bg-burgundy border-burgundy text-white' : 'bg-white border-gray-300 text-gray-400'
          }`}>
            {step.id}
          </div>
          <span className={`mt-2 text-[10px] font-bold uppercase tracking-tighter ${currentStep >= step.id ? 'text-burgundy' : 'text-gray-400'}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const UploadBox: React.FC<{ 
  label: string; 
  image: string | null; 
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void 
}> = ({ label, image, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer group relative overflow-hidden h-64 flex flex-col items-center justify-center ${image ? 'border-burgundy bg-white' : 'border-[#D4AF37] bg-white/50 hover:bg-white'}`}
    >
      {image ? (
        <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="Uploaded" />
      ) : (
        <>
          <div className="w-12 h-12 bg-[#fcf9f2] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <p className="text-sm font-bold text-burgundy uppercase">{label}</p>
        </>
      )}
      <input type="file" ref={fileInputRef} className="hidden" onChange={onUpload} accept="image/*" />
    </div>
  );
};

// --- Confirmation Modal ---
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors">Annuler</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Confirmer</button>
        </div>
      </div>
    </div>
  );
};

// --- Scanning Overlay Animation ---
const ScanningOverlay: React.FC<{ image: string | null }> = ({ image }) => {
  if (!image) return null;
  return (
    <div className="relative rounded-2xl overflow-hidden w-48 h-48 mx-auto border-4 border-[#D4AF37] shadow-xl">
      <img src={image} className="w-full h-full object-cover opacity-80" alt="scan source" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent w-full h-full animate-scan"></div>
    </div>
  );
};

// Modal Magic Editor
const MagicEditor: React.FC<{ 
  result: GeneratedResult; 
  onClose: () => void; 
  onRefine: (promptAddon: string) => void 
}> = ({ result, onClose, onRefine }) => {
  const [instruction, setInstruction] = useState("");
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
           <h3 className="font-serif text-2xl text-burgundy italic">Magic Editor</h3>
           <button onClick={onClose} className="text-gray-400 hover:text-black">✕</button>
        </div>
        <div className="p-6">
          <div className="flex gap-4 mb-6">
             <img src={result.image} className="w-24 h-32 object-cover rounded-lg border border-gray-200" alt="ref" />
             <div className="flex-1">
               <p className="text-sm text-gray-500 mb-2">Décrivez la modification souhaitée pour cette image spécifique. L'IA va la régénérer en prenant en compte votre demande.</p>
               <textarea 
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-burgundy focus:outline-none"
                  rows={3}
                  placeholder="Ex: Zoom sur le visage, Change le fond en bleu nuit, Ajoute des bijoux en or..."
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
               ></textarea>
             </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100">Annuler</button>
            <button 
              onClick={() => onRefine(instruction)}
              disabled={!instruction}
              className="px-6 py-2 rounded-xl text-sm font-bold bg-burgundy text-white hover:bg-[#600018] disabled:opacity-50"
            >
              Régénérer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // API Key Management
  const { apiKey, setApiKey, hasApiKey, isLoading: isLoadingApiKey } = useApiKey();
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);

  // State Initialization
  const [state, setState] = useState<AppState>({
    currentView: 'create',
    imageFlat: null,
    imageMannequin: null,
    location: LocationType.STUDIO,
    customLocation: "",
    garmentStyle: GarmentStyle.ABAYA,
    bottomColor: null,
    selectedPoses: POSES.map(p => p.id), // Default all selected
    customPose: "",
    modelSettings: {
      age: '20s',
      ethnicity: 'North Indian',
      bodyType: 'Slim'
    },
    mood: 'editorial',
    isGenerating: false,
    progress: "",
    results: [],
    error: null,
    isHighQuality: false, // Default is FALSE (Standard Mode)
    history: [], // Starts empty, loaded async
    historyFilter: 'ALL'
  });

  const [step, setStep] = useState(1);
  const [editingResult, setEditingResult] = useState<GeneratedResult | null>(null);
  const [socialFormat, setSocialFormat] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Batch Selection State
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedResultIds, setSelectedResultIds] = useState<Set<string>>(new Set());

  // Load history from DB on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const items = await getAllHistory();
        setState(prev => ({ ...prev, history: items }));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    };
    fetchHistory();
  }, []);

  // --- Handlers ---

  const handleUpload = (type: 'flat' | 'mannequin') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setState(prev => ({ 
          ...prev, 
          [type === 'flat' ? 'imageFlat' : 'imageMannequin']: readerEvent.target?.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPreset = (preset: any) => {
    setState(prev => ({
      ...prev,
      currentView: 'create',
      location: preset.location,
      garmentStyle: preset.style,
      bottomColor: null,
      isHighQuality: false,
      selectedPoses: POSES.map(p => p.id) // Reset poses to all
    }));
    setStep(1); 
  };
  
  const openHistoryItem = (item: HistoryItem) => {
    setState(prev => ({
      ...prev,
      currentView: 'create',
      results: item.results,
      location: item.location,
      garmentStyle: item.garmentStyle,
      isGenerating: false,
      error: null
    }));
    setStep(3);
    setSelectionMode(false);
    setSelectedResultIds(new Set());
  };

  const togglePose = (poseId: string) => {
    setState(prev => {
      const current = prev.selectedPoses;
      if (current.includes(poseId)) {
        if (current.length === 1 && !prev.customPose) return prev; // Prevent deselecting all if no custom
        return { ...prev, selectedPoses: current.filter(id => id !== poseId) };
      } else {
        return { ...prev, selectedPoses: [...current, poseId] };
      }
    });
  };

  const checkAndGenerate = async () => {
    if (state.isHighQuality) {
      if (!(window as any).aistudio?.hasSelectedApiKey()) {
        await (window as any).aistudio?.openSelectKey();
      }
    }
    handleGenerate();
  };

  const handleGenerate = async () => {
    if (!state.imageFlat || !state.imageMannequin) return;
    const needsBottomColor = state.garmentStyle === GarmentStyle.KURTI_PALAZZO || state.garmentStyle === GarmentStyle.KURTI_LEGGING;
    if (needsBottomColor && !state.bottomColor) {
      alert("Couleur du bas requise");
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null, results: [], progress: "Initialisation..." }));
    setStep(3);
    setSelectionMode(false); // Reset selection mode

    try {
      const generatedResults: GeneratedResult[] = [];
      let count = 1;
      
      const activePoses = POSES.filter(p => state.selectedPoses.includes(p.id));
      const hasCustomPose = state.customPose.trim().length > 0;
      const totalSteps = activePoses.length + (hasCustomPose ? 1 : 0);
      const locationPrompt = state.location === LocationType.CUSTOM ? state.customLocation : state.location;

      // 1. Process Standard Poses
      for (const pose of activePoses) {
        if (count > 1) await new Promise(resolve => setTimeout(resolve, 2000));
        setState(prev => ({ ...prev, progress: `Génération ${count}/${totalSteps} : ${pose.label}` }));
        
        const resultImage = await geminiService.generateFashionPhoto(
          state.imageFlat!,
          state.imageMannequin!,
          locationPrompt,
          state.garmentStyle,
          pose.prompt,
          state.bottomColor,
          state.modelSettings,
          state.mood,
          state.isHighQuality
        );

        const newResult: GeneratedResult = { 
          id: Date.now().toString() + count,
          label: pose.label, 
          image: resultImage, 
          timestamp: Date.now() 
        };
        generatedResults.push(newResult);
        setState(prev => ({ ...prev, results: [...prev.results, newResult] }));
        count++;
      }

      // 2. Process Custom Pose if exists
      if (hasCustomPose) {
        if (count > 1) await new Promise(resolve => setTimeout(resolve, 2000));
        setState(prev => ({ ...prev, progress: `Génération ${count}/${totalSteps} : Pose Sur Mesure` }));
        
        const resultImage = await geminiService.generateFashionPhoto(
          state.imageFlat!,
          state.imageMannequin!,
          locationPrompt,
          state.garmentStyle,
          state.customPose, 
          state.bottomColor,
          state.modelSettings,
          state.mood,
          state.isHighQuality
        );

        const newResult: GeneratedResult = { 
          id: Date.now().toString() + count,
          label: 'Custom Pose', 
          image: resultImage, 
          timestamp: Date.now() 
        };
        generatedResults.push(newResult);
        setState(prev => ({ ...prev, results: [...prev.results, newResult] }));
      }

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        date: Date.now(),
        garmentStyle: state.garmentStyle,
        location: state.location,
        results: generatedResults,
        thumbnail: generatedResults[0].image
      };

      await saveHistoryItem(newHistoryItem);
      const updatedHistory = await getAllHistory();

      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        progress: "", 
        history: updatedHistory 
      }));

    } catch (err: any) {
       if (err.message === 'API_KEY_ERROR') {
        setState(prev => ({ ...prev, isGenerating: false, error: "Clé API invalide." }));
        await (window as any).aistudio?.openSelectKey();
      } else {
        setState(prev => ({ ...prev, isGenerating: false, error: err.message || "Erreur de génération." }));
      }
    }
  };

  const handleRefine = async (instruction: string) => {
    if (!editingResult) return;
    const targetResult = editingResult;
    setEditingResult(null);
    setState(prev => ({ ...prev, isGenerating: true, progress: "Raffinement magique..." }));
    
    try {
      const locationPrompt = state.location === LocationType.CUSTOM ? state.customLocation : state.location;
      const refinedImage = await geminiService.generateFashionPhoto(
        state.imageFlat!,
        state.imageMannequin!,
        locationPrompt,
        state.garmentStyle,
        `${targetResult.label}. MODIFICATION REQUEST: ${instruction}`,
        state.bottomColor,
        state.modelSettings,
        state.mood,
        state.isHighQuality
      );
      
      const newResults = state.results.map(r => r.id === targetResult.id ? { ...r, image: refinedImage } : r);
      
      // Update DB if this was from history (simplified: we just update UI state, user might need to regenerate properly to save new version or we update current history item context)
      // For now, let's keep it in session state.
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        results: newResults
      }));
    } catch (err) {
      setState(prev => ({ ...prev, isGenerating: false, error: "Echec de la retouche." }));
    }
  };

  // --- Bulk Selection Handlers ---

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedResultIds(new Set());
  };

  const toggleResultSelection = (id: string) => {
    const newSet = new Set(selectedResultIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedResultIds(newSet);
  };

  const selectAll = () => {
    if (selectedResultIds.size === state.results.length) {
      setSelectedResultIds(new Set());
    } else {
      setSelectedResultIds(new Set(state.results.map(r => r.id)));
    }
  };

  const handleBulkDownload = () => {
    const selected = state.results.filter(r => selectedResultIds.has(r.id));
    selected.forEach((res, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = res.image;
        link.download = `vastra-${res.label}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 500);
    });
    setSelectionMode(false);
    setSelectedResultIds(new Set());
  };

  const handleShare = async (result: GeneratedResult) => {
    try {
      const response = await fetch(result.image);
      const blob = await response.blob();
      const file = new File([blob], `vastra-${result.label}.png`, { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: 'Vastra AI Creation',
          text: `Création Vastra AI - ${result.label}`,
          files: [file]
        });
      } else {
        alert("Le partage n'est pas supporté sur ce navigateur/appareil.");
      }
    } catch (e) {
      console.error("Share error", e);
      alert("Erreur lors du partage.");
    }
  };

  const reset = () => {
    setState(prev => ({
      ...prev,
      imageFlat: null,
      imageMannequin: null,
      results: [],
      error: null
    }));
    setStep(1);
  };
  
  const generateHashtags = () => {
     const style = GARMENT_STYLES.find(s => s.id === state.garmentStyle)?.name.replace(' ', '');
     const locName = state.location === LocationType.CUSTOM ? 'CustomLoc' : LOCATIONS.find(l => l.id === state.location)?.name.replace(' ', '');
     return `#VastraAI #${style} #${locName} #IndianFashion #FashionTech #OOTD`;
  };

  const showBottomColorSelector = state.garmentStyle === GarmentStyle.KURTI_PALAZZO || state.garmentStyle === GarmentStyle.KURTI_LEGGING;
  
  const filteredHistory = state.historyFilter === 'ALL' 
    ? state.history 
    : state.history.filter(h => h.garmentStyle === state.historyFilter);

  // Show loading while checking API key
  if (isLoadingApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f2]">
        <div className="text-burgundy text-xl">Chargement...</div>
      </div>
    );
  }

  // Show API key setup if not configured
  if (!hasApiKey && !showApiKeySetup) {
    return <ApiKeySetup onSave={(key) => setApiKey(key)} />;
  }

  return (
    <div className="min-h-screen flex bg-[#fcf9f2]">
      {/* API Key Setup Modal */}
      {showApiKeySetup && (
        <ApiKeySetup 
          onSave={(key) => { setApiKey(key); setShowApiKeySetup(false); }} 
          onCancel={() => setShowApiKeySetup(false)}
          initialKey={apiKey || ''}
        />
      )}

      <Sidebar 
        currentView={state.currentView} 
        setView={(v) => setState(prev => ({...prev, currentView: v}))} 
        countHistory={state.history.length}
        isHighQuality={state.isHighQuality}
        onSettingsClick={() => setShowApiKeySetup(true)}
      />

      <main className="flex-1 overflow-y-auto h-screen relative ml-20 lg:ml-0">
        {/* VIEW: GALLERY */}
        {state.currentView === 'gallery' && (
          <div className="p-8 max-w-7xl mx-auto animate-fade-in">
             <h2 className="text-4xl font-serif text-burgundy mb-2">Galerie d'Inspiration</h2>
             <p className="text-gray-500 mb-8">Commencez rapidement avec nos configurations pré-établies.</p>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INSPIRATION_GALLERY.map(preset => (
                  <div key={preset.id} onClick={() => applyPreset(preset)} className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
                     <div className="h-48 overflow-hidden relative">
                        <img src={preset.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={preset.title}/>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                     </div>
                     <div className="p-6">
                        <h3 className="font-bold text-xl text-burgundy">{preset.title}</h3>
                        <p className="text-sm text-gray-500 mt-2">{preset.description}</p>
                        <div className="mt-4 flex gap-2 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                           <span className="bg-[#fcf9f2] px-2 py-1 rounded">{preset.style}</span>
                           <span className="bg-[#fcf9f2] px-2 py-1 rounded">{preset.location}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* VIEW: HISTORY */}
        {state.currentView === 'history' && (
           <div className="p-8 max-w-7xl mx-auto animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                   <h2 className="text-4xl font-serif text-burgundy mb-2">Portfolio</h2>
                   <p className="text-gray-500">Stockage sécurisé et illimité.</p>
                </div>
                <div className="flex gap-4 items-center">
                  <select 
                    value={state.historyFilter}
                    onChange={(e) => setState(prev => ({...prev, historyFilter: e.target.value}))}
                    className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-burgundy focus:border-burgundy"
                  >
                    <option value="ALL">Tout montrer</option>
                    {GARMENT_STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-800 text-xs font-bold uppercase underline"
                  >
                    Nettoyer tout
                  </button>
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                 <div className="text-center py-20 opacity-50">
                    <p>Aucune collection trouvée pour ce filtre.</p>
                 </div>
              ) : (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredHistory.map((item) => (
                       <div 
                         key={item.id} 
                         onClick={() => openHistoryItem(item)}
                         className="bg-white p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-transparent hover:border-burgundy/10"
                       >
                          <div className="grid grid-cols-2 gap-2 mb-4">
                             {item.results.slice(0, 2).map((r, idx) => (
                                <img key={idx} src={r.image} className="w-full aspect-square object-cover rounded-xl bg-gray-100" alt="thumb"/>
                             ))}
                          </div>
                          <div className="flex justify-between items-start">
                             <div>
                                <p className="font-bold text-burgundy text-sm">{new Date(item.date).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-500">{item.garmentStyle} • {item.location === LocationType.CUSTOM ? 'Custom' : item.location}</p>
                             </div>
                             <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500 group-hover:bg-burgundy group-hover:text-white transition-colors">{item.results.length} photos</span>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        )}

        {/* VIEW: CREATE (STUDIO) */}
        {state.currentView === 'create' && (
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-10 animate-fade-in mb-24">
             <ProgressBar currentStep={step} />

             {/* Step 1: Upload */}
             {step === 1 && (
               <div className="max-w-4xl mx-auto">
                 <div className="grid md:grid-cols-2 gap-8 mb-8">
                   <UploadBox label="Photo à plat" image={state.imageFlat} onUpload={handleUpload('flat')} />
                   <UploadBox label="Photo sur mannequin" image={state.imageMannequin} onUpload={handleUpload('mannequin')} />
                 </div>
                 <div className="text-center">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!state.imageFlat || !state.imageMannequin}
                      className={`px-12 py-4 rounded-3xl text-xl font-serif italic tracking-wide transition-all shadow-xl ${state.imageFlat && state.imageMannequin ? 'indian-gradient text-[#D4AF37] hover:scale-105' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      Continuer
                    </button>
                 </div>
               </div>
             )}

             {/* Step 2: Settings */}
             {step === 2 && (
               <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-6">
                     
                     {/* CASTING SECTION */}
                     <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <h3 className="text-lg font-serif text-burgundy mb-4">Casting Modèle</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                              <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Âge</label>
                              <div className="flex gap-2">
                                 {MODEL_OPTIONS.ages.map(age => (
                                    <button 
                                      key={age}
                                      onClick={() => setState(prev => ({...prev, modelSettings: {...prev.modelSettings, age: age as any}}))}
                                      className={`flex-1 py-2 text-xs border rounded-lg transition-colors ${state.modelSettings.age === age ? 'bg-burgundy text-white border-burgundy' : 'hover:bg-gray-50 text-gray-700 border-gray-200'}`}
                                    >{age}</button>
                                 ))}
                              </div>
                           </div>
                           <div>
                              <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Morphologie</label>
                              <div className="flex gap-2">
                                 {MODEL_OPTIONS.bodies.map(body => (
                                    <button 
                                      key={body}
                                      onClick={() => setState(prev => ({...prev, modelSettings: {...prev.modelSettings, bodyType: body as any}}))}
                                      className={`flex-1 py-2 text-xs border rounded-lg transition-colors ${state.modelSettings.bodyType === body ? 'bg-burgundy text-white border-burgundy' : 'hover:bg-gray-50 text-gray-700 border-gray-200'}`}
                                    >{body}</button>
                                 ))}
                              </div>
                           </div>
                           <div>
                              <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Origine</label>
                              <select 
                                value={state.modelSettings.ethnicity}
                                onChange={(e) => setState(prev => ({...prev, modelSettings: {...prev.modelSettings, ethnicity: e.target.value as any}}))}
                                className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white focus:ring-burgundy focus:border-burgundy"
                              >
                                {MODEL_OPTIONS.ethnicities.map(eth => <option key={eth} value={eth}>{eth}</option>)}
                              </select>
                           </div>
                        </div>
                     </div>

                     {/* STYLE & MOOD SECTION */}
                     <div className="grid md:grid-cols-2 gap-6">
                       {/* Style */}
                       <div className="bg-white p-6 rounded-3xl shadow-sm">
                          <h3 className="text-lg font-serif text-burgundy mb-4">Vêtement</h3>
                          <div className="grid grid-cols-2 gap-2">
                             {GARMENT_STYLES.map(s => (
                                <button key={s.id} onClick={() => setState(prev => ({...prev, garmentStyle: s.id, bottomColor: null}))} className={`p-2 rounded-lg border text-left text-[10px] ${state.garmentStyle === s.id ? 'bg-burgundy text-white border-burgundy' : 'hover:bg-gray-50 text-gray-700 border-gray-200'}`}>
                                   <span className="font-bold block">{s.name}</span>
                                </button>
                             ))}
                          </div>
                          {showBottomColorSelector && (
                             <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Couleur du bas</h4>
                                <div className="flex flex-wrap gap-2 items-center">
                                   {BOTTOM_COLORS.map(c => (
                                      <button 
                                        key={c.name} 
                                        onClick={() => setState(prev => ({...prev, bottomColor: c.name}))} 
                                        className={`w-6 h-6 rounded-full border-2 ${c.class} ${state.bottomColor === c.name ? 'ring-2 ring-offset-2 ring-burgundy' : ''}`}
                                        title={c.name}
                                      ></button>
                                   ))}
                                   <div className="relative group">
                                     <input 
                                       type="color" 
                                       className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                                       onChange={(e) => setState(prev => ({...prev, bottomColor: e.target.value}))}
                                     />
                                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-gradient-to-br from-red-500 via-green-500 to-blue-500 ${state.bottomColor?.startsWith('#') && !BOTTOM_COLORS.find(c => c.hex === state.bottomColor) ? 'ring-2 ring-offset-2 ring-burgundy' : ''}`}>
                                        <span className="text-white text-[8px] drop-shadow-md">+</span>
                                     </div>
                                   </div>
                                </div>
                             </div>
                          )}
                       </div>

                       {/* Mood */}
                       <div className="bg-white p-6 rounded-3xl shadow-sm">
                          <h3 className="text-lg font-serif text-burgundy mb-4">Ambiance</h3>
                          <div className="space-y-2">
                             {MOODS.map(m => (
                                <button key={m.id} onClick={() => setState(prev => ({...prev, mood: m.id}))} className={`w-full p-2 flex justify-between items-center rounded-lg border text-left transition-colors ${state.mood === m.id ? 'bg-burgundy text-white border-burgundy' : 'hover:bg-gray-50 border-gray-100 text-gray-700'}`}>
                                   <span className="text-sm font-bold">{m.label}</span>
                                   <span className={`text-[10px] ${state.mood === m.id ? 'text-white/70' : 'text-gray-400'}`}>{m.desc}</span>
                                </button>
                             ))}
                          </div>
                       </div>
                     </div>

                     {/* Location */}
                     <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <h3 className="text-lg font-serif text-burgundy mb-4">Lieu</h3>
                        <div className="grid grid-cols-4 gap-3 mb-4">
                           {LOCATIONS.map(l => (
                              <button key={l.id} onClick={() => setState(prev => ({...prev, location: l.id}))} className={`relative h-16 rounded-lg overflow-hidden group ${state.location === l.id ? 'ring-2 ring-burgundy ring-offset-2' : 'opacity-70 hover:opacity-100'}`}>
                                 <img src={l.image} className="w-full h-full object-cover" alt={l.name}/>
                                 <span className="absolute bottom-1 left-2 text-white text-[8px] font-bold shadow-black drop-shadow-md">{l.name}</span>
                              </button>
                           ))}
                           {/* Custom Location Tile */}
                           <button 
                             onClick={() => setState(prev => ({...prev, location: LocationType.CUSTOM}))} 
                             className={`relative h-16 rounded-lg overflow-hidden group border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 ${state.location === LocationType.CUSTOM ? 'ring-2 ring-burgundy ring-offset-2 border-burgundy bg-white' : 'hover:bg-white'}`}
                           >
                              <span className="text-2xl text-gray-400 mb-1">✎</span>
                              <span className="text-[8px] font-bold text-gray-500 uppercase">Sur Mesure</span>
                           </button>
                        </div>
                        {state.location === LocationType.CUSTOM && (
                          <input 
                            type="text" 
                            placeholder="Décrivez le lieu (ex: Devant la Tour Eiffel, Dans un champ de lavande...)"
                            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-burgundy focus:outline-none animate-fade-in"
                            value={state.customLocation}
                            onChange={(e) => setState(prev => ({...prev, customLocation: e.target.value}))}
                          />
                        )}
                     </div>

                     {/* Poses Selector */}
                     <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="text-lg font-serif text-burgundy">Poses</h3>
                           <span className="text-xs text-gray-500">{state.selectedPoses.length} + {state.customPose ? '1' : '0'} sélectionnée(s)</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                           {POSES.map(p => (
                              <button 
                                key={p.id} 
                                onClick={() => togglePose(p.id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${state.selectedPoses.includes(p.id) ? 'bg-burgundy text-white border-burgundy' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                              >
                                {p.label}
                              </button>
                           ))}
                        </div>
                        
                        {/* Custom Pose Input */}
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Ajouter une pose spécifique (ex: Elle tient un panier de fleurs...)"
                            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 pl-10 text-sm focus:bg-white focus:ring-2 focus:ring-burgundy focus:outline-none transition-colors"
                            value={state.customPose}
                            onChange={(e) => setState(prev => ({...prev, customPose: e.target.value}))}
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-serif italic">Opt.</span>
                        </div>
                     </div>
                     
                     <div className="flex gap-4">
                       <button onClick={() => setState(prev => ({ ...prev, isHighQuality: !prev.isHighQuality }))} className={`flex-1 p-4 rounded-xl border transition-colors flex items-center justify-center gap-2 ${state.isHighQuality ? 'bg-black text-[#D4AF37] border-black' : 'bg-white text-gray-500'}`}>
                          {state.isHighQuality ? '★ Mode Prestige Actif' : '☆ Mode Standard'}
                       </button>
                       <button onClick={checkAndGenerate} className="flex-[2] indian-gradient text-[#D4AF37] rounded-xl font-serif text-xl italic hover:shadow-xl transition-shadow">
                          Lancer le Shooting
                       </button>
                     </div>
                  </div>

                  <div className="lg:col-span-4 space-y-4">
                     <div className="bg-white p-4 rounded-3xl shadow-sm sticky top-4">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Récapitulatif</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                           <img src={state.imageFlat!} className="rounded-xl w-full aspect-square object-cover" alt="plat"/>
                           <img src={state.imageMannequin!} className="rounded-xl w-full aspect-square object-cover" alt="mannequin"/>
                        </div>
                        <div className="space-y-2 text-xs text-gray-600 border-t pt-4">
                          <div className="flex justify-between"><span>Modèle:</span> <span className="font-bold">{state.modelSettings.age}, {state.modelSettings.ethnicity}</span></div>
                          <div className="flex justify-between"><span>Style:</span> <span className="font-bold">{GARMENT_STYLES.find(s=>s.id === state.garmentStyle)?.name}</span></div>
                          <div className="flex justify-between"><span>Ambiance:</span> <span className="font-bold uppercase">{state.mood}</span></div>
                        </div>
                        <button onClick={() => setStep(1)} className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50">Changer les photos</button>
                     </div>
                  </div>
               </div>
             )}

             {/* Step 3: Results */}
             {step === 3 && (
                <div className="max-w-6xl mx-auto">
                   {state.isGenerating ? (
                      <div className="text-center py-20">
                         {/* Scanning Animation */}
                         <ScanningOverlay image={state.imageMannequin} />
                         <div className="mt-8 animate-pulse">
                            <h2 className="text-3xl font-serif text-burgundy mb-2">{state.progress}</h2>
                            <p className="text-gray-500 font-mono text-xs">Analyse du vêtement &amp; Génération IA...</p>
                         </div>
                      </div>
                   ) : state.error ? (
                      <div className="text-center py-20 bg-red-50 rounded-3xl">
                         <p className="text-red-800 font-bold mb-4">{state.error}</p>
                         <button onClick={reset} className="bg-white px-6 py-2 rounded-xl text-sm shadow-sm">Réinitialiser</button>
                      </div>
                   ) : (
                      <div className="animate-fade-in">
                         {/* Header Actions */}
                         <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                            <div>
                               <h2 className="text-4xl font-serif text-burgundy">Collection Terminée</h2>
                               <p className="text-gray-500 text-sm">Sauvegardé automatiquement dans le Portfolio.</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                               <button 
                                onClick={toggleSelectionMode} 
                                className={`px-6 py-3 border rounded-xl font-bold transition-all flex items-center gap-2 ${selectionMode ? 'bg-burgundy text-white border-burgundy' : 'bg-white text-gray-600 border-gray-200'}`}
                               >
                                  {selectionMode ? 'Annuler Sélection' : 'Sélection Multiple'}
                               </button>
                               <button onClick={reset} className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                  Nouveau Produit
                               </button>
                            </div>
                         </div>

                         {/* Social Format Preview Selector */}
                         <div className="flex justify-center gap-4 mb-8">
                            <span className="text-xs uppercase font-bold text-gray-400 py-2">Aperçu Réseaux :</span>
                            {SOCIAL_FORMATS.map(f => (
                               <button 
                                 key={f.id} 
                                 onClick={() => setSocialFormat(socialFormat === f.id ? null : f.id)}
                                 className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${socialFormat === f.id ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'}`}
                               >
                                 {f.label}
                               </button>
                            ))}
                         </div>

                         {/* Grid Results */}
                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {state.results.map((res) => (
                               <div 
                                 key={res.id} 
                                 onClick={() => selectionMode ? toggleResultSelection(res.id) : null}
                                 className={`group relative bg-white p-2 rounded-3xl shadow-sm transition-all ${selectionMode ? 'cursor-pointer' : ''} ${selectedResultIds.has(res.id) ? 'ring-4 ring-burgundy scale-105 z-10' : 'hover:shadow-xl'}`}
                               >
                                  <div className="relative overflow-hidden rounded-2xl">
                                     <img src={res.image} className={`w-full object-cover transition-opacity ${selectedResultIds.has(res.id) ? 'opacity-80' : ''}`} alt={res.label} />
                                     
                                     {/* Selection Checkmark Overlay */}
                                     {selectionMode && (
                                       <div className="absolute top-4 right-4 z-20">
                                         <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${selectedResultIds.has(res.id) ? 'bg-burgundy border-burgundy text-white' : 'bg-white/50 border-white text-transparent'}`}>
                                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                         </div>
                                       </div>
                                     )}

                                     {/* Social Overlay */}
                                     {socialFormat && !selectionMode && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
                                           <div className={`border-2 border-white/80 shadow-2xl ${SOCIAL_FORMATS.find(f => f.id === socialFormat)?.width} ${SOCIAL_FORMATS.find(f => f.id === socialFormat)?.height}`}></div>
                                        </div>
                                     )}

                                     {/* Hover Actions (Disabled in Selection Mode) */}
                                     {!selectionMode && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                           <div className="flex justify-between items-center">
                                              <span className="text-white text-xs font-bold uppercase">{res.label}</span>
                                              <div className="flex gap-2">
                                                 <button 
                                                   onClick={(e) => { e.stopPropagation(); setEditingResult(res); }}
                                                   className="bg-white/20 backdrop-blur p-2 rounded-full text-white hover:bg-white hover:text-burgundy transition-colors"
                                                   title="Magic Edit"
                                                 >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                 </button>
                                                 <button 
                                                   onClick={(e) => { e.stopPropagation(); handleShare(res); }}
                                                   className="bg-white/20 backdrop-blur p-2 rounded-full text-white hover:bg-white hover:text-burgundy transition-colors"
                                                   title="Partager"
                                                 >
                                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                                 </button>
                                                 <a href={res.image} download={`vastra-${res.label}.png`} onClick={(e) => e.stopPropagation()} className="bg-[#D4AF37] p-2 rounded-full text-burgundy hover:scale-110 transition-transform">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                 </a>
                                              </div>
                                           </div>
                                        </div>
                                     )}
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   )}
                </div>
             )}
          </div>
        )}
      </main>
      
      {/* Selection Action Bar */}
      {selectionMode && (
         <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-burgundy text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-fade-in border border-[#D4AF37]">
            <div className="flex items-center gap-2">
               <span className="font-bold text-[#D4AF37]">{selectedResultIds.size}</span>
               <span className="text-sm">sélectionné(s)</span>
            </div>
            <div className="h-6 w-px bg-white/20"></div>
            <button onClick={selectAll} className="text-sm hover:text-[#D4AF37] transition-colors">Tout sélectionner</button>
            <button 
              onClick={handleBulkDownload} 
              disabled={selectedResultIds.size === 0}
              className="bg-[#D4AF37] text-burgundy px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
            >
               Télécharger ({selectedResultIds.size})
            </button>
         </div>
      )}
      
      {editingResult && (
        <MagicEditor 
          result={editingResult} 
          onClose={() => setEditingResult(null)} 
          onRefine={handleRefine}
        />
      )}
      
      <ConfirmationModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          clearAllHistory().then(() => {
             setState(prev => ({ ...prev, history: [] }));
          });
        }}
        title="Supprimer le Portfolio ?"
        message="Cette action est irréversible. Toutes vos sessions sauvegardées seront perdues."
      />

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        
        @keyframes scan {
          0% { top: -20%; }
          100% { top: 120%; }
        }
        .animate-scan { animation: scan 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
