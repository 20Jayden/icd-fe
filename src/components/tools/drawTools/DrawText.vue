<template>
	<li :class="{ active: toolStore.activeName === 'Text' }">
		<a @click="onActiveChange">문자</a>
	</li>
</template>

<script>
import Draw from '@/composition/draw'
import { onMounted, watch } from 'vue'
import Modify from '@/composition/Modify'
import { useDrawStore } from '@/stores/draw'
import { useToolStore } from '@/stores/tool'

export default {
	props: {
		active: {
			type: Boolean,
			default: false,
		},
		activeName: {
			type: String,
			default: '',
		},
	},
	emits: ['change-name'],
	setup(props, { emit }) {
		let textDraw
		let textOverlay
		let modifyInteraction
		let drawFeature

		const drawStore = useDrawStore()
		const toolStore = useToolStore()

		onMounted(() => {
			createUpdateTextOverlay()
		})

		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName === 'Text') {
					console.log('Text 활성화')
					drawText()
				} else {
					if (textDraw) {
						textDraw.inactive()
						console.log('Text 비활성화')
						removeTextOverlay(textOverlay)
						inactiveInteraction()
					}
				}
			}
		)

		const onActiveChange = () => {
			if (toolStore.activeName != 'Text') {
				toolStore.activeName = 'Text'
			} else {
				toolStore.activeName = ''
			}
		}

		// 오버레이 생성
		const createTextOverlay = (feature) => {
			const coordinates = feature.getGeometry().getCoordinates()
			// 오버레이 위치 고정
			document.getElementById('drawTextOverlay').style.top = '0px'
			document.getElementById('drawTextOverlay').style.left = '0px'

			WGMap.getOverlayById('drawTextOverlay').setPosition(coordinates)
		}

		const createUpdateTextOverlay = () => {
			if (!WGMap.getOverlayById('drawTextOverlay')) {
				let textOverlayElement = document.createElement('div')
				textOverlayElement.innerHTML = `<div class="text-overlay" id="drawTextOverlay">
						<div class="content">
							<div class="head">
								<div class="tit">문자</div>
								<a id="btn-close" class="btn-close"><span>닫기</span></a>
							</div>
							<div class="body">
								<p>텍스트 입력</p><br>
								<input id="textDrawInput" type="text">
								<div class="buttonGroup" style="margin: 10px; margin-left: 40px;">
									<input id="textDrawBtn" type="button"  value="입력">
									<input id="textDelBtn" type="button" value="삭제">
								</div>
							</div>
						</div>
					</div>`

				textOverlay = new wg.Overlay({
					id: 'drawTextOverlay',
					element: textOverlayElement,
					positioning: 'bottom-center',
					autopPan: true,
					autoPanAnimation: {
						duration: 250,
					},
					target: undefined, // 오버레이의 target feature
				})

				WGMap.addOverlay(textOverlay)
			}
			// popup 이동
			addEventHandler()
			activeInteractions()
		}

		// 오버레이 제거
		const removeTextOverlay = () => {
			if (textOverlay) {
				WGMap.removeOverlay(textOverlay)
				textOverlay.setPosition(undefined)
				textOverlay = null
			}
		}

		// 인터렉션 비활성화
		const inactiveInteraction = () => {
			if (modifyInteraction) {
				modifyInteraction.inactive()
			}
		}

		// 인터렉션 활성
		const activeInteractions = () => {
			if (textDraw) {
				textDraw.active()
				modifyInteraction.active()
			}
		}

		const drawText = () => {
			const drawLayer = WGMap.getLayerById('drawLayer')
			const drawSource = drawLayer.getSource()
			modifyInteraction = new Modify({ source: drawSource })

			textDraw = new Draw({
				source: drawSource,
				type: 'Point',
				styleName: 'text',
				name: 'text',
				style: drawStyle,
			})

			textDraw.on('drawend', (event) => {
				drawFeature = event.feature

				if (textDrawInput.value == '') {
					let target = WGMap.getOverlayById('drawTextOverlay').get('target')
					drawLayer.getSource().removeFeature(target)
				}

				textDrawInput.value = ''
				createTextOverlay(drawFeature)
				textOverlay.set('target', drawFeature)

				// 지도 위에 point 찍을 때 모양이 'Text'가 될 수 있도록 하는 방법
				const textStyle = new wg.style.Style({
					text: new wg.style.Text({
						text: 'text',
						font: 'bold 15px serif',
						fill: new wg.style.Fill({
							color: '#FF0000',
						}),
						stroke: new wg.style.Stroke({
							color: '#FFE4C4',
							width: 3,
						}),
					}),
				})

				drawFeature.setStyle(textStyle)
			})

			createUpdateTextOverlay()

			// 입력 버튼
			const textDrawBtn = document.getElementById('textDrawBtn')
			const textDrawInput = document.getElementById('textDrawInput')

			textDrawBtn.addEventListener('click', () => {
				let textInput = textDrawInput.value
				let target = WGMap.getOverlayById('drawTextOverlay').get('target')
				if (target !== undefined) {
					target.set('name', textInput)
					let textPointStyle = target.getStyle()
					console.log('target textInput', textInput)
					textPointStyle.getText().setText(textInput)
				}
				// textDrawInput.value = ''
				drawStore.setViewState({
					textValue: textInput,
				})
			})

			// 삭제 버튼
			const textDelBtn = document.querySelector('#textDelBtn')
			textDelBtn.addEventListener('click', () => {
				let target = WGMap.getOverlayById('drawTextOverlay').get('target')
				console.log('target', target)
				if (target !== undefined) {
					drawLayer.getSource().removeFeature(target)
					textOverlay.setPosition(undefined)
				}
			})

			// 닫기 버튼
			const closer = document.getElementById('btn-close')
			closer.addEventListener('click', () => {
				const textInput = textDrawInput.value
				const target = WGMap.getOverlayById('drawTextOverlay').get('target')
				// textInput에 입력한 text가 없을 경우 feature & overlay 삭제
				if (textInput === '') {
					if (target !== undefined) {
						drawLayer.getSource().removeFeature(target)
					}
				}
				WGMap.getOverlayById('drawTextOverlay').setPosition(undefined)
			})
		}
		const drawStyle = new wg.style.Style({
			image: new wg.style.Circle({
				radius: 5,
				fill: new wg.style.Fill({
					color: 'white',
				}),
				stroke: new wg.style.Stroke({
					color: '#ff008e',
					width: 2,
				}),
			}),
		})
		// overlay 이동
		const addEventHandler = () => {
			$(function () {
				$('.text-overlay').draggable({ containment: 'body', scroll: false, handle: '.head' })
			})
		}

		return { toolStore, onActiveChange, drawStyle }
	},
}
</script>

