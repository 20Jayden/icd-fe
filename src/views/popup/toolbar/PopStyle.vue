<template>
	<div id="drawStyle" class="popup style-edit" tabindex="-1" role="dialog" data-backdrop="false">
		<div class="head">
			<div class="tit">스타일변경</div>
			<a class="btn-close" @click="closePopup"><span>닫기</span></a>
		</div>
		<div class="body">
			<br />
			<strong class="h5 text-center disp-block">그려진 도형을 선택하세요.</strong>
			<p class="text-center mb-20">클릭 : 단일선택<br />shift+클릭 : 추가선택<br />ctrl+드래그 : Box선택</p>
			<div class="action-btn-group">
				<div class="btn-group center">
					<div class="btn-items">
						<button
							:class="{ active: activeTab === 'point' }"
							@click="activeTab = 'point'"
							class="btn btn-dark"
							style="border-top-left-radius: 6px; border-bottom-left-radius: 6px"
						>
							점</button
						><span id="point-badge" class="badge" style="z-index: 999"><span>0</span></span>
					</div>
					<div class="btn-items">
						<button
							:class="{ active: activeTab === 'linestring' }"
							@click="activeTab = 'linestring'"
							class="btn btn-dark"
						>
							선</button
						><span id="linestring-badge" class="badge" style="z-index: 999"><span>0</span></span>
					</div>
					<div class="btn-items">
						<button :class="{ active: activeTab === 'polygon' }" @click="activeTab = 'polygon'" class="btn btn-dark">
							면</button
						><span id="polygon-badge" class="badge" style="z-index: 999"><span>0</span></span>
					</div>
					<div class="btn-items">
						<button :class="{ active: activeTab === 'circle' }" @click="activeTab = 'circle'" class="btn btn-dark">
							원</button
						><span id="circle-badge" class="badge" style="z-index: 999"><span>0</span></span>
					</div>
					<div class="btn-items" style="border-top-right-radius: 10px">
						<button
							:class="{ active: activeTab === 'text' }"
							@click="activeTab = 'text'"
							class="btn btn-dark"
							style="border-top-right-radius: 6px; border-bottom-right-radius: 6px"
						>
							문자</button
						><span id="text-badge" class="badge" style="z-index: 999"><span>0</span></span>
					</div>
				</div>
			</div>
			<br />
			<div class="tab-content">
				<div id="style-tab1" class="tab-pane" v-show="activeTab === 'point'">
					<table id="tbl-point">
						<tbody>
							<colgroup>
								<col style="width: 100px" />
								<col style="width: auto" />
							</colgroup>
							<tr>
								<td>테두리색상:</td>
								<td>
									<input type="color" name="styleInput" id="point-stroke-color" value="#ff0000" />
								</td>
							</tr>
							<tr>
								<td>배경색상:</td>
								<td>
									<input type="color" name="styleInput" id="point-fill-color" value="#ff0000" />
									<input
										type="range"
										name="styleInput"
										id="point-fill-opacity"
										min="0"
										max="100"
										step="10"
										value="100"
									/>
								</td>
							</tr>
							<tr>
								<td>크기</td>
								<td>
									<input
										type="number"
										name="styleInput"
										id="point-radius"
										style="width: 80px"
										min="0"
										max="10"
										value="5"
									/>
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="2">
									<div class="preview transparent">
										<div id="preview-point" class="circle"></div>
									</div>
								</td>
							</tr>
							<tr>
								<td colspan="2" class="btnArea">
									<input
										type="button"
										id="btnSaveStyle"
										name="btnSaveStyle"
										value="스타일저장"
										@click="onSaveStyleClick('point')"
									/>
									<input
										type="button"
										id="btnDelete"
										name="btnDelete"
										value="도형삭제"
										@click="onDeleteClick('point')"
									/>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
				<div id="style-tab2" class="tab-pane" v-show="activeTab === 'linestring'">
					<table id="tbl-linestring">
						<tbody>
							<colgroup>
								<col style="width: 100px" />
								<col style="width: auto" />
							</colgroup>
							<tr>
								<td>선색상:</td>
								<td>
									<input type="color" name="styleInput" id="linestring-stroke-color" value="#ff0000" />
								</td>
							</tr>
							<tr>
								<td>선굵기</td>
								<td>
									<input
										type="number"
										name="styleInput"
										id="linestring-stroke-width"
										style="width: 80px"
										min="1"
										max="10"
										value="2"
									/>
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="2">
									<div class="preview">
										<div id="preview-linestring" class="linestring"></div>
									</div>
								</td>
							</tr>
							<tr>
								<td colspan="2" class="btnArea">
									<input
										type="button"
										id="btnSaveStyle"
										name="btnSaveStyle"
										value="스타일저장"
										@click="onSaveStyleClick('linestring')"
										disabled
									/>
									<input
										type="button"
										id="btnDelete"
										name="btnDelete"
										value="도형삭제"
										@click="onDeleteClick('linestring')"
										disabled
									/>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>

				<div id="style-tab3" class="tab-pane" v-show="activeTab === 'polygon'">
					<table id="tbl-polygon">
						<tbody>
							<colgroup>
								<col style="width: 100px" />
								<col style="width: auto" />
							</colgroup>
							<tr>
								<td>테두리색상:</td>
								<td>
									<input type="color" name="styleInput" id="polygon-stroke-color" value="#ff0000" />
								</td>
							</tr>
							<tr>
								<td>배경색상:</td>
								<td>
									<input type="color" name="styleInput" id="polygon-fill-color" value="#ff0000" />
									<input
										type="range"
										name="styleInput"
										id="polygon-fill-opacity"
										min="0"
										max="100"
										step="10"
										value="20"
									/>
								</td>
							</tr>
							<tr>
								<td>선굵기</td>
								<td>
									<input
										type="number"
										name="styleInput"
										id="polygon-stroke-width"
										style="width: 80px"
										min="1"
										max="10"
										value="2"
									/>
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="2">
									<div class="preview transparent">
										<div id="preview-polygon" class="polygon"></div>
									</div>
								</td>
							</tr>
							<tr>
								<td colspan="2" class="btnArea">
									<input
										type="button"
										id="btnSaveStyle"
										name="btnSaveStyle"
										value="스타일저장"
										@click="onSaveStyleClick('polygon')"
										disabled
									/>
									<input
										type="button"
										id="btnDelete"
										name="btnDelete"
										value="도형삭제"
										@click="onDeleteClick('polygon')"
										disabled
									/>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>

				<div id="style-tab5" class="tab-pane" v-show="activeTab === 'circle'">
					<table id="tbl-circle">
						<tbody>
							<colgroup>
								<col style="width: 100px" />
								<col style="width: auto" />
							</colgroup>
							<tr>
								<td>테두리색상:</td>
								<td>
									<input type="color" name="styleInput" id="circle-stroke-color" value="#ff0000" />
								</td>
							</tr>
							<tr>
								<td>배경색상:</td>
								<td>
									<input type="color" name="styleInput" id="circle-fill-color" value="#ff0000" />
									<input
										type="range"
										name="styleInput"
										id="circle-fill-opacity"
										min="0"
										max="100"
										step="10"
										value="20"
									/>
								</td>
							</tr>
							<tr>
								<td>선굵기</td>
								<td>
									<input
										type="number"
										name="styleInput"
										id="circle-stroke-width"
										style="width: 80px"
										min="1"
										max="10"
										value="2"
									/>
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="2">
									<div class="preview transparent">
										<div id="preview-circle" class="polygon"></div>
									</div>
								</td>
							</tr>
							<tr>
								<td colspan="2" class="btnArea">
									<input
										type="button"
										id="btnSaveStyle"
										name="btnSaveStyle"
										value="스타일저장"
										@click="onSaveStyleClick('circle')"
										disabled
									/>
									<input
										type="button"
										id="btnDelete"
										name="btnDelete"
										value="도형삭제"
										@click="onDeleteClick('circle')"
										disabled
									/>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>

				<div id="style-tab4" class="tab-pane" v-show="activeTab === 'text'">
					<table id="tbl-text">
						<tbody>
							<colgroup>
								<col style="width: 100px" />
								<col style="width: auto" />
							</colgroup>
							<tr>
								<td>문자크기:</td>
								<td>
									<input
										type="number"
										name="styleInput"
										id="text-size"
										style="width: 80px"
										min="5"
										max="35"
										value="14"
									/>
								</td>
							</tr>
							<tr>
								<td>폰트:</td>
								<td>
									<select id="text-font" name="styleInput">
										<option value="sans-serif">sans-serif</option>
										<option value="monospace">monospace</option>
										<option value="cursive">cursive</option>
										<option value="fantasy">fantasy</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>문자색상:</td>
								<td>
									<input type="color" name="styleInput" id="text-fill-color" value="#ff0000" />
								</td>
							</tr>
							<tr>
								<td>테두리색상:</td>
								<td>
									<input type="color" name="styleInput" id="text-stroke-color" value="#ffffff" />
								</td>
							</tr>
							<tr>
								<td>테두리굵기:</td>
								<td>
									<input
										type="number"
										name="styleInput"
										id="text-stroke-width"
										style="width: 80px"
										min="1"
										max="10"
										value="3"
									/>
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="2">
									<div class="preview">
										<div id="preview-text" class="text">123ABC가나다</div>
									</div>
								</td>
							</tr>
							<tr>
								<td colspan="2" class="btnArea">
									<input
										type="button"
										id="btnSaveStyle"
										name="btnSaveStyle"
										value="스타일저장"
										@click="onSaveStyleClick('text')"
										disabled
									/>
									<input
										type="button"
										id="btnDelete"
										name="btnDelete"
										value="도형삭제"
										@click="onDeleteClick('text')"
										disabled
									/>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useDrawStore } from '@/stores/draw'

