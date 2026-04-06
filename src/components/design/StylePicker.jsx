import React from 'react';
import { motion } from 'framer-motion';

const STYLES = [
  { id: 'premium', label: 'Premium', emoji: '✨', gradient: 'from-amber-500 to-orange-600' },
  { id: 'moderne', label: 'Moderne', emoji: '🔮', gradient: 'from-violet-500 to-purple-600' },
  { id: 'minimaliste', label: 'Minimaliste', emoji: '◻️', gradient: 'from-gray-400 to-gray-600' },
  { id: 'fun', label: 'Fun', emoji: '🎉', gradient: 'from-pink-500 to-rose-500' },
  { id: 'luxe', label: 'Luxe', emoji: '👑', gradient: 'from-yellow-500 to-amber-700' },
  { id: 'retro', label: 'Rétro', emoji: '📻', gradient: 'from-teal-500 to-emerald-600' },
  { id: 'corporate', label: 'Corporate', emoji: '🏢', gradient: 'from-blue-500 to-indigo-600' },
];

export default function StylePicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {STYLES.map((style) => {
        const selected = value === style.id;
        return (
          <motion.button
            key={style.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(style.id)}
            className={`relative flex items-center gap-2.5 px-5 py-3 rounded-full border-2 transition-all ${
              selected
                ? 'border-primary bg-primary/10 shadow-md'
                : 'border-border bg-card hover:border-primary/30'
            }`}
          >
            <span className="text-base">{style.emoji}</span>
            <span className={`text-sm font-semibold ${selected ? 'text-foreground' : 'text-muted-foreground'}`}>
              {style.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}