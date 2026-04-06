import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import StepIndicator from '@/components/design/StepIndicator';
import SupportTypeSelector from '@/components/design/SupportTypeSelector';
import DimensionPicker from '@/components/design/DimensionPicker';
import StylePicker from '@/components/design/StylePicker';
import ContentEditor from '@/components/design/ContentEditor';
import DesignPreview from '@/components/design/DesignPreview';
import { buildDesignPrompt } from '@/lib/generatePrompt';

export default function Studio() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  const presetType = urlParams.get('type');

  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    support_type: presetType || '',
    dimensions: 'A4',
    orientation: 'portrait',
    style: 'moderne',
    primary_color: '#D97706',
    secondary_color: '#7C3AED',
    title_text: '',
    subtitle_text: '',
    body_text: '',
    contact_info: '',
    logo_url: '',
    reference_image_url: '',
    generated_image_url: '',
    generated_premium_url: '',
    status: 'draft',
  });

  // Load existing project
  const { data: existingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const projects = await base44.entities.DesignProject.filter({ id: projectId });
      return projects[0] || null;
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (existingProject) {
      setFormData((prev) => ({ ...prev, ...existingProject }));
      if (existingProject.generated_image_url) setStep(5);
    }
  }, [existingProject]);

  // Auto-set dimensions for business cards
  useEffect(() => {
    if (formData.support_type === 'carte_visite') {
      setFormData((prev) => ({ ...prev, dimensions: 'carte_visite', orientation: 'paysage' }));
    }
  }, [formData.support_type]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (projectId) {
        await base44.entities.DesignProject.update(projectId, data);
        return { id: projectId };
      } else {
        return await base44.entities.DesignProject.create(data);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const handleGenerate = async () => {
    if (!formData.title) {
      toast.error('Donnez un nom à votre projet');
      return;
    }
    if (!formData.support_type) {
      toast.error('Sélectionnez un type de support');
      setStep(1);
      return;
    }

    setIsGenerating(true);
    setFormData((prev) => ({ ...prev, status: 'generating' }));

    const prompt = buildDesignPrompt(formData);
    const premiumPrompt = buildDesignPrompt(formData, true);

    const refImages = [formData.logo_url, formData.reference_image_url].filter(Boolean);

    const [result, premiumResult] = await Promise.all([
      base44.integrations.Core.GenerateImage({
        prompt,
        ...(refImages.length > 0 && { existing_image_urls: refImages }),
      }),
      base44.integrations.Core.GenerateImage({
        prompt: premiumPrompt,
        ...(refImages.length > 0 && { existing_image_urls: refImages }),
      }),
    ]);

    const updatedData = {
      ...formData,
      generated_image_url: result.url,
      generated_premium_url: premiumResult.url,
      prompt_used: prompt,
      status: 'completed',
    };

    setFormData(updatedData);
    await saveMutation.mutateAsync(updatedData);
    setIsGenerating(false);
    toast.success('Design généré avec succès !');
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const canGoNext = () => {
    if (step === 1) return !!formData.support_type;
    if (step === 4) return !!formData.title;
    return true;
  };

  const nextStep = () => {
    if (step < 5 && canGoNext()) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const stepContent = {
    1: (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-display font-bold mb-1">Type de support</h3>
          <p className="text-sm text-muted-foreground">Quel type de design souhaitez-vous créer ?</p>
        </div>
        <SupportTypeSelector value={formData.support_type} onChange={(v) => update('support_type', v)} />
      </div>
    ),
    2: (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-display font-bold mb-1">Format & Dimensions</h3>
          <p className="text-sm text-muted-foreground">Choisissez le format adapté à votre support</p>
        </div>
        <DimensionPicker
          dimensions={formData.dimensions}
          orientation={formData.orientation}
          onDimensionsChange={(v) => update('dimensions', v)}
          onOrientationChange={(v) => update('orientation', v)}
        />
      </div>
    ),
    3: (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-display font-bold mb-1">Style graphique</h3>
          <p className="text-sm text-muted-foreground">Définissez l'ambiance visuelle de votre design</p>
        </div>
        <StylePicker value={formData.style} onChange={(v) => update('style', v)} />
      </div>
    ),
    4: (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-display font-bold mb-1">Contenu</h3>
          <p className="text-sm text-muted-foreground">Ajoutez vos textes, couleurs et images</p>
        </div>
        <div className="space-y-2 mb-4">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nom du projet *</Label>
          <Input
            value={formData.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Ex: Carte de visite Studio Créa"
            className="bg-card border-border text-base font-medium"
          />
        </div>
        <ContentEditor data={formData} onChange={setFormData} />
      </div>
    ),
    5: (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-display font-bold mb-1">Votre design</h3>
          <p className="text-sm text-muted-foreground">
            {formData.generated_image_url ? 'Voici votre design généré par l\'IA' : 'Cliquez sur Générer pour créer votre design'}
          </p>
        </div>
        <DesignPreview
          imageUrl={formData.generated_image_url}
          premiumUrl={formData.generated_premium_url}
          isGenerating={isGenerating}
          dimensions={formData.dimensions}
          orientation={formData.orientation}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
        />
        {!formData.generated_image_url && !isGenerating && (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleGenerate}
              className="gap-2 rounded-xl px-8 shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-5 h-5" /> Générer le design
            </Button>
          </div>
        )}
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <StepIndicator currentStep={step} onStepClick={setStep} />
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="gap-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" /> Précédent
          </Button>

          {step < 5 ? (
            <Button
              onClick={nextStep}
              disabled={!canGoNext()}
              className="gap-2 rounded-xl shadow-lg shadow-primary/20"
            >
              Suivant <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            !formData.generated_image_url && !isGenerating && (
              <Button
                onClick={handleGenerate}
                className="gap-2 rounded-xl shadow-lg shadow-primary/20"
              >
                <Sparkles className="w-4 h-4" /> Générer
              </Button>
            )
          )}
        </div>
      </main>
    </div>
  );
}