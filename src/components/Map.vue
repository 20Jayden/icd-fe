<template>
	<div class="map-area" style="background-color: #f6f6ee">
		<div id="map"></div>
	</div>
</template>

<script>
import { onMounted, watch } from 'vue'
import { useViewStore } from '@/stores/view'
import { useToolStore } from '@/stores/tool'
import optionsApi from '@/api/options'
import locationApi from '@/api/location'
import { useLocationStore } from '@/stores/location'
import locationJson from '@/composition/locationJson.json'
import { useUserStore } from '@/stores/user'

const apiKey = import.meta.env.VITE_VWORLD_API_KEY

// WGMap 프로토타입 추가
function addPrototype() {
	wg.Map.prototype.getLayerById = function (id) {
		const result = this.getAllLayers().filter((layer) => layer.get('id') === id)
		return result.length > 0 ? result[0] : undefined
	}
	wg.Map.prototype.setBaseLayer = function (name) {
		this.getLayers()
			.getArray()
			.filter((layer) => layer.get('type') === 'base')
			.forEach((base) => base.setVisible(base.get('id').toLowerCase() === name.toLowerCase()))
	}
	wg.Map.prototype.getParamString = (params) => {
		return Object.keys(params)
			.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
			.join('&')
	}
}
export default {
	name: 'Map',
	setup() {
		let map = undefined

		const userStore = useUserStore()

		// 좌표계 등록
		const defineProjection = () => {
			proj4.defs([
				[
					'EPSG:5179',
					'+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
				],
				[
					'EPSG:5186',
					'+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
				],
			])
			new wg.proj.proj4.register(proj4)
		}

		onMounted(() => {
			addPrototype()
			defineProjection()
			initMap()
		})

		const initMap = () => {
			/**
			 * 브이월드 지도 옵션
			 */
			const baseMapOptions = {
				id: 'Base',
				title: 'VWorld Base Map',
				visible: true, //이곳
				type: 'base',
				source: new wg.source.XYZ({
					url: `http://api.vworld.kr/req/wmts/1.1.1/${apiKey}/Base/{z}/{y}/{x}.png`,
					crossOrigin: 'Anonymous',
				}),
				zIndex: 0,
			}
			const sateliteMapOptions = {
				id: 'Satellite',
				title: 'VWorld Satellite Map',
				visible: true,
				type: 'base',
				source: new wg.source.XYZ({
					url: `http://api.vworld.kr/req/wmts/1.1.1/${apiKey}/Satellite/{z}/{y}/{x}.jpeg`,
					crossOrigin: 'Anonymous',
				}),
			}
			/**
			 * 스마트서울맵 WMTS source 속성 : projection 및 tileGrid
			 */
			const projection = new wg.proj.Projection({
				code: 'EPSG:5179',
				units: 'm',
				axisOrientation: 'neu',
				global: false,
			})
			const tileGrid = new wg.tilegrid.WMTS({
				origin: [90112, 2765760],
				resolutions: [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],
				matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
				tileSize: 256,
				extent: [90112, 1192896, 2187264, 2765760],
			})
			/**
			 * 스마트서울맵 WMTS source 생성
			 */
			const createWmtsSource = (name) => {
				return new wg.source.WMTS({
					url: '',
					projection: projection,
					tileGrid: tileGrid,
					tileLoadFunction: function (imageTile) {
						const { tileCoord } = imageTile

						var z = tileCoord[0]
						var x = tileCoord[1]
						var y = tileCoord[2]

						// y axis reverse
						var range = tileGrid.getFullTileRange(z)
						var _y = range.getHeight() - y - 1

						var mapName = 'dawul_' + name

						let src =
							'/smap/smgis2/mapsvr/getTileMap?key=ea061e94268b45c0b4ac9859a7b591af&URL=http://smjd3:7070/MapAppServer/Service'

						src += `?timg=${mapName}/${z}/${Math.floor(x / 50)}/${Math.floor(
							_y / 50
						)}/${x}_${_y}.png`
						imageTile.getImage().src = src
					},
					wrapX: false,
				})
			}
			/**
			 * 스마트서울맵 지도 옵션
			 */
			const smapBaseMapOptions = {
				id: 'smapBase',
				title: 'Smap Base Map',
				visible: false, //이곳
				type: 'base',
				source: createWmtsSource('kor_normal'),
				zIndex: 0,
			}

			const smapsateliteMapOptions = {
				id: 'smapSatellite',
				title: 'Smap Satellite Map',
				visible: false,
				type: 'base',
				source: createWmtsSource('kor_air'),
				zIndex: 0,
			}

			/**
			 * 스마트서울맵 배경지도
			 */
			const smapBaseLayer = new wg.layer.Tile({
				...smapBaseMapOptions,
			})
			/**
			 * 스마트서울맵 영상지도
			 */
			const smapSatelliteLayer = new wg.layer.Tile({
				...smapsateliteMapOptions,
			})

			// 하이브리드 배경지도
			const satelliteHybridLayer = new wg.layer.Tile({
				id: 'sateliteHybrid',
				title: 'VWorld Hybrid Map',
				visible: false,
				source: new wg.source.XYZ({
					url: `http://api.vworld.kr/req/wmts/1.1.1/${apiKey}/Hybrid/{z}/{y}/{x}.png`,
					crossOrigin: 'Anonymous',
				}),
				type: 'base',
			})

			const _params = {
				VERSION: '1.3.0',
				LAYERS: `spta:GIS_OP_Z_NGII_N3A_G0010000`,
				TILED: true,
			}
			const sggLineLayer = new wg.layer.Tile({
				id: 'sggLine',
				source: new wg.source.TileWMS({
					url: 'gis/wms',
					params: _params,
					// crossOrigin: 'Anonymous',
				}),
				visible: true,
				opacity: 1,
				zIndex: 255,
			})

			/**
			 * 브이월드 배경지도
			 */
			const baseLayer = new wg.layer.Tile({
				...baseMapOptions,
			})
			/**
			 * 브이월드 영상지도
			 */
			const satelliteLayer = new wg.layer.Tile({
				...sateliteMapOptions,
			})

			/**
			 * 주제도 레이어 Group
			 */
			const thematicLayer = new wg.layer.Group({
				id: 'thematicLayer',
				title: 'thematic Layers Group',
				visible: true,
				layers: [],
				zIndex: 1,
			})

			/**
			 * 주제도 레이어 줌레벨 제한 Group
			 */
			const zoomLimitLayer = new wg.layer.Group({
				id: 'zoomLimitLayer',
				title: 'thematic limit zoom level Layer Group',
				visible: true,
				layers: [],
				zIndex: 1,
			})

			/**
			 * 맵 생성
			 */
			map = new wg.Map({
				target: 'map',
				layers: [
					baseLayer,
					satelliteLayer,
					satelliteHybridLayer,
					sggLineLayer,
					thematicLayer,
					zoomLimitLayer,
					smapBaseLayer,
					smapSatelliteLayer,
				],
				view: new wg.View({
					center: wg.proj.fromLonLat([126.97837, 37.566632]), // 카메라 중심 좌표
					zoom: 17, // 줌레벨 초기화
					minZoom: 10, // 최소 줌레벨
					maxZoom: 19, // 최대 줌레벨
					constrainResolution: true, // 줌 정수로만 떨어지게
				}),
				interactions: wg.interaction.defaults.defaults({
					doubleClickZoom: false,
					mouseWheelZoom: true,
				}),
			})
			const ogdpCd = userStore.loginUser.ogdpCd
			const selectedLocation = locationJson.find((location) => location.sigCd === ogdpCd)
			//소속에 따른 map 위치변경
			if (selectedLocation) {
				map
					.getView()
					.setCenter(
						wg.proj.fromLonLat([parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)])
					)
			}
			map.on('click', (e) => {
				// console.log(wg.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326'))
				console.log(e.coordinate)
			})

			let ctrl = new wg.control.Swipe()

			map.addControl(ctrl)

			ctrl.addLayer(baseLayer)
			ctrl.addLayer(satelliteLayer, true)
			// ctrl.addLayer(vectorLayer, true)

			window.addEventListener('popstate', function (event) {
				if (event.state === null) {
					return
				}
				map.getView().setCenter(event.state.center)
				map.getView().setZoom(event.state.zoom)
				map.getView().setRotation(event.state.rotation)
				shouldUpdate = false
			})

			// map.on('moveend', moveEnd)
			window.WGMap = map
			/**
			 * scale Line 생성
			 */
			const scaleLine = new wg.control.ScaleLine({
				units: 'metric',
			})
			map.addControl(scaleLine)

			let scaleLineElement = scaleLine.element
			scaleLineElement.style.left = 'unset'
			scaleLineElement.style.right = '15px'
		}

		return {}
	},
}
</script>

<style scoped>
#map {
	position: fixed;
	top: 0px;
	left: 0px;
	/* width: 133.3%;
	height: 133.3%; */
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 0;
	zoom: 133.3%; /* 임시 */
}

#crosshair {
	position: absolute;
	top: 52.5%;
	left: 49.5%;
	width: 10px;
	height: 10px;
	margin: 0px;
	z-index: 4;
	pointer-events: none;
}

.wg-scale-line {
	left: unset !important;
	right: 0px !important;
}
</style>
