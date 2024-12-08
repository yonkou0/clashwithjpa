/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				primary: ['Clash', 'sans-serif']
			},
			colors: {
				primary: '#21252A',
				secondary: '#1F2226',
				foreground: '#2F353B'
			}
		}
	},

	plugins: [require('@tailwindcss/typography')]
};

module.exports = config;
