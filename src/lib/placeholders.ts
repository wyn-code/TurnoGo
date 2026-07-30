export const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/e2e8f0/64748b?text=Sin+imagen&font=inter";

export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  Barberia: "https://placehold.co/600x400/7c3aed/ffffff?text=Barberia&font=inter",
  "Canchas de Padle": "https://placehold.co/600x400/7c3aed/ffffff?text=Padle&font=inter",
  "Canchas de Futbol": "https://placehold.co/600x400/7c3aed/ffffff?text=Futbol&font=inter",
  Peluqueria: "https://placehold.co/600x400/7c3aed/ffffff?text=Peluqueria&font=inter",
  "Servicios Tecnicos": "https://placehold.co/600x400/7c3aed/ffffff?text=Tecnicos&font=inter",
};

export function getCategoryImage(categoryName: string): string {
  return CATEGORY_PLACEHOLDERS[categoryName] ?? PLACEHOLDER_IMAGE;
}
