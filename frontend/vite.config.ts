import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false, // Disable in production for security and size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['@headlessui/react', '@heroicons/react'],
          utils: ['axios', 'clsx'],
          charts: ['chart.js', 'react-chartjs-2'],
          editor: ['@monaco-editor/react'],
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          return `${extType}/[name]-[hash][extname]`;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // CSS code splitting
    cssCodeSplit: true,
    // Rollup options
    assetsInlineLimit: 4096, // 4kb
  },
  server: {
    port: 3002,
    // Bind to all network interfaces so the dev server is reachable via
    // the machine's public IP (e.g. http://143.244.137.101:3002).
    // Equivalent to passing --host on the CLI — now the default.
    host: true,
    // Fail fast if port 3002 is already taken instead of silently picking
    // a different port (which would break the CORS origin whitelist).
    strictPort: true,
    // Allow cross-origin requests to the Vite dev server itself
    // (needed when the browser is on a different machine / IP).
    cors: true,
    proxy: {
      // Forwards /api/* → backend at port 3001.
      // Used as a fallback when VITE_API_URL is not set or is relative.
      // When VITE_API_URL=http://143.244.137.101:3001/api Axios bypasses
      // this proxy and calls the backend directly — both paths work.
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true,
      },
    },
    hmr: {
      // When running on a remote server the HMR websocket must connect
      // to the public IP, not localhost.
      host: '143.244.137.101',
      port: 3002,
      protocol: 'ws',
      overlay: false,
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'zustand',
    ],
    exclude: ['@monaco-editor/react'], // Large dependency, load on demand
  },
  // Environment variables
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
})
