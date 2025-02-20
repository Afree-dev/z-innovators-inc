import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for smaller builds
    minify: 'terser', // Use Terser for better minification
    chunkSizeWarningLimit: 500, // Adjust chunk size limit
  },
})
