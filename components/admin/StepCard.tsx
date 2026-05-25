"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import {
  addStepPhoto,
  deleteStep,
  deleteStepPhoto,
  reorderStep,
  updateStep,
  type StepPatch,
} from "@/lib/actions/recipes";
import { useDebouncedSave } from "@/lib/hooks/useDebouncedSave";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/components/uploadthing-client";

type Photo = { id: string; url: string };

type Step = {
  id: string;
  order: number;
  title: string;
  content: string;
  tip: string | null;
  photos: Photo[];
};

type Props = {
  step: Step;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

export function StepCard({ step, canMoveUp, canMoveDown }: Props) {
  const [state, setState] = useState({
    title: step.title,
    content: step.content,
    tip: step.tip ?? "",
  });
  const [showTip, setShowTip] = useState(!!step.tip);
  const [, start] = useTransition();

  useDebouncedSave({
    value: state,
    save: async (v) => {
      const patch: StepPatch = {
        title: v.title,
        content: v.content,
        tip: v.tip || null,
      };
      await updateStep(step.id, patch);
    },
  });

  return (
    <section className="border border-[color:var(--border)] bg-[color:var(--cream-surface)] p-5">
      <div className="flex items-start gap-4">
        <div className="font-serif text-4xl text-[color:var(--terracotta)] leading-none tabular-nums pt-1">
          {String(step.order).padStart(2, "0")}
        </div>

        <div className="flex-1 space-y-3">
          <Input
            value={state.title}
            onChange={(e) => setState({ ...state, title: e.target.value })}
            placeholder="Titre de l'étape (ex : Préparer la pâte)"
            className="text-lg"
          />

          <Textarea
            value={state.content}
            onChange={(e) => setState({ ...state, content: e.target.value })}
            placeholder="Décris l'étape pas à pas. **Mot en gras** est supporté."
            className="min-h-[100px]"
          />

          {showTip ? (
            <div className="border-l-2 border-[color:var(--terracotta)] pl-4">
              <p className="eyebrow mb-2">Mon conseil</p>
              <Textarea
                value={state.tip}
                onChange={(e) => setState({ ...state, tip: e.target.value })}
                placeholder="Un conseil, une astuce, une note perso…"
                className="min-h-[60px] italic"
              />
              <button
                type="button"
                onClick={() => {
                  setState({ ...state, tip: "" });
                  setShowTip(false);
                }}
                className="mt-2 text-xs text-[color:var(--brown-mute)] hover:text-[color:var(--terracotta-deep)]"
              >
                × Retirer le conseil
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowTip(true)}
              className="btn-label text-[color:var(--terracotta)] hover:text-[color:var(--terracotta-deep)] flex items-center gap-1.5"
            >
              <Plus size={14} /> Ajouter un conseil
            </button>
          )}

          {/* Photos */}
          {step.photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
              {step.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-[4/3] overflow-hidden bg-[color:var(--rose)] group"
                >
                  <Image
                    src={photo.url}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => start(() => deleteStepPhoto(photo.id))}
                    className="absolute top-1 right-1 bg-[color:var(--brown)]/80 text-cream p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Supprimer la photo"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <UploadButton
            endpoint="stepImage"
            onClientUploadComplete={(res) => {
              if (!res) return;
              start(async () => {
                for (const file of res) {
                  await addStepPhoto(
                    step.id,
                    file.serverData.url,
                    file.serverData.width,
                    file.serverData.height,
                  );
                }
              });
            }}
            onUploadError={(e) => alert(`Erreur upload : ${e.message}`)}
            appearance={{
              container: "items-start",
              button:
                "ut-ready:bg-brown ut-ready:text-cream ut-ready:btn-label after:!bg-[color:var(--terracotta)] ut-uploading:after:!bg-[color:var(--terracotta)]",
              allowedContent: "text-xs text-[color:var(--brown-mute)]",
            }}
            content={{
              button({ ready, isUploading }) {
                if (isUploading) return "Upload…";
                if (ready) return "+ Photos d'étape";
                return "Préparation…";
              },
              allowedContent: "JPEG/PNG/WebP — 4 Mo · jusqu'à 10 à la fois",
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            disabled={!canMoveUp}
            onClick={() => start(() => reorderStep(step.id, "up"))}
            className="text-[color:var(--brown-mute)] hover:text-brown disabled:opacity-20 p-1"
            aria-label="Monter l'étape"
          >
            <ArrowUp size={16} />
          </button>
          <button
            type="button"
            disabled={!canMoveDown}
            onClick={() => start(() => reorderStep(step.id, "down"))}
            className="text-[color:var(--brown-mute)] hover:text-brown disabled:opacity-20 p-1"
            aria-label="Descendre l'étape"
          >
            <ArrowDown size={16} />
          </button>
          <button
            type="button"
            onClick={() => start(() => deleteStep(step.id))}
            className="text-[color:var(--brown-mute)] hover:text-[color:var(--terracotta-deep)] p-1"
            aria-label="Supprimer l'étape"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
