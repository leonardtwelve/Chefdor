import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

export default async function ConnexionPage() {
  // Si déjà connecté en tant qu'admin, on saute la connexion.
  const session = await auth();
  if (session?.user?.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[color:var(--cream)]">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Logo size="md" />
        </div>
        <p className="eyebrow text-center">Espace admin</p>
        <h1 className="font-serif text-3xl text-center mt-3">Connexion</h1>
        <p className="text-sm text-[color:var(--brown-soft)] text-center mt-4">
          Tape ton email — tu recevras un lien magique pour te connecter.
        </p>
        <form
          action={async (formData) => {
            "use server";
            await signIn("resend", {
              email: formData.get("email"),
              redirectTo: "/admin",
            });
          }}
          className="mt-8 flex flex-col gap-3"
        >
          <Input type="email" name="email" placeholder="ton@email.fr" required />
          <Button type="submit">Recevoir un lien</Button>
        </form>
      </div>
    </main>
  );
}
