import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "text" | "light" | "outline-light";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[-0.005em] transition-[background-color,color,border-color,box-shadow,transform] duration-[var(--dur-base)] ease-[var(--ease-out)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(10_22_49/0.2)] hover:bg-night-2 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_8px_24px_rgb(10_22_49/0.22)]",
  secondary: "bg-surface text-ink border border-line-strong hover:border-ink hover:bg-white",
  ghost: "text-ink hover:bg-paper-2",
  text: "text-ink px-0! h-auto! underline-offset-4 hover:underline",
  light: "bg-paper text-ink hover:bg-white shadow-[0_1px_2px_rgb(0_0_0/0.2)]",
  "outline-light": "border border-line-night text-on-night hover:border-on-night hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.875rem] rounded-[var(--radius-md)]",
  md: "h-12 px-5 text-[0.9375rem] rounded-[var(--radius-md)]",
  lg: "h-14 px-7 text-base rounded-[14px]",
};

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  /** Icône flèche qui glisse au survol : signale une navigation vers l'avant */
  arrow?: boolean;
  block?: boolean;
  children: ReactNode;
  className?: string;
};

function Content({ icon, arrow, children }: Pick<Common, "icon" | "arrow" | "children">) {
  return (
    <>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {arrow && (
        <Icon
          name="arrowRight"
          size={17}
          className="transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover/btn:translate-x-0.5"
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
