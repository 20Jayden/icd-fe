// 드로잉 기본 스타일
export const draw = new wg.style.Style({
	fill: new wg.style.Fill({
		color: 'rgba(255, 255, 255, 0.5)',
	}),
	stroke: new wg.style.Stroke({
		color: '#ff008e',
		width: 2.5,
	}),
	image: new wg.style.Circle({
		radius: 5,
		fill: new wg.style.Fill({
			color: '#ff008e',
		}),
		stroke: new wg.style.Stroke({
			color: '#ff008e',
			width: 2.5,
		}),
	}),
})

// 선택 스타일
export const select = new wg.style.Style({
	fill: new wg.style.Fill({
		color: 'rgb(255,255,0,0.5)',
	}),
	stroke: new wg.style.Stroke({
		// color: '#ff008e',
		color: 'yellow',
		width: 2.5,
	}),
	image: new wg.style.Circle({
		radius: 5,
		fill: new wg.style.Fill({
			color: 'yellow',
		}),
	}),
	text: new wg.style.Text({
		font: '14px Calibri,sans-serif',
		text: 'text',
		placement: 'point',
		fill: new wg.style.Fill({
			color: 'yellow',
		}),
		stroke: new wg.style.Stroke({
			color: 'rgb(255,255,0,0.5)',
			width: 2.5,
		}),
	}),
})

// 라벨 스타일
export const label = new wg.style.Style({
	text: new wg.style.Text({
		font: '14px Calibri,sans-serif',
		text: 'text1',
		placement: 'point',
		fill: new wg.style.Fill({
			color: '#ff008e',
		}),
		stroke: new wg.style.Stroke({
			color: '#ff008e',
			width: 2.5,
		}),
	}),
})

export default draw
