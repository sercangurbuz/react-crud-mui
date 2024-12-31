// vite.config.ts
import { resolve } from "path";
import { nodeResolve } from "file:///home/sercangurbuz/projects/apex-coreui/node_modules/@rollup/plugin-node-resolve/dist/es/index.js";
import react from "file:///home/sercangurbuz/projects/apex-coreui/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///home/sercangurbuz/projects/apex-coreui/node_modules/vite-plugin-dts/dist/index.mjs";
import { externalizeDeps } from "file:///home/sercangurbuz/projects/apex-coreui/node_modules/vite-plugin-externalize-deps/dist/index.js";
import { defineConfig } from "file:///home/sercangurbuz/projects/apex-coreui/node_modules/vitest/dist/config.js";
var __vite_injected_original_dirname = "/home/sercangurbuz/projects/apex-coreui";
var vite_config_default = defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup/setup.ts"]
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "coreui"
    }
  },
  plugins: [
    externalizeDeps(),
    nodeResolve(),
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"]
      }
    }),
    dts({
      tsconfigPath: resolve(__vite_injected_original_dirname, "tsconfig.build.json"),
      include: ["src/index.ts", "src/components"],
      copyDtsFiles: true
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9zZXJjYW5ndXJidXovcHJvamVjdHMvYXBleC1jb3JldWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3NlcmNhbmd1cmJ1ei9wcm9qZWN0cy9hcGV4LWNvcmV1aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9zZXJjYW5ndXJidXovcHJvamVjdHMvYXBleC1jb3JldWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7IG5vZGVSZXNvbHZlIH0gZnJvbSAnQHJvbGx1cC9wbHVnaW4tbm9kZS1yZXNvbHZlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5pbXBvcnQgeyBleHRlcm5hbGl6ZURlcHMgfSBmcm9tICd2aXRlLXBsdWdpbi1leHRlcm5hbGl6ZS1kZXBzJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogWycuL3NyYy90ZXN0LXNldHVwL3NldHVwLnRzJ10sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICAgIGZpbGVOYW1lOiAnY29yZXVpJyxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgZXh0ZXJuYWxpemVEZXBzKCksXG4gICAgbm9kZVJlc29sdmUoKSxcbiAgICByZWFjdCh7XG4gICAgICBqc3hJbXBvcnRTb3VyY2U6ICdAZW1vdGlvbi9yZWFjdCcsXG4gICAgICBiYWJlbDoge1xuICAgICAgICBwbHVnaW5zOiBbJ0BlbW90aW9uL2JhYmVsLXBsdWdpbiddLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBkdHMoe1xuICAgICAgdHNjb25maWdQYXRoOiByZXNvbHZlKF9fZGlybmFtZSwgJ3RzY29uZmlnLmJ1aWxkLmpzb24nKSxcbiAgICAgIGluY2x1ZGU6IFsnc3JjL2luZGV4LnRzJywgJ3NyYy9jb21wb25lbnRzJ10sXG4gICAgICBjb3B5RHRzRmlsZXM6IHRydWUsXG4gICAgfSksXG4gIF0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVMsU0FBUyxlQUFlO0FBRS9ULFNBQVMsbUJBQW1CO0FBQzVCLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFDaEIsU0FBUyx1QkFBdUI7QUFDaEMsU0FBUyxvQkFBb0I7QUFON0IsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWSxDQUFDLDJCQUEyQjtBQUFBLEVBQzFDO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsSUFDZixLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLFNBQVMsQ0FBQyxJQUFJO0FBQUEsTUFDZCxVQUFVO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLGdCQUFnQjtBQUFBLElBQ2hCLFlBQVk7QUFBQSxJQUNaLE1BQU07QUFBQSxNQUNKLGlCQUFpQjtBQUFBLE1BQ2pCLE9BQU87QUFBQSxRQUNMLFNBQVMsQ0FBQyx1QkFBdUI7QUFBQSxNQUNuQztBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsSUFBSTtBQUFBLE1BQ0YsY0FBYyxRQUFRLGtDQUFXLHFCQUFxQjtBQUFBLE1BQ3RELFNBQVMsQ0FBQyxnQkFBZ0IsZ0JBQWdCO0FBQUEsTUFDMUMsY0FBYztBQUFBLElBQ2hCLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
