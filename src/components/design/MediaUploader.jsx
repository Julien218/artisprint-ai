import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, Star, Loader2, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function MediaUploader({ images = [], logos = [], onImagesChange, onLogosChange }) {
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (type === 'logo') setUploadingLogo(true);
    else setUploadingImg(true);

    const uploaded = await Promise.all(
      files.map(async (file) => {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        return { url: file_url, name: file.name };
      })
    );

    if (type === 'logo') {
      onLogosChange([...logos, ...uploaded]);
      setUploadingLogo(false);
    } else {
      onImagesChange([...images, ...uploaded]);
      setUploadingImg(false);
    }

    // reset input
    e.target.value = '';
  };

  const removeImage = (idx) => onImagesChange(images.filter((_, i) => i !== idx));
  const removeLogo = (idx) => onLogosChange(logos.filter((_, i) => i !== idx));

  return (
    <div className="space-y-5">
      {/* Logos section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Logos & Marques</Label>
          <Badge variant="secondary" className="text-[10px]">{logos.length}/5</Badge>
        </div>
        <div className="flex flex-wrap gap-3">
          <AnimatePresence>
            {logos.map((logo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative w-20 h-20 rounded-xl border-2 border-border bg-card overflow-hidden group shadow-sm"
              >
                <img src={logo.url} alt={logo.name} className="w-full h-full object-contain p-2" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => removeLogo(idx)}
                    className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {idx === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary/80 py-0.5 text-[9px] font-bold text-primary-foreground text-center">
                    PRINCIPAL
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {logos.length < 5 && (
            <label className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${uploadingLogo ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-card'}`}>
              {uploadingLogo ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">Logo</span>
                </>
              )}
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e, 'logo')} disabled={uploadingLogo} />
            </label>
          )}
        </div>
      </div>

      {/* Photos / images section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Photos & Images</Label>
          <Badge variant="secondary" className="text-[10px]">{images.length}/10</Badge>
        </div>

        {/* Grid preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            <AnimatePresence>
              {images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-lg border border-border overflow-hidden group shadow-sm"
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeImage(idx)}
                      className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-1 left-1">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Drop zone */}
        {images.length < 10 && (
          <label className={`flex items-center justify-center gap-3 p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer ${uploadingImg ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-card/60'}`}>
            {uploadingImg ? (
              <>
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-sm text-primary font-medium">Upload en cours...</span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Image className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Ajouter des photos</p>
                  <p className="text-xs text-muted-foreground">Sélectionnez plusieurs images à la fois</p>
                </div>
                <Upload className="w-4 h-4 text-muted-foreground ml-auto" />
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e, 'image')}
              disabled={uploadingImg}
            />
          </label>
        )}

        {images.length > 0 && (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Star className="w-3 h-3 text-primary fill-primary" /> L'IA utilisera toutes vos images pour créer une mise en page automatique
          </p>
        )}
      </div>
    </div>
  );
}