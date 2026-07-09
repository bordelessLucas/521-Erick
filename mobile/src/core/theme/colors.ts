/** Identidade visual Trançatto — alinhada ao web/trancatto.css */
export const colors = {
  ink: '#1a1a1a',
  cream: '#f5f2eb',
  creamDark: '#e8e4db',
  sand: '#c8b59c',
  pine: '#1b3d2f',
  pineDark: '#0f2b23',
  terra: '#c65e34',
  muted: '#6b6560',
  label: '#8a847c',
  line: 'rgba(26, 23, 20, 0.1)',
  white: '#ffffff',
  error: '#DC2626',

  primary: {
    DEFAULT: '#1b3d2f',
    50: '#f0f4f2',
    100: '#dce8e2',
    800: '#1b3d2f',
    900: '#0f2b23',
  },
  secondary: {
    DEFAULT: '#c65e34',
    100: '#fdf0ea',
    800: '#8a3f22',
  },
  background: {
    primary: '#f5f2eb',
    secondary: '#ffffff',
    elevated: '#ffffff',
    inverse: '#1b3d2f',
  },
  text: {
    primary: '#1a1a1a',
    secondary: '#6b6560',
    tertiary: '#8a847c',
    inverse: '#ffffff',
    link: '#1b3d2f',
  },
  border: {
    default: 'rgba(26, 23, 20, 0.1)',
    focus: '#1b3d2f',
  },
  status: {
    aguardando: '#EAB308',
    producao: '#1b3d2f',
    faturado: '#10B981',
  },
} as const;

export type Colors = typeof colors;
