import Image from "next/image";
import { renderLightMarkdown } from "@/lib/markdown";

type Photo = {
  id: string;
  url: string;
  width: number;
  height: number;
  alt: string | null;
};

type Step = {
  id: string;
  order: number;
  title: string;
  content: string;
  tip: string | null;
  photos: Photo[];
};

export function StepBlock({ step }: { step: Step }) {
  return (
    <article className="grid grid-cols-[auto_1fr] gap-6">
      <div className="font-serif text-5xl text-[color:var(--terracotta)] leading-none tabular-nums">
        {String(step.order).padStart(2, "0")}
      </div>
      <div>
        <h3 className="font-serif text-2xl text-brown mb-3">{step.title}</h3>
        <div className="text-[color:var(--brown-soft)] leading-relaxed">
          {renderLightMarkdown(step.content)}
        </div>

        {step.tip && (
          <aside className="mt-6 border-l-2 border-[color:var(--terracotta)] bg-[color:var(--rose)]/40 px-5 py-4">
            <p className="eyebrow">Mon conseil</p>
            <p className="font-serif italic text-brown mt-2 leading-relaxed">
              {renderLightMarkdown(step.tip)}
            </p>
          </aside>
        )}

        {step.photos.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {step.photos.map((photo) => (
              <div key={photo.id} className="relative aspect-[4/3] overflow-hidden bg-[color:var(--rose)]">
                <Image
                  src={photo.url}
                  alt={photo.alt ?? `${step.title} — illustration`}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