export default {
	props: {},
	emits: ['change-name', 'close'],
	setup(props, { emit }) {
		const drawStore = useDrawStore()
		const activeTab = ref('point')

		const onSaveStyleClick = (type) => {
			// console.log('스타일 저장')
			drawStore.selectInteraction.styleSaveCallback(createStyle(type))
		}

		const onDeleteClick = (type) => {
			console.log('도형 삭제', type)
			drawStore.selectInteraction.deleteCallback(type)
		}

		const createStyle = (type) => {
			const getStyle = (type) => {
				const fill = document.getElementById(`${type}-fill-color`)?.value || '#000000'
				const [r, g, b] = hexToRgb(fill)
				const opacity = Number(document.getElementById(`${type}-fill-opacity`)?.value || 0) / 100
				return {
					'point': new wg.style.Style({
						image: new wg.style.Circle({
							radius: document.getElementById(`point-radius`).value,
							fill: new wg.style.Fill({
								color: `rgba(${r}, ${g}, ${b}, ${opacity})`,
							}),
							stroke: new wg.style.Stroke({
								color: document.getElementById(`point-stroke-color`).value,
								width: 2,
							}),
						}),
					}),
					'linestring': new wg.style.Style({
						stroke: new wg.style.Stroke({
							color: document.getElementById(`linestring-stroke-color`).value,
							width: document.getElementById(`linestring-stroke-width`).value,
						}),
					}),
					'polygon': new wg.style.Style({
						fill: new wg.style.Fill({
							color: `rgba(${r}, ${g}, ${b}, ${opacity})`,
						}),
						stroke: new wg.style.Stroke({
							color: document.getElementById(`polygon-stroke-color`).value,
							width: document.getElementById(`polygon-stroke-width`).value,
						}),
					}),
					'text': new wg.style.Style({
						text: new wg.style.Text({
							font: document.getElementById(`text-size`).value + 'px ' + document.getElementById(`text-font`).value,
							text: drawStore.textValue,
							placement: 'Point',
							fill: new wg.style.Fill({
								color: document.getElementById(`text-fill-color`).value,
							}),
							stroke: new wg.style.Stroke({
								color: document.getElementById(`text-stroke-color`).value,
								width: 0, //Number($(`#stylePopup #${type}-stroke-width`).val()),
							}),
						}),
					}),
					'circle': new wg.style.Style({
						// circle 스타일 생성 코드
						fill: new wg.style.Fill({
							color: `rgba(${r}, ${g}, ${b}, ${opacity})`,
						}),
						stroke: new wg.style.Stroke({
							color: document.getElementById(`circle-stroke-color`).value,
							width: document.getElementById(`circle-stroke-width`).value,
						}),
					}),
				}[type]
			}

			const activeTabStyle = getStyle(type)
			// return activeTabStyle
			return {
				type,
				style: activeTabStyle,
			}
		}

		const hexToRgb = (hex) =>
			hex
				.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
				.substring(1)
				.match(/.{2}/g)
				.map((x) => parseInt(x, 16))

		onMounted(() => {
			const styleInputs = document.querySelectorAll('[name=styleInput]')

			styleInputs.forEach((input) => {
				// console.log('input', input)
				input.addEventListener('change', (event) => {
					const [activeTab, inputType] = event.target.id.split('-')
					console.log(activeTab)
					console.log(inputType)

					if (activeTab === 'point') {
						const stroke = document.getElementById('point-stroke-color')
						const fill = document.getElementById('point-fill-color')
						const opacity = document.getElementById('point-fill-opacity')
						const radius = document.getElementById('point-radius')

						const preview = document.getElementById('preview-point')

						const [r, g, b] = hexToRgb(fill.value)

						preview.style['border'] = `2px solid ${stroke.value}`
						preview.style['background-color'] = `rgba(${r}, ${g}, ${b}, ${Number(opacity.value) / 100})`
						preview.style['width'] = Math.floor(Number(radius.value) * 2.4) + 'px'
						preview.style['height'] = Math.floor(Number(radius.value) * 2.4) + 'px'
						console.log(preview)
					} else if (activeTab === 'linestring') {
						const stroke = document.getElementById('linestring-stroke-color')
						const width = document.getElementById('linestring-stroke-width')

						const preview = document.getElementById('preview-linestring')

						preview.style['border-bottom'] = `${Number(width.value) + 1}px solid ${stroke.value}`
						console.log(preview)
					} else if (activeTab === 'polygon') {
						const stroke = document.getElementById('polygon-stroke-color')
						const fill = document.getElementById('polygon-fill-color')
						const width = document.getElementById('polygon-stroke-width')
						const opacity = document.getElementById('polygon-fill-opacity')

						const preview = document.getElementById('preview-polygon')

						const [r, g, b] = hexToRgb(fill.value)
						preview.style['border'] = `${width.value}px solid ${stroke.value}`
						preview.style['background-color'] = `rgba(${r}, ${g}, ${b}, ${Number(opacity.value) / 100})`
					} else if (activeTab === 'text') {
						const size = document.getElementById('text-size')
						const font = document.getElementById('text-font')
						const fill = document.getElementById('text-fill-color')
						const stroke = document.getElementById('text-stroke-color')
						const width = document.getElementById('text-stroke-width')

						const preview = document.getElementById('preview-text')

						preview.style['font'] = `bold ${size.value}px ${font.value}`
						preview.style['color'] = fill.value
						preview.style['-webkit-text-stroke'] = `${Number(width.value) * 0.6}px ${stroke.value}`
					} else if (activeTab === 'circle') {
						const stroke = document.getElementById('circle-stroke-color')
						const fill = document.getElementById('circle-fill-color')
						const width = document.getElementById('circle-stroke-width')
						const opacity = document.getElementById('circle-fill-opacity')

						const preview = document.getElementById('preview-circle')

						const [r, g, b] = hexToRgb(fill.value)
						preview.style['border'] = `${width.value}px solid ${stroke.value}`
						preview.style['background-color'] = `rgba(${r}, ${g}, ${b}, ${Number(opacity.value) / 100})`
					}
				})
			})
			addEventHandler()
		})

		const closePopup = () => {
			emit('close') // 부모 컴포넌트로 팝업 닫힘을 알리는 이벤트 전달
		}

		// 팝업 이동
		const addEventHandler = () => {
			$(function () {
				$('#drawStyle').draggable({ containment: 'body', scroll: false, handle: '.head' })
			})
		}

		return { onSaveStyleClick, onDeleteClick, closePopup, activeTab }
	},
}
</script>

