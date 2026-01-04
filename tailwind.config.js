
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [        
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {      
    extend: {
        
    },
  },
//   add smoothe scrolling

  plugins: [
    require('@tailwindcss/forms'),
   

  ],
}