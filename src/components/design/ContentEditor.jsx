import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Palette, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ContentEditor({ data, onChange }) {
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange({ ...data, [field]: file_url });
  };

  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Titre principal</Label>
          <Input
            value={data.title_text || ''}
            onChange={(e) => update('title_text', e.target.value)}
            placeholder="Ex: Grand Opening"
            className="bg-card border-border"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sous-titre</Label>
          <Input
            value={data.subtitle_text || ''}
            onChange={(e) => update('subtitle_text', e.target.value)}
            placeholder="Ex: Rejoignez-nous le 15 mai"
            className="bg-card border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contenu / Description</Label>
        <Textarea
          value={data.body_text || ''}
          onChange={(e) => update('body_text', e.target.value)}
          placeholder="Ajoutez le texte principal de votre design..."
          className="bg-card border-border min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Informations de contact</Label>
        <Input
          value={data.contact_info || ''}
          onChange={(e) => update('contact_info', e.target.value)}
          placeholder="Email, téléphone, adresse, site web..."
          className="bg-card border-border"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Couleur principale</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.primary_color || '#D97706'}
              onChange={(e) => update('primary_color', e.target.value)}
              className="w-10 h-10 rounded-lg border border-border cursor-pointer"
            />
            <Input
              value={data.primary_color || '#D97706'}
              onChange={(e) => update('primary_color', e.target.value)}
              className="bg-card border-border flex-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Couleur secondaire</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.secondary_color || '#7C3AED'}
              onChange={(e) => update('secondary_color', e.target.value)}
              className="w-10 h-10 rounded-lg border border-border cursor-pointer"
            />
            <Input
              value={data.secondary_color || '#7C3AED'}
              onChange={(e) => update('secondary_color', e.target.value)}
              className="bg-card border-border flex-1"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Logo</Label>
          {data.logo_url ? (
            <div className="relative w-20 h-20 rounded-lg border border-border overflow-hidden bg-card">
              <img src={data.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
              <button
                onClick={() => update('logo_url', '')}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-card">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Télécharger</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'logo_url')} />
            </label>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image de référence</Label>
          {data.reference_image_url ? (
            <div className="relative w-20 h-20 rounded-lg border border-border overflow-hidden bg-card">
              <img src={data.reference_image_url} alt="Ref" className="w-full h-full object-cover" />
              <button
                onClick={() => update('reference_image_url', '')}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-card">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Télécharger</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'reference_image_url')} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}