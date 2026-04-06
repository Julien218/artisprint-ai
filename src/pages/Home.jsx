import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Search, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProjectCard from '@/components/design/ProjectCard';

export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.DesignProject.list('-created_date', 50),
  });

  const deleteMutation = useMutation({
    mutationFn: (project) => base44.entities.DesignProject.delete(project.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const filtered = projects.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display tracking-tight">PrintForge</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Design Studio</p>
            </div>
          </div>
          <Button onClick={() => navigate('/studio')} className="gap-2 rounded-xl shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Nouveau design
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
            Créez des designs
            <span className="text-primary"> print-ready</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Générez automatiquement des designs professionnels pour tous vos supports imprimés grâce à l'intelligence artificielle.
          </p>
        </motion.div>

        {/* Quick Actions */}
        {projects.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Carte de visite', type: 'carte_visite', emoji: '💳' },
                { label: 'Flyer', type: 'flyer', emoji: '📄' },
                { label: 'Affiche', type: 'affiche', emoji: '🖼️' },
                { label: 'Invitation', type: 'invitation', emoji: '💌' },
              ].map((item) => (
                <motion.button
                  key={item.type}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/studio?type=${item.type}`)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 bg-card hover:bg-primary/5 transition-all"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un projet..."
                  className="pl-9 bg-card rounded-xl"
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {filtered.length} projet{filtered.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filtered.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={(p) => navigate(`/studio?id=${p.id}`)}
                    onDelete={(p) => deleteMutation.mutate(p)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </main>
    </div>
  );
}