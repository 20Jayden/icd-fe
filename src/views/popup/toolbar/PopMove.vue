<template>
	<div
		v-show="isOverlay"
		id="tool-move"
		class="layer-popup show ui-draggable-handle"
		tabindex="-1"
		role="dialog"
		data-backdrop="false"
		style="width: 400px"
	>
		<button
			type="button"
			class="close"
			data-dismiss="modal"
			aria-label="Close"
			@click="closeOverlay()"
			style="float: right"
		></button>
		<div class="modal-header">
			<div class="tit">이동하기</div>
		</div>
		<div class="modal-body">
			<div class="summary">
				<div class="row">
					<div class="col-md-6">
						<table style="margin-left: auto; margin-right: auto">
							<tr style="text-align: center">
								<td>
									<label class="col-form-label pt-0">위도</label>
									<input
										ref="inputLat"
										:value="tofixedViewState.lat"
										type="text"
										title="위도 입력"
										class="form-control"
									/>
								</td>
								<td>
									<label class="col-form-label pt-0">경도</label>
									<input
										ref="inputLon"
										:value="tofixedViewState.lon"
										type="text"
										title="경도 입력"
										class="form-control"
									/>
								</td>
							</tr>
						</table>
					</div>
					<!-- <div class="col-md-6"> -->
					<!-- </div> -->
				</div>
			</div>
			<div class="modal-body" style="margin-left: -20px !important">
				<div class="action-btn-group">
					<div class="center">
						<button type="button" class="btn btn-primary" @click="coordMove()">이동하기</button>
						<button type="button" class="btn btn-light" data-dismiss="modal" aria-label="Close" @click="closeOverlay()">
							닫기
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// basic
import { ref, computed, onMounted } from 'vue'
// stores
import { useViewStore } from '@/stores/view'
import { useModalStore } from '@/stores/modal'

export default {
	emits: ['move-pop'],
	setup(props, { emit }) {
		const viewStore = useViewStore()
		const modalStore = useModalStore()

		const inputLat = ref(null)
		const inputLon = ref(null)
		const isOverlay = ref(true)

		onMounted(() => {
			addEventHandler()
		})

		const tofixedViewState = computed(() => {
			return {
				lon: viewStore.lon ? viewStore.lon.toFixed(6) : '',
				lat: viewStore.lat ? viewStore.lat.toFixed(6) : '',
				alt: viewStore.alt ? viewStore.alt.toFixed(0) : '',
			}
		})
		const coordMove = () => {
			// lat은 36도 이상 37도 이하로 설정해야 함
			if (parseFloat(inputLat.value.value) < 36 || parseFloat(inputLat.value.value) >= 38) {
				modalStore.showAlert(
					'서울지역을 벗어난 위경도 좌표를 입력할 수 없습니다.\n위도는 36도 이상 37도 이하로 설정해야 합니다.'
				)
				return
			}
			// lon은 126도 이상 128도 이하로 설정해야 함
			if (parseFloat(inputLon.value.value) < 126 || parseFloat(inputLon.value.value) >= 129) {
				modalStore.showAlert(
					'서울지역을 벗어난 위경도 좌표를 입력할 수 없습니다.\n경도는 126도 이상 128도 이하로 설정해야 합니다.'
				)
				return
			}
			viewStore.setViewState({
				lon: parseFloat(inputLon.value.value),
				lat: parseFloat(inputLat.value.value),
			})

			WGMap.getView().setCenter(wg.proj.fromLonLat([inputLon.value.value, inputLat.value.value]))
		}

		const closeOverlay = () => {
			isOverlay.value = false
			emit('move-pop', '')
		}

		// 팝업 이동
		const addEventHandler = () => {
			$(function () {
				$('#tool-move').draggable({ containment: 'body', scroll: false, handle: '.modal-header' })
			})
		}

		return {
			viewStore,
			inputLon,
			inputLat,
			tofixedViewState,
			isOverlay,
			coordMove,
			closeOverlay,
		}
	},
}
</script>

<style scoped>
button:focus-visible {
	outline: 3px solid #000;
}
button:focus:not(:focus-visible) {
	outline: none;
	box-shadow: 1px 1px 5px rgba(1, 1, 0, 0.7);
}
.close {
	position: relative;
	width: 44px;
	height: 44px;
	cursor: pointer;
	background-color: transparent;
	border: none;
}
.close::before {
	width: 20px;
	height: 2px;
	content: '';
	background-color: #fff;
	position: absolute;
	top: 22px;
	right: 12px;
	transform: rotate(-135deg);
	-webkit-transform: rotate(-135deg);
	-moz-transform: rotate(-135deg);
	-o-transform: rotate(-135deg);
	-ms-transform: rotate(-135deg);
}
.close::after {
	width: 20px;
	height: 2px;
	content: '';
	background-color: #fff;
	position: absolute;
	top: 22px;
	right: 12px;
	transform: rotate(135deg);
	-webkit-transform: rotate(135deg);
	-moz-transform: rotate(135deg);
	-o-transform: rotate(135deg);
	-ms-transform: rotate(135deg);
}
.col-form-label {
	color: black;
}
.show {
	background-color: #2c17ca;
	/* background-color: black; */
	color: white;
	height: 70px !important;
}
.modal-header {
	padding: 13px 20px;
	background-color: #2c17ca;
	/* display: flex; */
	width: 380px;
	/* position: relative; */
	padding: 13px 20px;
	cursor: move;
}
.modal-title {
	margin-right: auto;
	color: #fff;
	font-size: 1.4rem;
	margin-top: 2px;
}
.modal-body {
	background-color: white;
	padding: 20px;
	width: 410px;
	height: 30px;
	margin-right: 10px;
	margin-top: -12px;
}

.layer-popup {
	left: 711px;
	top: 346px;
	width: 500px;
}
.btn-light {
	background-color: white;
}
.btn-primary {
	background-color: #1466ae;
	border-color: #606060;
}
</style>
