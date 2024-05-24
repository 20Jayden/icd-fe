import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'

const log = useLog()
const wgLayers = {
	addLayerWMS: (layerName, layerId, opacity, zIndex, logTargetLayer) => {
		const _param = {
			VERSION: '1.3.0',
			LAYERS: `${layerName}`,
			TILED: true,
		}
		const layer = new wg.layer.Tile({
			id: `${layerId}`,
			source: new wg.source.TileWMS({
				url: 'gis/wms',
				params: _param,
				crossOrigin: 'Anonymous',
			}),
			visible: true,
			opacity: opacity,
			zIndex: zIndex,
		})
		if (logTargetLayer != null) {
			layer.on('change:visible', function (event) {
				const isVisible = event.target.getVisible()
				if (isVisible == true) {
					CommonUtil.log(logTargetLayer, log.ACTION.SUCCESS, null)
				}
			})
		}
		WGMap.addLayer(layer)
		return layer
	},

	// addLayerWFS: async (layerName, layerId, style, opacity, zIndex) => {
	// 	const source = new wg.source.Vector({
	// 		name: 'srcVec',
	// 		format: new wg.format.GeoJSON(),
	// 		url: (extent) => {
	// 			// 이전에 추가된 레이어 제거
	// 			// source.clear()
	// 			console.log('extent', extent)
	// 			return (
	// 				console.log('레이어 생성'),
	// 				'/gis/wfs' +
	// 					'?service=WFS&' +
	// 					`version=1.1.0&request=GetFeature&typename=${layerName}&` +
	// 					`bbox=${extent.join(',')}&` +
	// 					'outputFormat=application/json'
	// 			)
	// 		},
	// 		strategy: wg.loadingstrategy.bbox,
	// 	})

	// 	const wfsLayer = await new wg.layer.Vector({
	// 		id: layerId,
	// 		source: source,
	// 		style: style,
	// 		opacity: opacity,
	// 		visible: true,
	// 		zIndex: zIndex,
	// 	})

	// 	WGMap.addLayer(wfsLayer)

	// 	WGMap.on('moveend', function () {
	// 		wfsLayer.getSource().clear()
	// 		console.log('레이어 제거')
	// 	})
	// 	// return wfsLayer
	// },
	addLayerWFS: async (layerName, layerId, style, opacity, zIndex) => {
		let source = null

		const createSource = (extent) => {
			source = new wg.source.Vector({
				name: 'srcVec',
				format: new wg.format.GeoJSON(),
				url:
					'/gis/wfs' +
					'?service=WFS&' +
					`version=1.1.0&request=GetFeature&typename=${layerName}&` +
					`bbox=${extent.join(',')}&` +
					'outputFormat=application/json',
				strategy: wg.loadingstrategy.bbox,
			})
		}

		// 지도 영역에 따라 source 생성
		createSource(WGMap.getView().calculateExtent())

		const wfsLayer = new wg.layer.Vector({
			id: layerId,
			source: source,
			style: style,
			opacity: opacity,
			visible: true,
			zIndex: zIndex,
		})

		WGMap.addLayer(wfsLayer)

		// 지도 이동 종료
		WGMap.on('moveend', function () {
			// 새로운 지도 영역 계산
			const newExtent = WGMap.getView().calculateExtent()
			// 이전 extent와 새로운 extent를 비교하여 변경 여부 확인
			if (!wg.extent.equals(source.getExtent(), newExtent)) {
				// extent가 변경되었을 경우 source를 비우고 새로운 source를 생성
				source.clear()
				createSource(newExtent)

				// 변경된 source를 wfsLayer에 설정
				wfsLayer.setSource(source)
			}
		})
	},
}

export default wgLayers
