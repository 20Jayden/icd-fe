import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// import eslintPlugin from 'vite-plugin-eslint'

// GeoServer URL 생성
const VITE_PROPERTIES = loadEnv(process.env.NODE_ENV, process.cwd())
const { VITE_GIS_PROTOCOL, VITE_GIS_HOST, VITE_GIS_PORT } = VITE_PROPERTIES
const GIS_SERVER = `${VITE_GIS_PROTOCOL}://${VITE_GIS_HOST}:${VITE_GIS_PORT}`

const proxy = {
	'/smap': {
		target: 'https://map.seoul.go.kr',
		changeOrigin: true,
		// xfwd: true,
		secure: false,
		rewrite: (path) => path.replace(/^\/smap/, ''),
	},
	'/gis': {
		target: GIS_SERVER,
		changeOrigin: true,
		xfwd: true,
		rewrite: (path) => path.replace(/^\/gis/, '/geoserver'),
	},
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 3000,
		proxy,
	},
})
