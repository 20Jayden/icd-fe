import PopFeatureInfo from '@/components/popup/PopFeatureInfo.vue'
import { useColorStore } from '@/stores/color'
import { watch, ref } from 'vue'

export default function useStyle() {
	// TODO: 관리자가 세팅한 컬러 조회
	// const positive_colors = ['#fff', '#fdd', '#faa', '#f99', '#f66', '#f33', '#f00']

	const colorStore = useColorStore()
	const positive_colors = ref(colorStore.colors)

	watch(
		() => colorStore.colors,
		(newSelectedColors) => {
			positive_colors.value = newSelectedColors
			// console.log('positive_colors', positive_colors.value)
		}
	)

	// 선택 스타일
	const SELECTED_STYLE = {
		stroke: () =>
			new wg.style.Style({
				stroke: new wg.style.Stroke({
					color: 'yellow',
					width: 3,
				}),
			}),
		fill: () =>
			new wg.style.Style({
				fill: new wg.style.Fill({
					color: 'yellow',
				}),
			}),
	}

	// 일반 스타일
	const STYLE = {
		stroke: () =>
			new wg.style.Style({
				stroke: new wg.style.Stroke({
					color: 'rgba(100, 149, 237, 1)',
					width: 2,
				}),
			}),
		fill: (step) =>
			new wg.style.Style({
				fill: new wg.style.Fill({
					// 표현하기 어려움.
					// 관리자가 설정한 색상으로 해야함.
					// 절대값인경우: 음수 7단계, 양수7단계 필요
					// color: hasNegativeValues ? negative_colors[step] : positive_colors[step],
					color: positive_colors.value[step],
				}),
			}),
		title: (title) =>
			new wg.style.Style({
				text: new wg.style.Text({
					font: '1rem sans-serif',
					fill: new wg.style.Fill({ color: 'black' }),
					// stroke: new wg.style.Stroke({
					// 	color: 'rgba(0, 0, 0, 1)',
					// 	width: 4,
					// }),
					offsetY: -10,
					text: title,
				}),
			}),
		subTitle: (subTitle) =>
			new wg.style.Style({
				text: new wg.style.Text({
					font: '1.5rem sans-serif',
					fill: new wg.style.Fill({ color: 'white' }),
					stroke: new wg.style.Stroke({
						color: 'rgba(0, 0, 0, 1)',
						width: 3,
					}),
					offsetY: 15,
					text: subTitle,
				}),
			}),
	}

	const USER_REGION_STYLE = {
		// 영역 선택
		regionSelect: () =>
			new wg.style.Style({
				stroke: new wg.style.Stroke({
					color: 'rgba(0, 255, 255, 1)',
					width: 1,
				}),
			}),
		// 필지 선택
		areaSelect: () =>
			new wg.style.Style({
				fill: new wg.style.Fill({
					color: 'rgba(9, 156, 247, 0.8)',
					opacity: 0.8,
				}),
				stroke: new wg.style.Stroke({
					color: 'rgba(0, 255, 255, 1)',
					width: 1,
				}),
			}),
	}

	// 허가구역 관리 > 레이어 스타일
	const RESTRICT_AREA_STYLE = {
		sdw: () =>
			new wg.style.Style({
				stroke: new wg.style.Stroke({
					color: '#00ff00',
					width: 1,
				}),
				fill: new wg.style.Fill({
					color: '#00ff00',
					opacity: 0.8,
				}),
			}),
		landinfo: () =>
			new wg.style.Style({
				stroke: new wg.style.Stroke({
					color: '#00b050',
					width: 1,
				}),
				fill: new wg.style.Fill({
					color: '#00b050',
					opacity: 0.8,
				}),
			}),
	}

	const TREND_LAYER_STYLE = {
		sgg: function (feature, resolution) {
			const zoom = WGMap.getView().getZoom()
			if (zoom >= 12) {
				return new wg.style.Style({
					stroke: new wg.style.Stroke({
						color: '#ff0000',
						width: 1,
					}),
					text: new wg.style.Text({
						font: '9px Jeju Gothic',
						scale: 2,
						text: feature.get('SGG_NM'),
						fill: new wg.style.Fill({ color: '#ffffff' }),
						stroke: new wg.style.Stroke({ color: '#ff0000', width: 1 }),
					}),
				})
			} else {
				return new wg.style.Style({
					stroke: new wg.style.Stroke({
						color: '#ff0000',
						width: 1,
					}),
				}) // 줌 레벨이 15 초과일 경우 스타일 없음
			}
		},
		hjd: function (feature, resolution) {
			const zoom = WGMap.getView().getZoom()
			if (zoom >= 15) {
				return new wg.style.Style({
					stroke: new wg.style.Stroke({
						color: '#ff008e',
						width: 1,
					}),
					text: new wg.style.Text({
						font: '9px Jeju Gothic',
						scale: 2,
						text: feature.get('NAM'),
						fill: new wg.style.Fill({ color: '#ffffff' }),
						stroke: new wg.style.Stroke({ color: '#ff008e', width: 1 }),
					}),
				})
			} else {
				return new wg.style.Style({
					stroke: new wg.style.Stroke({
						color: '#ff008e',
						width: 1,
					}),
				}) // 줌 레벨이 15 초과일 경우 스타일 없음
			}
		},
		bjd: function (feature, resolution) {
			const zoom = WGMap.getView().getZoom()
			if (zoom >= 15) {
				return new wg.style.Style({
					stroke: new wg.style.Stroke({
						color: '#336600',
						width: 1,
					}),
					fill: new wg.style.Fill({
						color: 'rgba(102, 255, 51, 0.1)',
					}),
					text: new wg.style.Text({
						font: '9px Jeju Gothic',
						scale: 2,
						text: feature.get('EMD_NM'),
						fill: new wg.style.Fill({ color: '#ffffff' }),
						stroke: new wg.style.Stroke({ color: '#000000', width: 1 }),
					}),
				})
			} else {
				return new wg.style.Style({
					stroke: new wg.style.Stroke({
						color: '#336600',
						width: 1,
					}),
					fill: new wg.style.Fill({
						color: 'rgba(102, 255, 51, 0.1)',
					}),
				}) // 줌 레벨이 15 초과일 경우 스타일 없음
			}
		},
		cbnd: function (feature, resolution) {
			const zoom = WGMap.getView().getZoom()
			if (zoom >= 18) {
				return new wg.style.Style({
					stroke: new wg.style.Stroke({
						color: 'rgba(0, 0, 0, 0.4)',
						width: 1,
					}),
					fill: new wg.style.Fill({
						color: 'rgba(0, 0, 0, 0.1)',
					}),
					text: new wg.style.Text({
						font: '5px Jeju Gothic',
						scale: 2,
						text: feature.get('JIBUN'),
						fill: new wg.style.Fill({ color: '#ffffff' }),
						stroke: new wg.style.Stroke({ color: '#000000', width: 1 }),
					}),
				})
			} else {
				return new wg.style.Style({
					stroke: new wg.style.Stroke({
						color: 'rgba(0, 0, 0, 0.4)',
						width: 1,
					}),
					fill: new wg.style.Fill({
						color: 'rgba(0, 0, 0, 0.1)',
					}),
				}) // 줌 레벨이 15 초과일 경우 스타일 없음
			}
		},
	}

	const getStyle = () => STYLE
	const getSelectedStyle = () => SELECTED_STYLE
	const getUserRegionStyle = () => USER_REGION_STYLE
	const getRestrictAreaStyle = () => RESTRICT_AREA_STYLE
	const getTrendLayerStyle = () => TREND_LAYER_STYLE

	return {
		getStyle,
		getSelectedStyle,
		getUserRegionStyle,
		getRestrictAreaStyle,
		getTrendLayerStyle,
	}
}
