import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  resolve: {
    alias: {
      '@admin': path.resolve(__dirname, '../admin/src'),  // Adjust this path to point to your 'admin/src'
    },
  },
})
