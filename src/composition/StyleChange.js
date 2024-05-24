import { select, select as selectStyle } from './drawStyle'

/**
 * 스타일 변경 인터렉션
 */
class StyleChange extends wg.interaction.Select {
	_boxSelectInteraction = undefined
	_source = undefined
	_selectedFeatures = this.getFeatures()

	constructor(options) {
		super(options)

		this._source = options.source
		console.log('this._source', this._source)
		this.style_ = (feature) => {
			selectStyle.getText().setText('')
			if (feature.get('styleName') === 'text') {
				selectStyle.getText().setText(feature.get('name') || 'text')
			}
			return selectStyle
		}

		// length가 변경될때마다 수행되므로 중복수행됨.
		this._selectedFeatures.on('change:length', ({ target, oldValue }) => {
			let count = {
				point: 0,
				linestring: 0,
				polygon: 0,
				text: 0,
				circle: 0,
			}

			// 카운트 증가
			console.log('target', target)
			target.getArray().forEach((f) => {
				count[f.get('styleName')]++
			})

			// target.getArray().forEach((f) => {
			// 	const styleName = f.get('styleName')

			// 	// styleName이 'circle일 때도 'polygon'에 count
			// 	if (styleName === 'polygon') {
			// 		count.polygon++
			// 	} else if (styleName === 'circle') {
			// 		count.circle++
			// 	} else {
			// 		count[styleName]++
			// 	}
			// })

			let popup = document.getElementById('drawStyle')

			Object.keys(count).forEach((k) => {
				$(popup)
					.find(`#${k}-badge`)
					.css('display', count[k] > 0 ? 'inline-flex' : 'none')
					.find('span')
					.text(count[k])
				if (!count[k]) {
					$(`#tbl-${k}`).find('input[type=button]').attr('disabled', true)
				} else {
					$(`#tbl-${k}`).find('input[type=button]').removeAttr('disabled')
				}
			})
			// stylePopup.setBadge(count)
		})

		// 박스선택 인터렉션 생성
		this._boxSelectInteraction = new wg.interaction.DragBox({
			condition: wg.events.condition.platformModifierKeyOnly,
		})

		// 박스선택 시작 이벤트 리스너
		this._boxSelectInteraction.on('boxstart', () => {
			this._selectedFeatures.clear()
		})

		// 박스선택 종료 이벤트 리스너
		this._boxSelectInteraction.on('boxend', (e) => {
			const extent = this._boxSelectInteraction.getGeometry().getExtent()
			const boxFeatures = options.source
				.getFeaturesInExtent(extent)
				.filter((feature) => feature.getGeometry().intersectsExtent(extent))

			// 지도 회전여부
			const rotation = WGMap.getView().getRotation()
			const oblique = rotation % (Math.PI / 2) !== 0

			// 회전해있다면 드래그박스도 회전해서 intersect 검사
			if (oblique) {
				const anchor = [0, 0]
				const geometry = this._boxSelectInteraction.getGeometry().clone()
				geometry.rotate(-rotation, anchor)
				const extent = geometry.getExtent()
				boxFeatures.forEach(function (feature) {
					const geometry = feature.getGeometry().clone()
					geometry.rotate(-rotation, anchor)
					if (geometry.intersectsExtent(extent)) {
						this._selectedFeatures.push(feature)
					}
				})
			} else {
				this._selectedFeatures.extend(boxFeatures)
			}
		})
	}

	active() {
		WGMap.addInteraction(this)
		WGMap.addInteraction(this._boxSelectInteraction)
		// stylePopup.open(this.styleSaveCallback, this.deleteCallback)
	}

	inactive() {
		WGMap.removeInteraction(this)
		WGMap.removeInteraction(this._boxSelectInteraction)
		this._boxSelectInteraction = undefined
		// stylePopup.close()
	}

	/**
	 * 스타일 변경 콜백함수
	 * @param {String} type : point | linestring | polygon | text
	 * @param {wg.style.Style} style
	 */
	styleSaveCallback = ({ type, style }) => {
		// 선택된 피쳐들의 원본피쳐 조회
		const selectedOriginFeatures = this._source.getFeatures().filter((draw) => {
			return this._selectedFeatures.getArray().some((selected) => draw.wg_uid === selected.wg_uid)
		})

		// selectedfeature === drawfeature 이지만,
		// selectedfeature가 사라질때 인터렉션에서 스타일을 selected스타일 -> 원래스타일로 변경한다.
		// 따라서 selectedfeature가 사라지면서 스타일이 원상복구된다.
		// selectedfeature를 지우고 원본 feature에 스타일을 적용해야 반영된다.
		let selectedCopy = [...this._selectedFeatures.getArray()]

		// 클리어를 하지않으면 스타일이 적용되지 않는다.
		this._selectedFeatures.clear()

		// 원본 피쳐에서
		selectedOriginFeatures
			.filter((f) => type === f.get('styleName')) // 해당타입만 필터링
			.forEach((f) => {
				style = style.clone()
				if (type === 'Text') {
					style.getText().setText(f.get('name') || 'Text')
				}
				f.setStyle(style)
			}) // 스타일변경

		// 스타일 변경을 안한 타입은 셀렉트상태로 다시 만들기
		this._selectedFeatures.extend(selectedCopy.filter((f) => type !== f.get('styleName')))
	}

	/**
	 * 도형삭제 콜백함수
	 * @param {String} type
	 */
	deleteCallback = (type) => {
		this._selectedFeatures
			.getArray()
			.filter((f) => type === f.get('styleName')) // 해당타입만 필터링
			.forEach((f) => {
				this._source.removeFeature(f) // 원본피쳐 소스에서 삭제
				this._selectedFeatures.remove(f) // selected 삭제
			})
	}
}

export default StyleChange
