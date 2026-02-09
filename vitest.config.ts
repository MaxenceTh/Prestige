import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()], // ON NE MET PAS tailwindcss() ICI
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})