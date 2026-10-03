import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "text" | "light" | "outline-light" | "glass";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full font-medium tracking-[-0.005em] transition-[background-color,color,border-color,box-shadow,transform] duration-[var(--dur-base)] ease-[var(--ease-out)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-night-2",
  secondary: "bg-transparent text-ink border border-line-strong hover:border-ink hover:bg-surface",
  ghost: "text-ink hover:bg-paper-2",
  text: "text-ink px-0! h-auto! rounded-none! underline-offset-4 hover:underline",
  light: "bg-paper text-ink hover:bg-white",
  "outline-light": "border border-white/35 text-white hover:border-white hover:bg-white/10",
  /** Sur la vidéo : verre dépoli discret, sans voile sombre */
  glass: "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4.5 text-[0.875rem]",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-[1rem]",
};

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  /** Flèche qui glisse au survol : signale une navigation vers l'avant */
  arrow?: boolean;
  block?: boolean;
  children: ReactNode;
  className?: string;
};

/** Libellé qui « roule » au survol : la ligne monte et laisse place à sa copie. */
function Content({ icon, arrow, children }: Pick<Common, "icon" | "arrow" | "children">) {
  return (
    <>
      {icon && <Icon name={icon} size={18} />}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover/btn:-translate-y-full motion-reduce:group-hover/btn:translate-y-0">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover/btn:translate-y-0 motion-reduce:hidden"
        >
          {children}
        </span>
      </span>
      {arrow && (
        <Icon
          name="arrowRight"
          size={17}
          className="transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover/btn:translate-x-1"
        />
      )}
    </>
  );
}

export function buttonClasses({ variant = "primary", size = "md", block, className }: Omit<Common, "children">) {
  return cn(base, variants[variant], sizes[size], block && "w-full", className);
}

export function Button({
  variant,
  size,
  icon,
  arrow,
  block,
  className,
  children,
  type = "button",
  ...rest
}: Common & Omit<ComponentProps<"button">, keyof Common>) {
  return (
    <button type={type} className={buttonClasses({ variant, size, block, className })} {...rest}>
      <Content icon={icon} arrow={arrow}>
        {children}
      </Content>
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  icon,
  arrow,
  block,
  className,
  children,
  ...rest
}: Common & Omit<ComponentProps<typeof Link>, keyof Common>) {
  return (
    <Link className={buttonClasses({ variant, size, block, className })} {...rest}>
      <Content icon={icon} arrow={arrow}>
        {children}
      </Content>
    </Link>
  );
}

export function IconButton({
  icon,
  label,
  className,
  size = 44,
  ...rest
}: { icon: IconName; label: string; size?: number } & Omit<ComponentProps<"button">, "children">) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-ink transition-colors duration-[var(--dur-fast)] hover:bg-paper-2",
        className,
      )}
      style={{ width: size, height: size }}
      {...rest}
    >
      <Icon name={icon} size={20} />
    </button>
  );
}
