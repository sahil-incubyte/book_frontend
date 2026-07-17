import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// Custom Chakra theme for the book app. We extend Chakra's defaultConfig rather
// than replacing it, so all the built-in tokens/recipes still apply.
const config = defineConfig({
  theme: {
    tokens: {
      // Raw color primitives. In Chakra v3 every token value is wrapped in
      // `{ value: ... }`.
      colors: {
        brand: {
          50: { value: "#eef2ff" },
          100: { value: "#e0e7ff" },
          200: { value: "#c7d2fe" },
          300: { value: "#a5b4fc" },
          400: { value: "#818cf8" },
          500: { value: "#6366f1" },
          600: { value: "#4f46e5" },
          700: { value: "#4338ca" },
          800: { value: "#3730a3" },
          900: { value: "#312e81" },
          950: { value: "#1e1b4b" },
        },
      },
      // Use the Geist font (wired up in layout.tsx) as the app's typeface.
      fonts: {
        heading: { value: "var(--font-geist-sans)" },
        body: { value: "var(--font-geist-sans)" },
      },
    },
    // Semantic roles let `colorPalette="brand"` resolve on any component.
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.600}" },
          contrast: { value: "{colors.white}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.50}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.500}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
