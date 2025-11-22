import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Strict port: if 5173 is busy, Vite will fail instead of picking another port.
    strictPort: true
  }
})
