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
	  },
	},
	plugins: [],
  }
  
  