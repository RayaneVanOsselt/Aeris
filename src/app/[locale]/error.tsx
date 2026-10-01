"use client";

import { useEffect } from "react";
import { useI18n } from "@/i18n/provider";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { m, href } = useI18n();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="container-site flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="t-caption text-danger">{m.errorPage.eyebrow}</p>
      <h1 className="t-h1 mt-5 max-w-xl text-ink">{m.errorPage.title}</h1>
      <p className="t-lead mt-5 max-w-lg text-ink-2">{m.errorPage.text}</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset} arrow>
          {m.errorPage.retry}
        </Button>
        <ButtonLink href={href("home")} variant="secondary">
          {m.common.home}
        </ButtonLink>
      </div>
    </section>
  );
}
