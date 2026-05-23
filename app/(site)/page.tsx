import { Logo } from "@/components/brand/Logo";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 px-6">
      <Logo size="lg" />
      <p className="eyebrow">Bientôt</p>
    </main>
  );
}
