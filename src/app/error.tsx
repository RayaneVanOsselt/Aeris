"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="container-site flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="t-caption text-danger">Un imprévu</p>
      <h1 className="t-h1 mt-5 max-w-xl text-ink">Cette page n&apos;a pas pu s&apos;afficher.</h1>
      <p className="t-lead mt-5 max-w-lg text-ink-2">Votre panier est conservé. Réessayez, ou revenez à l&apos;accueil.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset} arrow>
          Réessayer
        </Button>
        <ButtonLink href="/" variant="secondary">
          Accueil
        </ButtonLink>
      </div>
    </section>
  );
}
