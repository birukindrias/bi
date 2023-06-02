module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        milkroad_bg: "url('../public/assets/milkroad/background.png')",
        dpia_bg: "url('../public/assets/dpia/background.png')",
        main_bg: "url('../public/assets/background.gif')",
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        saira: ['Saira', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
        sharetech: ['Share Tech', 'sans-serif'],
        sourcesanspro: ['Source Sans', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        joan: ['Joan', 'serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
      },
      colors: {
        signal_blue: '#2C6BED',
        signal_light_gray: '#F6F6F6',
        signal_medium_gray: '#E9E9E9',
        signal_dark_gray: '#333333',
        outlook_blue: '#0072C6',
        outlook_light_gray: '#F0F0F0',
        outlook_blue_gray: '#B3D7F2',
        outlook_dark_gray: '#515151',
        outlook_beige_gray: '#FAF9F8',
        vscode_dark_brown_gray: '#252526',
        vscode_dark_gray: '#1E1E1E',
        vscode_light_gray: '#383838',
        vscode_font_primary: '#AEAEAE',
        vscode_yellow: '#D0CE4E',
        vscode_blue: '#5C9DD5',
        vscode_flush: '#CA8F79',
        hack_gray: '#999999',
        hack_light_gray: '#CCCCCC',
        tor_extra_light_gray: '#CCCCCC',
        tor_dark_gray: '#1C1B22',
        tor_medium_gray: '#2B2A33',
        tor_light_gray: '#42414D',
        tor_bright_lila: '#C069FF',
        tor_dark_lila: '#420C5D',
        hive_light_blue: '#C8D1E0',
        hive_medium_blue: '#29354D',
        hive_dark_blue: '#0E1629',
        hive_orange: '#FFA800',
        hive_gray: '#999999',
        hive_gray_blue: '#394C6A',
        cognito_bg: '#111111',
        milkroad_red: '#D30000',
        milkroad_blue: '#0091D4',
        milkroad_light_blue: '#005472',
        milkroad_gray: '#1A1A1A',
        milkroad_light_gray: '#595959',
        cryptii_blue: '#00B1D1',
        cryptii_orange: '#FF9900',
        cryptii_bg: '#F2F4F6',
        twitter_blue: '#1EA1F3',
        twitter_blue_gray: '#E7ECF0',
        twitter_light_gray: '#B3B3B3',
        twitter_gray: '#999999',
        twitter_dark_gray: '#808080',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

// The fonts used in the screens are:
// Google Chrome: Roboto
// Hacking Visualization: Share Tech
// Hive Chat App: Montserrat
// Milkroad:
// - Text on top: Source Serif Variable
// - Regular text: Helvetica
// Outlook: Calibri
// Signal Chat: Inter
// Tor Browser: Source Sans Variable
// Twitter: Helvetica
// Visual Studio Code: Consolas
