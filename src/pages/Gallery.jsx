import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Download, Pencil, Search, Images, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const SUPPORT_LABELS = {
  carte_visite: 'Carte de visite',
  flyer: 'Flyer',
  affiche: 'Affiche',
  brochure: 'Brochure',
  magazine: 'Magazine',
  packaging: 'Packaging',
  menu: 'Menu',
  invitation: 'Invitation',
  cv: 'CV',
  couverture_livre: 'Couverture livre',
  ticket_boissons: 'Ticket boissons',
};

export default function Gallery() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.DesignProject.list('-created_date', 100),
  });

  // Only show projects that have a generated image
  const withImages = projects.filter((p) => p.generated_image_url);

  const filtered = withImages.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (url, e) => {
    e?.stopPropagation();
    window.open(url, '_blank');
  };

  const handleEdit = (project, e) => {
    e?.stopPropagation();
    navigate(`/studio?id=${project.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <img
            src="https://media.base44.com/images/public/69d3271c4908d4dee7ca0aea/e97fc4c51_ChatGPTImage6avr202615_40_48.png"
            alt="ADN Studio"
            className="h-9 w-auto absolute left-1/2 -translate-x-1/2"
          />
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Title + search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <Images className="w-6 h-6 text-primary" /> Galerie
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {withImages.length} design{withImages.length > 1 ? 's' : ''} générés
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-9 bg-card rounded-xl"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && withImages.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <Images className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">Aucun design généré pour l'instant.</p>
            <Button className="mt-4 gap-2 rounded-xl" onClick={() => navigate('/studio')}>
              Créer mon premier design
            </Button>
          </div>
        )}

        {/* Mosaic Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            <AnimatePresence>
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer bg-card border border-border shadow-sm hover:shadow-lg transition-shadow"
                  onClick={() => setSelected(project)}
                >
                  <img
                    src={project.generated_image_url}
                    alt={project.title}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <div>
                      <Badge className="text-[10px] bg-primary/80 text-white border-0">
                        {SUPPORT_LABELS[project.support_type] || project.support_type}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold truncate mb-2">{project.title}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleDownload(project.generated_image_url, e)}
                          className="flex-1 flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs py-1.5 rounded-lg transition-colors"
                        >
                          <Download className="w-3 h-3" /> Télécharger
                        </button>
                        <button
                          onClick={(e) => handleEdit(project, e)}
                          className="flex-1 flex items-center justify-center gap-1 bg-primary/80 hover:bg-primary text-white text-xs py-1.5 rounded-lg transition-colors"
                        >
                          <Pencil className="w-3 h-3" /> Modifier
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-2xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.generated_image_url}
                alt={selected.title}
                className="w-full object-contain max-h-[70vh]"
              />
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">{selected.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {SUPPORT_LABELS[selected.support_type] || selected.support_type}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 rounded-xl"
                    onClick={() => handleDownload(selected.generated_image_url)}
                  >
                    <Download className="w-3.5 h-3.5" /> Télécharger
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1 rounded-xl"
                    onClick={() => handleEdit(selected)}
                  >
                    <Pencil className="w-3.5 h-3.5" /> Modifier
                  </Button>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}