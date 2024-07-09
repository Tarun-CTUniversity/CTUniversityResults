import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000, // Set the port to 5000
    host: '192.168.124.197', // Set the host to your IP address
  },
})