<style scoped>
.btn-dark {
	border-radius: 0px;
}
.popup {
	left: 45%;
	top: 25%;
	width: 350px;
	height: 530px;
	background-color: #fff;
	box-shadow: rgba(0, 0, 0, 0.2) 5px 5px 10px;
	position: absolute;
}
.head {
	padding: 13px 20px;
	background-color: #2c17ca;
	display: flex;
	position: relative;
	cursor: move;
}
.head .tit {
	margin-right: auto;
	color: #fff;
	font-size: 1rem;
}
.head .btn-close {
	width: 46px;
	height: 46px;
	cursor: pointer;
	display: inline-block;
	position: absolute;
	top: 0;
	right: 0;
}
.head .btn-close span {
	display: none;
}
.head .btn-close:before,
.head .btn-close:after {
	width: 20px;
	height: 2px;
	content: '';
	background-color: #fff;
	position: absolute;
	top: 22px;
	right: 12px;
}
.head .btn-close:before {
	transform: rotate(-135deg);
	-webkit-transform: rotate(-135deg);
	-moz-transform: rotate(-135deg);
	-o-transform: rotate(-135deg);
	-ms-transform: rotate(-135deg);
}
.head .btn-close:after {
	transform: rotate(135deg);
	-webkit-transform: rotate(135deg);
	-moz-transform: rotate(135deg);
	-o-transform: rotate(135deg);
	-ms-transform: rotate(135deg);
}

