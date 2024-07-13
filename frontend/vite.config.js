import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 80, // Set the port to 80
    host: '0.0.0.0', // Allow connections from any IP address
    proxy: {
      '/api': {
        target: 'http://192.168.124.197:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
  }
}
});
