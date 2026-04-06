import React from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ASPECT_RATIOS = {
  A4_portrait: 'aspect-[210/297]',
  A4_paysage: 'aspect-[297/210]',
  A5_portrait: 'aspect-[148/210]',
  A5_paysage: 'aspect-[210/148]',
  A3_portrait: 'aspect-[297/420]',
  A3_paysage: 'aspect-[420/297]',
  carre_portrait: 'aspect-square',
  carre_paysage: 'aspect-square',
  carte_visite_portrait: 'aspect-[55/85]',
  carte_visite_paysage: 'aspect-[85/55]',
  personnalise_portrait: 'aspect-[210/297]',
  personnalise_paysage: 'aspect-[297/210]',
};

export default function DesignPreview({ imageUrl, premiumUrl, isGenerating, dimensions, orientation, onRegenerate, onDownload }) {
  const aspectKey = `${dimensions || 'A4'}_${orientation || 'portrait'}`;
  const aspectClass = ASPECT_RATIOS[aspectKey] || 'aspect-[210/297]';

  return (
    <div className="space-y-4">
      <div className={`relative w-full max-w-md mx-auto ${aspectClass} rounded-2xl border-2 border-border overflow-hidden bg-card shadow-2xl`}>
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-card">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Création en cours...</p>
              <p className="text-xs text-muted-foreground mt-1">L'IA génère votre design</p>
            </div>
            <div className="w-32 h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ x: [-128, 128] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: '50%' }}
              />
            </div>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Design généré" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Configurez votre design puis cliquez sur <strong>Générer</strong>
            </p>
          </div>
        )}
      </div>

      {imageUrl && !isGenerating && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={onRegenerate} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Régénérer
          </Button>
          <Button size="sm" onClick={() => onDownload(imageUrl)} className="gap-2">
            <Download className="w-4 h-4" /> Télécharger
          </Button>
        </div>
      )}

      {premiumUrl && !isGenerating && (
        <div className="mt-4 p-4 rounded-xl border-2 border-primary/30 bg-primary/5">
          <p className="text-xs font-semibold text-primary mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Version Premium
          </p>
          <div className={`relative w-full max-w-sm mx-auto ${aspectClass} rounded-xl border border-border overflow-hidden shadow-lg`}>
            <img src={premiumUrl} alt="Design premium" className="w-full h-full object-cover" />
          </div>
          <div className="flex justify-center mt-3">
            <Button size="sm" variant="outline" onClick={() => onDownload(premiumUrl)} className="gap-2">
              <Download className="w-4 h-4" /> Télécharger Premium
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}