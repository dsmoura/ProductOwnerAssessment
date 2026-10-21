import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs so the same build works from any path (dev, preview, Cloudflare Pages).
  base: './',
})
