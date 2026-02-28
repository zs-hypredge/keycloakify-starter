/**
 * Theme color derivation utilities, ported from zs-ui (src/utility/theme/).
 * Used to derive secondary/text colors from primary + background on the login page.
 */

/** Product-specific default palettes. */
const PRODUCT_DEFAULTS: Record<string, { primary: string; bg: string; lightMode: boolean }> = {
  hypredge: { primary: "#7371fc", bg: "#0a0f24", lightMode: false },
  trellix: { primary: "#87bfff", bg: "#111111", lightMode: false }
};

const PRODUCT_DEFAULTS_LIGHT: Record<string, { primary: string; bg: string }> = {
  hypredge: { primary: "#665dfd", bg: "#fefefe" },
  trellix: { primary: "#0263d1", bg: "#ffffff" }
};

export function getProductDefaults(productId: string, lightMode: boolean) {
  const key = productId.toLowerCase();
  if (lightMode) {
    const light = PRODUCT_DEFAULTS_LIGHT[key] ?? PRODUCT_DEFAULTS_LIGHT.hypredge;
    return { primary: light.primary, bg: light.bg, lightMode: true };
  }
  return PRODUCT_DEFAULTS[key] ?? PRODUCT_DEFAULTS.hypredge;
}

/**
 * Derive a secondary color from a background hex color.
 * Dark mode: +25 RGB offset. Light mode: +35 RGB offset.
 * Matches zs-ui getSecondaryColor().
 */
export function getSecondaryColor(hexColor: string, isLight: boolean): string {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const offset = isLight ? 35 : 25;
  const newR = Math.min(255, r + offset);
  const newG = Math.min(255, g + offset);
  const newB = Math.min(255, b + offset);

  return (
    "#" +
    Math.round(newR).toString(16).padStart(2, "0") +
    Math.round(newG).toString(16).padStart(2, "0") +
    Math.round(newB).toString(16).padStart(2, "0")
  );
}

/**
 * Determine whether text on a given background should be black or white.
 * Uses ITU-R BT.709 luminance formula. Matches zs-ui getTextColor().
 */
export function getTextColor(hexColor: string): string {
  const match = hexColor.replace("#", "").match(/\w\w/g);
  if (!match) return "#ffffff";
  const [r, g, b] = match.map(x => parseInt(x, 16));
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 127 ? "#000000" : "#ffffff";
}
