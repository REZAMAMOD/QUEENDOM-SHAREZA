import React, { useState } from 'react';

interface ApiKeySetupProps {
  onSave: (key: string) => void;
  initialKey?: string;
  onCancel?: () => void;
}

export function ApiKeySetup({ onSave, initialKey = '', onCancel }: ApiKeySetupProps) {
  const [key, setKey] = useState(initialKey);
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError('La clé API est requise');
      return;
    }
    if (!key.startsWith('AIza')) {
      setError('La clé API Gemini doit commencer par "AIza"');
      return;
    }
    onSave(key.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-purple-500/30">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-2xl font-bold text-white mb-2">Configuration API</h2>
          <p className="text-gray-400 text-sm">
            Entre ta clé API Google Gemini pour utiliser l'app
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Clé API Gemini
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => { setKey(e.target.value); setError(''); }}
                placeholder="AIza..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-400">
            <p className="font-medium text-gray-300 mb-1">💡 Comment obtenir une clé ?</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Va sur <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">aistudio.google.com/apikey</a></li>
              <li>Connecte-toi avec ton compte Google</li>
              <li>Clique sur "Create API Key"</li>
              <li>Copie la clé et colle-la ici</li>
            </ol>
          </div>

          <div className="flex gap-3 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all shadow-lg"
            >
              Sauvegarder ✨
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 text-xs mt-4">
          🔒 Ta clé reste sur ton appareil uniquement
        </p>
      </div>
    </div>
  );
}