<style>
.text-overlay {
	display: flex;
	padding: 10px;
}
.text-overlay .content {
	width: 250px;
	background-color: #fff;
	border-right: 1px solid #c1c1c1;
	border-bottom: 1px solid #c1c1c1;
	box-shadow: rgba(0, 0, 0, 0.05) 5px 0px 10px;
	transition-duration: 250ms;
}
.text-overlay .content .head {
	height: 50px;
	padding: 0px 20px;
	background-color: #2c17ca;
	display: flex;
	align-items: center;
	color: white;
}
.text-overlay .content .head h3 {
	font-size: 1.188rem;
	font-weight: normal;
}
.text-overlay .content .head .btn-close {
	width: 44px;
	height: 44px;
	cursor: pointer;
	position: absolute;
	right: 10px;
	background-color: transparent;
	color: white;
}
.text-overlay .content .head .btn-close span {
	display: none;
}
.text-overlay .content .head .btn-close:before,
.text-overlay .content .head .btn-close:after {
	width: 20px;
	height: 2px;
	content: '';
	background-color: #fff;
	position: absolute;
	top: 18px;
	right: 9px;
	transform: rotate(-135deg);
}
.text-overlay.content .head .btn-close:before {
	transform: rotate(-135deg);
	-webkit-transform: rotate(-135deg);
	-moz-transform: rotate(-135deg);
	-o-transform: rotate(-135deg);
	-ms-transform: rotate(-135deg);
}
.text-overlay .content .head .btn-close:after {
	transform: rotate(135deg);
	-webkit-transform: rotate(135deg);
	-moz-transform: rotate(135deg);
	-o-transform: rotate(135deg);
	-ms-transform: rotate(135deg);
}
.text-overlay .content .body {
	padding: 30px 30px 30px 23px;
}
.btn-change {
	width: 18px;
	height: 18px;
	margin-right: 7px;
	background-color: #1778cc;
	border: 1px solid #606060;
	border-radius: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.btn-change:hover {
	background-color: #1466ae;
	border-color: #606060;
}

.text-overlay span {
	display: none;
}

#textDrawInput {
	width: 200px;
	margin: 10px 0;
	padding: 0;
	background-color: #fff;
	border: 2px solid #6e41de;
	border-radius: 7px;
	height: 25px;
}

#textDrawBtn {
	background-color: #1778cc;
	border-color: #606060;
	padding: 6px 15px;
	border: 1px solid;
	box-sizing: border-box;
	color: #fff;
	border-radius: 5px;
	font-size: 0.875rem;
	text-align: center;
	font-weight: normal;
	line-height: 1.4;
	display: inline-block;
	cursor: pointer;
}

#textDelBtn {
	background-color: #8b8888;
	border-color: #606060;
	padding: 6px 15px;
	border: 1px solid;
	box-sizing: border-box;
	color: #fff;
	border-radius: 5px;
	font-size: 0.875rem;
	text-align: center;
	font-weight: normal;
	line-height: 1.4;
	display: inline-block;
	cursor: pointer;
}

.head {
	cursor: move;
}
</style>
