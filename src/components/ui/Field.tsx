import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

const control =
  "w-full rounded-[var(--radius-md)] border bg-surface px-4 text-ink outline-none transition-[border-color,box-shadow] duration-[var(--dur-fast)] placeholder:text-ink-3/60 focus:border-sky focus:shadow-[0_0_0_4px_rgb(53_99_233/0.12)] disabled:opacity-60";

type Base = { label: string; error?: string; hint?: ReactNode; optional?: boolean; className?: string };

function Wrapper({ id, label, error, hint, optional, className, children }: Base & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm text-ink-2">
        {label}
        {optional && <span className="text-xs text-ink-3">facultatif</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex gap-1.5 text-sm text-danger">
          <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-sm text-ink-3">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function TextField({ label, error, hint, optional, className, ...rest }: Base & Omit<ComponentProps<"input">, "className">) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, "h-12", error ? "border-danger" : "border-line")}
        {...rest}
      />
    </Wrapper>
  );
}

export function TextArea({ label, error, hint, optional, className, ...rest }: Base & Omit<ComponentProps<"textarea">, "className">) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, "min-h-36 resize-y py-3 leading-relaxed", error ? "border-danger" : "border-line")}
        {...rest}
      />
    </Wrapper>
  );
}

export function SelectField({ label, error, hint, optional, className, children, ...rest }: Base & Omit<ComponentProps<"select">, "className">) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <div className="relative">
        <select id={id} aria-invalid={!!error} className={cn(control, "h-12 appearance-none pr-10", error ? "border-danger" : "border-line")} {...rest}>
          {children}
        </select>
        <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-3" />
      </div>
    </Wrapper>
  );
}

export function Checkbox({ label, error, className, ...rest }: { label: ReactNode; error?: string; className?: string } & Omit<ComponentProps<"input">, "className" | "type">) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-ink-2">
        <input
          id={id}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-[6px] accent-[var(--color-ink)]"
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-2 flex gap-1.5 pl-8 text-sm text-danger">
          <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** Champ piège invisible (anti-robots), ignoré par les lecteurs d'écran. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Ne pas remplir
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormAlert({ tone, children }: { tone: "error" | "success" | "info"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-[var(--radius-md)] border p-4 text-sm",
        tone === "error" && "border-danger/30 bg-danger-soft text-danger",
        tone === "success" && "border-success/30 bg-success-soft text-success",
        tone === "info" && "border-sky/30 bg-sky-soft text-ink",
      )}
    >
      <Icon name={tone === "error" ? "alert" : tone === "success" ? "check" : "info"} size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
