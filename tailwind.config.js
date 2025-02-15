import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [forms, containerQueries],
  theme: {
    extend: {},
  },
};
