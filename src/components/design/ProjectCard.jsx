import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Sparkles, Clock, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TYPE_LABELS = {
  carte_visite: 'Carte de visite',
  flyer: 'Flyer',
  affiche: 'Affiche',
  brochure: 'Brochure',
  magazine: 'Magazine',
  packaging: 'Packaging',
  menu: 'Menu',
  invitation: 'Invitation',
  cv: 'CV',
  couverture_livre: 'Couverture',
};

const STATUS_CONFIG = {
  draft: { label: 'Brouillon', icon: Clock, color: 'bg-muted text-muted-foreground' },
  generating: { label: 'En cours', icon: Loader2, color: 'bg-primary/10 text-primary' },
  completed: { label: 'Terminé', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
};

export default function ProjectCard({ project, onClick, onDelete }) {
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.draft;
  const StatusIcon = status.icon;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => onClick(project)}
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {project.generated_image_url ? (
          <img
            src={project.generated_image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className={`${status.color} text-[10px] font-semibold gap-1`}>
            <StatusIcon className={`w-3 h-3 ${project.status === 'generating' ? 'animate-spin' : ''}`} />
            {status.label}
          </Badge>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-card/80 hover:bg-destructive hover:text-destructive-foreground h-7 w-7"
            onClick={(e) => { e.stopPropagation(); onDelete(project); }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm truncate">{project.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {TYPE_LABELS[project.support_type] || project.support_type}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {project.created_date && format(new Date(project.created_date), 'd MMM yyyy', { locale: fr })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}