/* body */
.body {
	min-height: 100px;
	padding: 20px;
	background-color: #fff;
}

/* preview */
.preview {
	text-align: center;
	margin-top: 10px;
	height: 30px;
	line-height: 30px;
	position: relative;
}

.popup .preview.transparent {
	background: url(/assets/images/transparent_bg.jpg) no-repeat !important;
}

.popup .preview .circle {
	height: 12px;
	width: 12px;
	border: 1px solid red;
	background-color: red;
	border-radius: 50%;
	display: inline-block;
	vertical-align: middle;
}

.popup .preview .linestring {
	width: 100px;
	height: 5px;
	border-bottom: 3px solid red;
	display: inline-block;
	vertical-align: middle;
}

.popup .preview .polygon {
	height: 22px;
	width: 60px;
	border: 2px solid red;
	background-color: rgba(255, 0, 0, 0.2);
	/* border-radius: 50%; */
	display: inline-block;
	vertical-align: middle;
}

.popup .preview .text {
	width: 150px;
	display: inline-block;
	vertical-align: middle;
	color: red;
	-webkit-text-stroke: 0.7px white;
	font: bold 14px sans-serif;
	/* text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white; */
}

.popup .tab-content {
	margin-left: 20px;
}
.badge {
	display: none;
	text-align: center;
	background: #d55133;
	position: absolute;
	color: white;
	font-size: 10px;
	font-weight: 600;
	border-radius: 50%;
	height: 20px;
	margin: -10px 0px 0px -15px;
	padding: 5px 6px;
}
.badge span {
	flex: 1;
	text-align: center;
	overflow: hidden;
	white-space: nowrap;
	top: 3px;
	left: 6px;
}

a {
	cursor: pointer;
}

.popup .action-btn-group .btn {
	height: 28px;
	padding: 1px 15px 0 15px;
}

#btnSaveStyle {
	margin-top: 20px;
	margin-left: 40px;
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

#btnDelete {
	margin-top: 20px;
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
</style>
