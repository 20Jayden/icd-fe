/**
 * Modify 인터렉션
 *  - wg.interaction.Modify 상속
 *  - 텍스트 수정에 필요한 코드 추가
 */
class Modify extends wg.interaction.Modify {
	_snapInteraction = undefined

	constructor(options) {
		super(options)

		// 스냅 인터렉션 생성
		this._snapInteraction = new wg.interaction.Snap({ source: options.source })

		// 텍스트가 이동한경우 오버레이를 함께 이동시키기 위한 로직
		this.on('modifyend', function (evt) {
			const textOverlay = WGMap.getOverlayById('drawTextOverlay')
			console.log('textOverlay?.rendered.visible222', textOverlay?.rendered.visible)

			// 텍스트입력 오버레이 표시여부 확인
			if (textOverlay?.rendered.visible) {
				console.log('textOverlay?.rendered.visible222', textOverlay?.rendered.visible)
				// 텍스트입력 오버레이가 표시되어있다면, 수정된 포인트 중에 text포인트가 있는지 확인
				// const targetUID = textOverlay.get('targetUID')
				const modifiedTarget = evt.features.getArray().filter((f) => f === textOverlay.get('target'))
				if (modifiedTarget.length === 1) {
					// 오버레이 위치 수정
					textOverlay.setPosition(modifiedTarget[0].getGeometry().getCoordinates())
				}
			}
		})
	}

	handleUpEvent(evt) {
		evt.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
			// 텍스트 클릭여부
			if (layer?.get('id', 'drawLayer') && feature.get('styleName') == 'text') {
				const textOverlay = WGMap.getOverlayById('drawTextOverlay')

				textOverlay.setPosition(evt.coordinate)
				textOverlay.set('target', feature)
				document.getElementById('textDrawInput').value = feature.get('name') || ''
			}
		})
		super.handleUpEvent(evt)
	}

	active() {
		WGMap.addInteraction(this)
		WGMap.addInteraction(this._snapInteraction)
	}

	inactive() {
		// 오버레이 해제
		WGMap.getOverlayById('drawTextOverlay')?.setPosition(undefined)
		// 인터렉션 해제
		WGMap.removeInteraction(this._snapInteraction)
		WGMap.removeInteraction(this)
	}
}

export default Modify
