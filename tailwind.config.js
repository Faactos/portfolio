// Tailwind build config (was inline in index.html for the Play CDN).
// Regenerate tailwind.css after changing classes: npm run build:css
export default {
  darkMode: 'class',
  content: ['./index.html', './script.js', './chat.js', './project-details.js'],
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
            brand: {
              50: '#f0fdfa',
              100: '#ccfbf1',
              400: '#2dd4bf',
              500: '#14b8a6',
              600: '#0d9488',
              900: '#134e4a',
            },
            dark: {
              bg: '#09090b',
              card: '#121217',
              border: '#1f1f28',
              hover: '#2a2a36'
            }
          },
          boxShadow: {
            'card': '0 0 0 1px rgba(255, 255, 255, 0.06), 0 10px 30px -10px rgba(0, 0, 0, 0.5)',
            'card-hover': '0 0 0 1px rgba(45, 212, 191, 0.3), 0 20px 40px -15px rgba(20, 184, 166, 0.15)',
            'glow': '0 0 25px -5px rgba(45, 212, 191, 0.25)'
          }
        }
      }
    };
