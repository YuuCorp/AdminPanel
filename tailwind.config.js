/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          100: "#18181A",
          200: "#161618",
        },
        primary: "#FF4D6D",
        text: {
          100: "#ACACAE",
          200: "#8A8A8A",
        },
        accent: "#28262B",
      },
      fontFamily: {
        jetbrains: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace" ],
      },
    }
  },
  plugins: [],
}