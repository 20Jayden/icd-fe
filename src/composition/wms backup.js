const GIS_PROXY = `gis`

const wms = {
	create: (layerWorkSpace, layerId) => {
		if (layerWorkSpace && layerId) {
			const wmsLayer = new wg.layer.Tile({
				id: layerId,
				source: new wg.source.TileWMS({
					url: `${GIS_PROXY}/wms`,
					params: {
						CRS: 'EPSG:5186',
						VERSION: '1.3.0',
						LAYERS: `${layerWorkSpace}:${layerId}`,
						TILED: true,
					},
					crossOrigin: 'Anonymous',
				}),
				visible: true,
				opacity: 0.5,
				zIndex: 6,
			})
			WGMap.addLayer(wmsLayer)
			console.log('2D WMS 생성', `${layerWorkSpace}:${layerId}`)
		}
	},
	setVisible: (layerWorkSpace, layerId, bool) => {
		let wmsLayer = WGMap.getLayerById(layerId)
		// visible true인데, 레이어가 존재하지 않는다면 생성
		if (bool && !wmsLayer) {
			wms.create(layerWorkSpace, layerId)
			wmsLayer = WGMap.getLayerById(layerId)
			console.log(wmsLayer)
		}

		wmsLayer?.setVisible(bool)
	},
}

export default wms
