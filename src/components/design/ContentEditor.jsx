import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import MediaUploader from './MediaUploader';

export default function ContentEditor({ data, onChange }) {
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

      <Separator />

      <MediaUploader
        images={data.images || []}
        logos={data.logos || []}
        onImagesChange={(v) => update('images', v)}
        onLogosChange={(v) => update('logos', v)}
      />
    </div>
  );
}