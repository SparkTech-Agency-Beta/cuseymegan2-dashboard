import type { Config } from 'tailwindcss';

/**
 * TODO(figma): every value below marked PLACEHOLDER must be replaced with the exact
 * value from Figma (file MmWLKvxQWp8yl88Aw3sBy0, node 32909:4418). They were NOT read
 * from the design (Figma MCP limit reached) and exist only so the token names compile.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#6366f1', soft: '#eef0ff', strong: '#4f46e5' }, // PLACEHOLDER
        surface: { DEFAULT: '#ffffff', muted: '#f8f9fb', sunken: '#f1f3f6' }, // PLACEHOLDER
        ink: { DEFAULT: '#111827', muted: '#6b7280', subtle: '#9ca3af' }, // PLACEHOLDER
        line: { DEFAULT: '#e5e7eb' }, // PLACEHOLDER
        success: { DEFAULT: '#16a34a', soft: '#dcfce7' }, // PLACEHOLDER
        warning: { DEFAULT: '#d97706', soft: '#fef3c7' }, // PLACEHOLDER
        danger: { DEFAULT: '#dc2626', soft: '#fee2e2' }, // PLACEHOLDER
        plan: {
          immediate: { DEFAULT: '#2563eb', soft: '#dbeafe' }, // PLACEHOLDER
          extended: { DEFAULT: '#7c3aed', soft: '#ede9fe' }, // PLACEHOLDER
          unlimited: { DEFAULT: '#db2777', soft: '#fce7f3' }, // PLACEHOLDER
        },
      },
      borderRadius: { card: '20px', input: '14px', pill: '9999px' }, // PLACEHOLDER
      boxShadow: {
        card: '0 1px 2px rgb(0 0 0 / 0.04), 0 4px 16px rgb(0 0 0 / 0.04)', // PLACEHOLDER
        modal: '0 24px 64px rgb(0 0 0 / 0.18)', // PLACEHOLDER
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] }, // PLACEHOLDER family
    },
  },
  plugins: [],
};

export default config;
