import { watch } from 'vue'
import { useLayerStore } from '@/stores/layer'
import { useWmsStore } from '@/stores/wms'
import { useViewStore } from '@/stores/view'
import { useModalStore } from '@/stores/modal'
const GIS_PROXY = `gis`

const zoomLimitLayerSquence = [6, 7, 8, 9, 10, 11, 12, 13, 14, 19, 20, 21, 24]

const layerStore = useLayerStore()
const wmsStore = useWmsStore()
const viewStore = useViewStore()
const modalStore = useModalStore()

/**
 * 14 레벨 이상 조회 레이어 감지
 */
watch(
	() => viewStore.zoom,
	(newValue) => {
		if (
			layerStore.visible[6] ||
			layerStore.visible[7] ||
			layerStore.visible[8] ||
			layerStore.visible[9] ||
			layerStore.visible[10] ||
			layerStore.visible[11] ||
			layerStore.visible[12] ||
			layerStore.visible[13] ||
			layerStore.visible[14] ||
			layerStore.visible[19] ||
			layerStore.visible[20] ||
			layerStore.visible[21] ||
			layerStore.visible[24]
		) {
			if (newValue < 14) {
				wms.setGroupVisible(false)
				modalStore.showToast('info', '14레벨 이상 조회 가능한 레이어입니다')
				return
			} else {
				wms.setGroupVisible(true)
			}
		}
	}
)

const wms = {
	create: (layerWorkSpace, seq) => {
		if (layerWorkSpace && seq) {
			// 레이어정보 조회
			const layerInfo = layerStore.getAllLayer.filter((layer) => layer.layerSequence == seq)[0]

			if (!layerInfo) {
				console.error(`Layer ${seq} does not exist in the Layer Master.`)
				return false
			}

			const { layerSequence, layerWorkSpace, layerId, layerTypeCode } = layerInfo
			const layerKey = `wms-${layerSequence}`

			const wmsSource = new wg.source.TileWMS({
				url: `${GIS_PROXY}/wms`,
				params: {
					CRS: 'EPSG:5186',
					VERSION: '1.3.0',
					LAYERS: `${layerWorkSpace}:${layerId}`,
					TILED: true,
				},
				// crossOrigin: 'Anonymous',
			})

			const wmsLayer = new wg.layer.Tile({
				id: layerKey,
				source: wmsSource,
				visible: true,
				opacity: 1,
				zIndex: layerSequence === 16 ? 116 : layerSequence === 15 ? 115 : 1,
			})

			// let tileLoadCount = 0

			// WMS 요청의 상태를 모니터링합니다.
			wmsSource.on('tileloadstart', function () {
				// WMS 타일 로딩이 시작될 때 로딩 화면을 표시합니다.
				// tileLoadCount++
				// loadingStore.isLoading = true
				wmsStore.tileLoadCount++
			})

			wmsSource.on('tileloadend', function () {
				// WMS 타일 로딩이 완료될 때 로딩 화면을 숨깁니다.
				wmsStore.tileLoadCount--
			})

			// 줌레벨 제한 레이어 그룹에 추가
			if (zoomLimitLayerSquence.includes(seq)) {
				let zoomLimitLayer = _zoomLimitLayer()

				if (zoomLimitLayer instanceof wg.layer.Group) {
					zoomLimitLayer.getLayers().push(wmsLayer)
				}
			}

			// 주제도레이어 그룹
			let groupLayer = _groupLayer()

			// 그룹 레이어 내부의 레이어 목록에 새 레이어를 추가합니다.
			if (groupLayer instanceof wg.layer.Group) {
				groupLayer.getLayers().push(wmsLayer)
			}

			console.log('2D WMS 생성', `${layerWorkSpace}:${layerId}`)
		}
	},
	setVisible: (layerWorkSpace, layerSeq, bool) => {
		let groupLayersArray, wmsLayer
		// 주제도레이어 그룹
		let groupLayer = _groupLayer()
		let zoomLimitLayer = _zoomLimitLayer()

		// 줌레벨 제한 레이어 그룹 내부에서 레이어 찾기
		if (zoomLimitLayerSquence.includes(layerSeq)) {
			groupLayersArray = zoomLimitLayer.getLayers().getArray()
			wmsLayer = groupLayersArray.find((layer) => layer.get('id') === 'wms-' + layerSeq)

			// 체크가 안되었을 경우, 그룹레이어에서 삭제
			if (!bool) {
				zoomLimitLayer.getLayers().remove(wmsLayer)
			}
		} else {
			// 주제도레이어 그룹 내부에서 레이어 찾기
			groupLayersArray = groupLayer.getLayers().getArray()

			wmsLayer = groupLayersArray.find((layer) => layer.get('id') === 'wms-' + layerSeq)
		}

		// visible true인데, 레이어가 존재하지 않는다면 생성
		if (bool && !wmsLayer) {
			wms.create(layerWorkSpace, layerSeq)
			wmsLayer = WGMap.getLayerById(layerSeq)
		}

		wmsLayer?.setVisible(bool)
	},
	setGroupVisible: (bool) => {
		// 주제도레이어 그룹
		let groupLayer = _zoomLimitLayer()

		// 주제도레이어 그룹 내부에서 레이어 찾기
		const groupLayersArray = groupLayer.getLayers().getArray()
		groupLayersArray.forEach((layer) => {
			layer.setVisible(bool)
		})
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

const _zoomLimitLayer = () => {
	const layers = WGMap.getLayers().getArray()
	const groupLayer = layers.find((layer) => layer.get('id') === 'zoomLimitLayer')

	return groupLayer
}

export default wms
