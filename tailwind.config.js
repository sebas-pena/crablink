/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      'animation': {
        'gradient-x': 'gradient-x .3s ease forwards',
      },
      'keyframes': {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
      },
      backgroundSize: {
        200: '200% 200%',
      },
      backgroundPosition: {
        'center-top': 'center top',
        'center-bottom': 'center bottom'
      },

      backgroundImage: {
        'send-button': 'linear-gradient( rgb(59, 130, 246) 50%, rgb(30 ,64 ,175) 50%)',
      }
    },
  },
  plugins: [],
};