import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, FileText, Image, BookOpen, Newspaper, Package, UtensilsCrossed, Mail, User, BookMarked } from 'lucide-react';

const SUPPORT_TYPES = [
  { id: 'carte_visite', label: 'Carte de visite', icon: CreditCard, desc: 'Format compact & pro' },
  { id: 'flyer', label: 'Flyer', icon: FileText, desc: 'Promo & communication' },
  { id: 'affiche', label: 'Affiche', icon: Image, desc: 'Impact visuel fort' },
  { id: 'brochure', label: 'Brochure', icon: BookOpen, desc: 'Multi-pages élégant' },
  { id: 'magazine', label: 'Magazine', icon: Newspaper, desc: 'Éditorial avancé' },
  { id: 'packaging', label: 'Packaging', icon: Package, desc: 'Emballage produit' },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed, desc: 'Restaurant & bar' },
  { id: 'invitation', label: 'Invitation', icon: Mail, desc: 'Événement & cérémonie' },
  { id: 'cv', label: 'CV', icon: User, desc: 'Curriculum vitae' },
  { id: 'couverture_livre', label: 'Couverture', icon: BookMarked, desc: 'Livre & ebook' },
];

export default function SupportTypeSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {SUPPORT_TYPES.map((type) => {
        const Icon = type.icon;
        const selected = value === type.id;
        return (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(type.id)}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
              selected
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                : 'border-border bg-card hover:border-primary/40 hover:bg-card/80'
            }`}
          >
            <div className={`p-2.5 rounded-lg ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-sm font-semibold ${selected ? 'text-foreground' : 'text-muted-foreground'}`}>
              {type.label}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight text-center">
              {type.desc}
            </span>
            {selected && (
              <motion.div
                layoutId="support-indicator"
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}