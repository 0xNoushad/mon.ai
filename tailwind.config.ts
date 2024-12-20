/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  './pages/**/*.{js,ts,jsx,tsx,mdx}',
	  './components/**/*.{js,ts,jsx,tsx,mdx}',
	  './app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
	  extend: {
		animation: {
		  'text-reveal': 'textReveal 0.5s ease-out forwards',
		  'message-fade-in': 'messageFadeIn 0.3s ease-out forwards',
		  'text-fade-in': 'textFadeIn 1s ease-out forwards',
		  'pulse-subtle': 'pulseSubtle 2s infinite',
		  'blink': 'blink 1s infinite',
		  'slide-up': 'slideUp 0.3s ease-out forwards',
		},
		keyframes: {
		  textReveal: {
			'0%': { transform: 'translateY(100%)', opacity: '0' },
			'100%': { transform: 'translateY(0)', opacity: '1' },
		  },
		  messageFadeIn: {
			'0%': { opacity: '0', transform: 'translateY(20px)' },
			'100%': { opacity: '1', transform: 'translateY(0)' },
		  },
		  textFadeIn: {
			'0%': { opacity: '0' },
			'100%': { opacity: '1' },
		  },
		  pulseSubtle: {
			'0%, 100%': { opacity: '1' },
			'50%': { opacity: '0.8' },
		  },
		  blink: {
			'0%, 100%': { opacity: '1' },
			'50%': { opacity: '0' },
		  },
		  slideUp: {
			'0%': { transform: 'translateY(100%)', opacity: '0' },
			'100%': { transform: 'translateY(0)', opacity: '1' },
		  },
		},
	  },
	},
	plugins: [],
  }
  
  