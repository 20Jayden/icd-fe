import { useLayerStore } from '@/stores/layer'
import { useWmsStore } from '@/stores/wms'
const GIS_PROXY = `gis`

const { VITE_VWORLD_API_KEY } = import.meta.env

const VWORLD_WMS_URL = 'http://api.vworld.kr/req/wms' //location.origin + '/vworld' + '/req/wms'

const VWORLD_PROXY = location.origin + '/vworld' + '/req/wms' //`${VITE_GIS_PROTOCOL}://${VITE_GIS_HOST}/vworld`

const layerStore = useLayerStore()
const wmsStore = useWmsStore()

const vworld = {
	create: (seq) => {
		if (seq) {
			// 레이어정보 조회
			const layerInfo = layerStore.getAllLayer.filter((layer) => layer.layerSequence == seq)[0]

			if (!layerInfo) {
				console.error(`Layer ${seq} does not exist in the Layer Master.`)
				return false
			}

			const { layerSequence, layerWorkSpace, layerId, layerTypeCode } = layerInfo
			const layerKey = `wms-${layerSequence}`

			const vworldSource = new wg.source.TileWMS({
				// url: '/vworld/req/wms',
				url: VWORLD_WMS_URL,
				//url: VWORLD_PROXY,
				params: {
					key: VITE_VWORLD_API_KEY,
					LAYERS: layerId.toLowerCase(),
					TILED: true,
					TRANSPARENT: true,
					CRS: 'EPSG:3857',
					WIDTH: 512,
					HEIGHT: 512,
				},
				//crossOrigin: 'Anonymous',
			})

			const vworldLayer = new wg.layer.Tile({
				id: layerKey,
				source: vworldSource,
				visible: true,
				zIndex: WGMap.getAllLayers().filter((l) => l.get('type') != 'base').length + 1,
			})

			WGMap.addLayer(vworldLayer)

			console.log('2D vworld 생성', `${layerWorkSpace}:${layerId}`)

			let tileLoadCount = 0

			// WMS 요청의 상태를 모니터링합니다.
			vworldSource.on('tileloadstart', function () {
				// WMS 타일 로딩이 시작될 때 로딩 화면을 표시합니다.
				// tileLoadCount++
				// loadingStore.isLoading = true
				wmsStore.tileLoadCount++
			})

			vworldSource.on('tileloadend', function () {
				// WMS 타일 로딩이 완료될 때 로딩 화면을 숨깁니다.
				wmsStore.tileLoadCount--
			})

			// 주제도레이어 그룹
			let groupLayer = _groupLayer()

			// 그룹 레이어 내부의 레이어 목록에 새 레이어를 추가합니다.
			if (groupLayer instanceof wg.layer.Group) {
				groupLayer.getLayers().push(vworldLayer)
			}
		}
	},
	setVisible: (layerSeq, bool) => {
		// 주제도레이어 그룹
		let groupLayer = _groupLayer()

		// 주제도레이어 그룹 내부에서 레이어 찾기
		const groupLayersArray = groupLayer.getLayers().getArray()
		let vworldLayer = groupLayersArray.find((layer) => layer.get('id') === 'wms-' + layerSeq)

		// visible true인데, 레이어가 존재하지 않는다면 생성
		if (bool && !vworldLayer) {
			vworld.create(layerSeq)
			vworldLayer = WGMap.getLayerById(layerSeq)
		}

		vworldLayer?.setVisible(bool)
	},
	inVisible: () => {
		WGMap.getAllLayers()
			.filter((layer) => layer.get('id').toLowerCase().startsWith('wms'))
			.forEach((layer) => layer.setVisible(false))
	},
}

const _groupLayer = () => {
	// 'WGMap'은 현재 OpenLayers 맵 인스턴스
	const layers = WGMap.getLayers().getArray()
	// 특정 이름 또는 속성을 사용하여 그룹 레이어를 찾습니다.
	const groupLayer = layers.find((layer) => layer.get('id') === 'thematicLayer')

	return groupLayer
}

export default vworld
