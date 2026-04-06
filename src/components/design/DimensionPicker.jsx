import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DIMENSIONS = [
  { id: 'A4', label: 'A4', size: '210 × 297 mm' },
  { id: 'A5', label: 'A5', size: '148 × 210 mm' },
  { id: 'A3', label: 'A3', size: '297 × 420 mm' },
  { id: 'carre', label: 'Carré', size: '210 × 210 mm' },
  { id: 'carte_visite', label: 'Carte visite', size: '85 × 55 mm' },
  { id: 'personnalise', label: 'Personnalisé', size: 'Sur mesure' },
];

const ORIENTATIONS = [
  { id: 'portrait', label: 'Portrait' },
  { id: 'paysage', label: 'Paysage' },
];

export default function DimensionPicker({ dimensions, orientation, onDimensionsChange, onOrientationChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {DIMENSIONS.map((dim) => {
          const selected = dimensions === dim.id;
          return (
            <motion.button
              key={dim.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDimensionsChange(dim.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                selected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <span className={`text-sm font-bold ${selected ? 'text-foreground' : 'text-muted-foreground'}`}>
                {dim.label}
              </span>
              <span className="text-[10px] text-muted-foreground">{dim.size}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Orientation :</span>
        <div className="flex gap-2">
          {ORIENTATIONS.map((o) => (
            <Button
              key={o.id}
              variant={orientation === o.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onOrientationChange(o.id)}
              className="gap-2"
            >
              <div className={`border-2 rounded-sm transition-all ${
                orientation === o.id ? 'border-primary-foreground' : 'border-current'
              } ${o.id === 'portrait' ? 'w-3 h-4' : 'w-4 h-3'}`} />
              {o.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}