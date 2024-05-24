class Draw extends wg.interaction.Draw {
	constructor(options) {
		// sides 옵션이 있는경우(타원인경우) DrawRegular 생성
		if (options.type === 'circle' && options.sides !== undefined) {
			return new DrawRegular(options)
		}

		super(options)

		this.on('drawend', (event) => event.feature.set('styleName', options.styleName))
	}

	active() {
		WGMap.addInteraction(this)
		WGMap.set('isDrawing', true)
	}

	inactive() {
		WGMap.removeInteraction(this)
		WGMap.set('isDrawing', false)
	}
}

/**
 * wg-ext DrawRegular extends class
 */
class DrawRegular extends wg.interaction.DrawRegular {
	constructor(options) {
		super(options)

		this.on('drawend', (event) => {
			event.feature.set('styleName', options.styleName)
		})
	}

	active() {
		WGMap.addInteraction(this)
		WGMap.set('isDrawing', true)
	}

	inactive() {
		WGMap.removeInteraction(this)
		WGMap.set('isDrawing', false)
	}
}

export default Draw
