const eur = new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("fr-BE");

export const formatPrice = (value: number) => eur.format(value);
export const formatNumber = (value: number) => num.format(value);
export const formatMm = (value: number) => `${num.format(value)} mm`;
export const formatArea = (m2: number) => `${m2.toLocaleString("fr-BE", { maximumFractionDigits: 2 })} m²`;

export function formatLeadTime([min, max]: [number, number]) {
  return `${min} à ${max} jours ouvrés`;
}
