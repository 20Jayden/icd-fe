<template>
	<li :class="{ active: toolStore.activePinMarker }">
		<a @click="onActiveChange">메모</a>
	</li>
	<PinMarkPopup v-if="toolStore.activePinMarker" @close="onActiveChange()" />
</template>

<script>
import Draw from '@/composition/draw'
import { onMounted, watch } from 'vue'
import Modify from '@/composition/Modify'
import { useDrawStore } from '@/stores/draw'
import { useToolStore } from '@/stores/tool'
import PinMarkPopup from '@/components/popup/PinMarkPopup.vue'

export default {
	components: {
		PinMarkPopup,
	},
	props: {
		active: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['change-name'],
	setup(props, { emit }) {
		let textOverlay

		const drawStore = useDrawStore()
		const toolStore = useToolStore()

		onMounted(() => {
			// createUpdateTextOverlay()
		})

		watch(
			() => toolStore.activePinMarker,
			() => {
				if (toolStore.activePinMarker) {
					console.log('Pin 활성화')
					// drawText()
				} else {
					// if (textDraw) {
					// 	// textDraw.inactive()
					console.log('Pin 비활성화')
					// 	removeTextOverlay(textOverlay)
					// 	inactiveInteraction()
					// }
				}
			}
		)

		const onActiveChange = () => {
			if (!toolStore.activePinMarker) {
				toolStore.activePinMarker = true
			} else {
				toolStore.activePinMarker = false
			}
		}

		// overlay 이동
		const addEventHandler = () => {
			$(function () {
				$('.create-pinMarker-overlay').draggable({ containment: 'body', scroll: false, handle: '.head' })
			})
		}

		return { toolStore, onActiveChange }
	},
}
</script>

<style>
.create-pinMarker-overlay {
	display: flex;
	padding: 10px;
	position: absolute;
}
.create-pinMarker-overlay .content {
	width: 350px;
	background-color: #fff;
	border-right: 1px solid #c1c1c1;
	border-bottom: 1px solid #c1c1c1;
	box-shadow: rgba(0, 0, 0, 0.05) 5px 0px 10px;
	transition-duration: 250ms;
}
.create-pinMarker-overlay .content .head {
	height: 40px;
	padding: 0px 20px;
	background-color: #2c17ca;
	display: flex;
	align-items: center;
	color: white;
}
.create-pinMarker-overlay .content .head h3 {
	font-size: 1.188rem;
	font-weight: normal;
}
.create-pinMarker-overlay .content .head .btn-close {
	width: 44px;
	height: 44px;
	cursor: pointer;
	position: absolute;
	right: 10px;
	background-color: transparent;
	color: white;
}
.create-pinMarker-overlay .content .head .btn-close span {
	display: none;
}
.create-pinMarker-overlay .content .head .btn-close:before,
.create-pinMarker-overlay .content .head .btn-close:after {
	width: 20px;
	height: 2px;
	content: '';
	background-color: #fff;
	position: absolute;
	top: 18px;
	right: 9px;
	transform: rotate(-135deg);
}
.create-pinMarker-overlay.content .head .btn-close:before {
	transform: rotate(-135deg);
	-webkit-transform: rotate(-135deg);
	-moz-transform: rotate(-135deg);
	-o-transform: rotate(-135deg);
	-ms-transform: rotate(-135deg);
}
.create-pinMarker-overlay .content .head .btn-close:after {
	transform: rotate(135deg);
	-webkit-transform: rotate(135deg);
	-moz-transform: rotate(135deg);
	-o-transform: rotate(135deg);
	-ms-transform: rotate(135deg);
}
.create-pinMarker-overlay .content .body {
	padding: 10px 15px 10px 15px;
}
.create-pinMarker-overlay .content .body .title {
	margin-bottom: 10px;
}
.create-pinMarker-overlay .content .body .title input[type='text'] {
	width: 100%;
	height: 20px;
}
.create-pinMarker-overlay .content .body textarea {
	resize: auto;
	min-width: 320px;
	max-width: 320px;
	min-height: 150px;
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

.create-pinMarker-overlay span {
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

.select-pinMarker-overlay {
	display: flex;
	padding: 10px;
}
.select-pinMarker-overlay:before {
	/* margin-left: 0px;
	content: '';
	border-right: 18px solid #fff;
	border-top: 15px solid transparent;
	border-bottom: 15px solid transparent;
	display: inline-block;
	position: absolute;
	left: 0px;
	top: 18px; */

	/* margin-left: 0px;
	content: '';
	border-right: 15px solid transparent;
	border-top: 20px solid #fff;
	border-left: 15px solid transparent;
	display: inline-block;
	position: absolute;
	left: 40%;
	bottom: 0px; */

	content: '';
	position: absolute;
	border-style: solid;
	border-width: 20px 17.5px 0px 17.5px;
	border-color: #2c17ca transparent;
	display: block;
	width: 0;
	z-index: 0;
	left: 40%;
	bottom: -1px;
}
.select-pinMarker-overlay:after {
	/* margin-left: 0px;
	content: '';
	border: 1px solid #1778cc;
	border-right: 15px solid transparent;
	border-top: 20px solid #1778cc;
	border-left: 15px solid transparent;
	display: inline-block;
	position: absolute;
	left: 40%;
	bottom: 0px; */
	content: '';
	position: absolute;
	border-style: solid;
	border-width: 20px 17.5px 0px 17.5px;
	border-color: #ffffff transparent;
	display: block;
	width: 0;
	z-index: 1;
	left: 40%;
	bottom: 0px;
}

.select-pinMarker-overlay .content {
	z-index: 1;
	width: 100%;
	max-width: 150px;
	border-radius: 10px;
	background-color: #fff;
	color: #000;
	border: 1px solid #2c17ca;
	/* border-right: 1px solid #c1c1c1;
	border-bottom: 1px solid #c1c1c1; */
	box-shadow: rgba(0, 0, 0, 0.05) 5px 0px 10px;
	transition-duration: 250ms;
}
.select-pinMarker-overlay .content h3 {
	font-size: 1.188rem;
	font-weight: normal;
}
.select-pinMarker-overlay .content .btn-close {
	width: 44px;
	height: 44px;
	cursor: pointer;
	position: absolute;
	right: 10px;
	background-color: transparent;
	color: black;
}
.select-pinMarker-overlay .content .btn-close span {
	display: none;
}
.select-pinMarker-overlay .content .btn-close:before,
.select-pinMarker-overlay .content .btn-close:after {
	width: 20px;
	height: 2px;
	content: '';
	background-color: black;
	position: absolute;
	top: 18px;
	right: 9px;
	transform: rotate(-135deg);
}
.select-pinMarker-overlay.content .btn-close:before {
	transform: rotate(-135deg);
	-webkit-transform: rotate(-135deg);
	-moz-transform: rotate(-135deg);
	-o-transform: rotate(-135deg);
	-ms-transform: rotate(-135deg);
}
.select-pinMarker-overlay .content .btn-close:after {
	transform: rotate(135deg);
	-webkit-transform: rotate(135deg);
	-moz-transform: rotate(135deg);
	-o-transform: rotate(135deg);
	-ms-transform: rotate(135deg);
}
.select-pinMarker-overlay .content .body {
	padding: 10px 20px 10px 20px;
	word-break: break-all;
	width: 100px;
}
.select-pinMarker-overlay .content .body .title {
	margin-bottom: 10px;
}
.select-pinMarker-overlay .content .body .title input[type='text'] {
	width: 100%;
	height: 20px;
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

.select-pinMarker-overlay span {
	display: none;
}
</style>
