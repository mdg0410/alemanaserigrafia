// vite.config.ts
import { defineConfig } from "file:///C:/Users/Steven/Documents/Projects/Profesional/alemanaserigrafia/node_modules/.pnpm/vite@5.4.21_@types+node@25.0.0_terser@5.44.1/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Steven/Documents/Projects/Profesional/alemanaserigrafia/node_modules/.pnpm/@vitejs+plugin-react@4.7.0__9ef784d43f435547f057064248551067/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
import viteImagemin from "file:///C:/Users/Steven/Documents/Projects/Profesional/alemanaserigrafia/node_modules/.pnpm/vite-plugin-imagemin@0.6.1__1530fea25f0b167de264d39fe7e929e3/node_modules/vite-plugin-imagemin/dist/index.mjs";
import viteCompression from "file:///C:/Users/Steven/Documents/Projects/Profesional/alemanaserigrafia/node_modules/.pnpm/vite-plugin-compression@0.5_da5ba37454620b9be4acf7181a3ee11c/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\Steven\\Documents\\Projects\\Profesional\\alemanaserigrafia";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
            active: false
          },
          {
            name: "removeEmptyAttrs",
            active: false
          }
        ]
      }
    }),
    viteCompression({
      verbose: true,
      algorithm: "gzip",
      ext: ".gz"
    })
  ],
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    cssMinify: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "framer-motion"],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          utils: ["@fortawesome/fontawesome-svg-core", "@fortawesome/free-solid-svg-icons"]
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo?.name ?? "";
          const info = name.split(".");
          let extType = info.length > 1 ? info[info.length - 1] : "";
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js"
      }
    }
  },
  server: {
    port: 3e3,
    host: true,
    cors: true,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff"
    },
    fs: {
      strict: true,
      allow: [".."]
    },
    middlewareMode: false
  },
  preview: {
    port: 3e3,
    host: true,
    cors: true,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff"
    }
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTdGV2ZW5cXFxcRG9jdW1lbnRzXFxcXFByb2plY3RzXFxcXFByb2Zlc2lvbmFsXFxcXGFsZW1hbmFzZXJpZ3JhZmlhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTdGV2ZW5cXFxcRG9jdW1lbnRzXFxcXFByb2plY3RzXFxcXFByb2Zlc2lvbmFsXFxcXGFsZW1hbmFzZXJpZ3JhZmlhXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9TdGV2ZW4vRG9jdW1lbnRzL1Byb2plY3RzL1Byb2Zlc2lvbmFsL2FsZW1hbmFzZXJpZ3JhZmlhL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHZpdGVJbWFnZW1pbiBmcm9tICd2aXRlLXBsdWdpbi1pbWFnZW1pbic7XHJcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgdml0ZUltYWdlbWluKHtcclxuICAgICAgZ2lmc2ljbGU6IHtcclxuICAgICAgICBvcHRpbWl6YXRpb25MZXZlbDogNyxcclxuICAgICAgICBpbnRlcmxhY2VkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBvcHRpcG5nOiB7XHJcbiAgICAgICAgb3B0aW1pemF0aW9uTGV2ZWw6IDdcclxuICAgICAgfSxcclxuICAgICAgbW96anBlZzoge1xyXG4gICAgICAgIHF1YWxpdHk6IDgwXHJcbiAgICAgIH0sXHJcbiAgICAgIHBuZ3F1YW50OiB7XHJcbiAgICAgICAgcXVhbGl0eTogWzAuOCwgMC45XSxcclxuICAgICAgICBzcGVlZDogNFxyXG4gICAgICB9LFxyXG4gICAgICBzdmdvOiB7XHJcbiAgICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAncmVtb3ZlVmlld0JveCcsXHJcbiAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdyZW1vdmVFbXB0eUF0dHJzJyxcclxuICAgICAgICAgICAgYWN0aXZlOiBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgICB2aXRlQ29tcHJlc3Npb24oe1xyXG4gICAgICB2ZXJib3NlOiB0cnVlLFxyXG4gICAgICBhbGdvcml0aG06ICdnemlwJyxcclxuICAgICAgZXh0OiAnLmd6J1xyXG4gICAgfSlcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXHJcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxyXG4gICAgY3NzTWluaWZ5OiB0cnVlLFxyXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdmcmFtZXItbW90aW9uJ10sXHJcbiAgICAgICAgICB0aHJlZTogWyd0aHJlZScsICdAcmVhY3QtdGhyZWUvZmliZXInLCAnQHJlYWN0LXRocmVlL2RyZWknXSxcclxuICAgICAgICAgIHV0aWxzOiBbJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZScsICdAZm9ydGF3ZXNvbWUvZnJlZS1zb2xpZC1zdmctaWNvbnMnXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcclxuICAgICAgICAgIGNvbnN0IG5hbWUgPSBhc3NldEluZm8/Lm5hbWUgPz8gJyc7XHJcbiAgICAgICAgICBjb25zdCBpbmZvID0gbmFtZS5zcGxpdCgnLicpO1xyXG4gICAgICAgICAgbGV0IGV4dFR5cGUgPSBpbmZvLmxlbmd0aCA+IDEgPyBpbmZvW2luZm8ubGVuZ3RoIC0gMV0gOiAnJztcclxuICAgICAgICAgIGlmICgvcG5nfGpwZT9nfHN2Z3xnaWZ8dGlmZnxibXB8aWNvL2kudGVzdChleHRUeXBlKSkge1xyXG4gICAgICAgICAgICBleHRUeXBlID0gJ2ltZyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2V4dFR5cGV9L1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAzMDAwLFxyXG4gICAgaG9zdDogdHJ1ZSxcclxuICAgIGNvcnM6IHRydWUsXHJcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxyXG4gICAgICAnWC1Db250ZW50LVR5cGUtT3B0aW9ucyc6ICdub3NuaWZmJ1xyXG4gICAgfSxcclxuICAgIGZzOiB7XHJcbiAgICAgIHN0cmljdDogdHJ1ZSxcclxuICAgICAgYWxsb3c6IFsnLi4nXVxyXG4gICAgfSxcclxuICAgIG1pZGRsZXdhcmVNb2RlOiBmYWxzZVxyXG4gIH0sICBwcmV2aWV3OiB7XHJcbiAgICBwb3J0OiAzMDAwLFxyXG4gICAgaG9zdDogdHJ1ZSxcclxuICAgIGNvcnM6IHRydWUsXHJcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxyXG4gICAgICAnWC1Db250ZW50LVR5cGUtT3B0aW9ucyc6ICdub3NuaWZmJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJylcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdZLFNBQVMsb0JBQW9CO0FBQzdaLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxrQkFBa0I7QUFDekIsT0FBTyxxQkFBcUI7QUFKNUIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLE1BQ1gsVUFBVTtBQUFBLFFBQ1IsbUJBQW1CO0FBQUEsUUFDbkIsWUFBWTtBQUFBLE1BQ2Q7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLG1CQUFtQjtBQUFBLE1BQ3JCO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1IsU0FBUyxDQUFDLEtBQUssR0FBRztBQUFBLFFBQ2xCLE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxNQUFNO0FBQUEsUUFDSixTQUFTO0FBQUEsVUFDUDtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sUUFBUTtBQUFBLFVBQ1Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixRQUFRO0FBQUEsVUFDVjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxnQkFBZ0I7QUFBQSxNQUNkLFNBQVM7QUFBQSxNQUNULFdBQVc7QUFBQSxNQUNYLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUEsSUFDWCxtQkFBbUI7QUFBQSxJQUNuQixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxhQUFhLGVBQWU7QUFBQSxVQUM5QyxPQUFPLENBQUMsU0FBUyxzQkFBc0IsbUJBQW1CO0FBQUEsVUFDMUQsT0FBTyxDQUFDLHFDQUFxQyxtQ0FBbUM7QUFBQSxRQUNsRjtBQUFBLFFBQ0EsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixnQkFBTSxPQUFPLFdBQVcsUUFBUTtBQUNoQyxnQkFBTSxPQUFPLEtBQUssTUFBTSxHQUFHO0FBQzNCLGNBQUksVUFBVSxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDLElBQUk7QUFDeEQsY0FBSSxrQ0FBa0MsS0FBSyxPQUFPLEdBQUc7QUFDbkQsc0JBQVU7QUFBQSxVQUNaO0FBQ0EsaUJBQU8sVUFBVSxPQUFPO0FBQUEsUUFDMUI7QUFBQSxRQUNBLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUFJLFFBQVE7QUFBQSxJQUNWLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNQLCtCQUErQjtBQUFBLE1BQy9CLDBCQUEwQjtBQUFBLElBQzVCO0FBQUEsSUFDQSxJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsTUFDUixPQUFPLENBQUMsSUFBSTtBQUFBLElBQ2Q7QUFBQSxJQUNBLGdCQUFnQjtBQUFBLEVBQ2xCO0FBQUEsRUFBSSxTQUFTO0FBQUEsSUFDWCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUCwrQkFBK0I7QUFBQSxNQUMvQiwwQkFBMEI7QUFBQSxJQUM1QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
