<template>
	<!-- :class="{ 'tool-print': popupStore.printPopupVisible }" -->
	<!-- tool: 화면인쇄 -->
	<div id="tool-print" class="modal" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-dialog-centered modal-xl print-popup">
			<div class="modal-content">
				<div class="modal-head">
					<h5 class="tit">화면인쇄</h5>
					<a class="btn-close" @click="closePrintPopup"></a>
				</div>
				<div class="modal-body">
					<div
						id="layer-sort-print"
						class="sort-list"
						style="display: block"
						v-if="layers.length != 0 || menuStore.lnbActive === 'area'"
					>
						<div class="body">
							<div class="bullet-tit-print" style="font-size: 100%">범례</div>
							<div id="tit-print-summary" class="summary slim-scroll">
								<ol id="toSortable" class="sortable" style="font-size: 9px">
									<li v-for="(item, index) in layers" :key="index" :data-wgmapid="item.wgMapId">
										<template v-if="item.layerWorkSpace">
											<PointLegend v-if="item.layerVectorCode == 'AB001'" :layer="item" />
											<PolygonLegend v-if="item.layerVectorCode == 'AB003'" :layer="item" />
										</template>
										{{ item.layerDescription }}
									</li>
									<template v-if="menuStore.lnbActive === 'area'">
										<li v-if="areaStore.isSdw">
											<i class="area-layer-legend" style="background-color: #00ff00"></i>허가구역현황(SDW)
										</li>
										<li v-if="areaStore.isInfoSys">
											<i class="area-layer-legend" style="background-color: #00b050"></i>허가구역현황(부동산종합공부)
										</li>
										<li v-if="areaStore.isStRebuilt">
											<i class="area-layer-legend" style="background-color: #00ff00"></i>신통 재개발
										</li>
										<li v-if="areaStore.isPbRebuilt">
											<i class="area-layer-legend" style="background-color: #ee7012"></i>공공 재개발
										</li>
										<li v-if="areaStore.isReConstruct">
											<i class="area-layer-legend" style="background-color: #ffc000"></i>재건축
										</li>
										<li v-if="areaStore.isStReConstruct">
											<i class="area-layer-legend" style="background-color: #d3be3d"></i>신통 민간 재건축
										</li>
										<li v-if="areaStore.isAreaEtc">
											<i class="area-layer-legend" style="background-color: #f9fd5d"></i>기타
										</li>
									</template>
								</ol>
							</div>
						</div>
					</div>
					<div>
						<Spinner v-if="isLoading" class="spinner" />
						<div v-else ref="mapImg" class="capture-frame"></div>
						<textarea
							id="printTxtArea"
							class="form-control mt-3 input-print-text"
							title="내용입력"
							rows="5"
							placeholder="내용을 입력하세요."
						></textarea>
						<div class="action-btn-group">
							<div class="btn-print-group">
								<button type="button" class="btn btn-primary btn-print" @click="printMap">인쇄하기</button>
								<button
									type="button"
									class="btn btn-light btn-close"
									data-dismiss="modal"
									aria-label="Close"
									@click="closePrintPopup"
								>
									닫기
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import html2canvas from 'html2canvas'

import PointLegend from '@/components/leftPanel/legend/PointLegend.vue'
import PolygonLegend from '@/components/leftPanel/legend/PolygonLegend.vue'
import Spinner from '@/components/Spinner.vue'

import { usePopupStore } from '@/stores/popup'
import { useLayerStore } from '@/stores/layer'
import { useAreaStore } from '@/stores/area'
import { useMenuStore } from '@/stores/menu'
import { useColorStore } from '@/stores/color'

export default {
	components: {
		Spinner,
		PointLegend,
		PolygonLegend,
	},
	setup() {
		const mapImg = ref(null)

		//stores
		const popupStore = usePopupStore()
		const layerStore = useLayerStore()
		const areaStore = useAreaStore()
		const menuStore = useMenuStore()
		const colorStore = useColorStore()

		let layers = ref([])

		const isLoading = ref(true)

		onMounted(() => {
			$('#screanPrintPop #toSortable').find('i').remove()
			$('#screanPrintPop .badge').css({
				position: 'relative',
				top: '-4px',
				margin: '2px',
			})
			showMapImg()
		})
		onBeforeUnmount(() => {
			mapImg.value.innerHTML = ''
		})

		const showMapImg = () => {
			let mapCanvas

			mapCanvas = document.querySelector('#map')
			mapCanvas.style.zoom = '100%'
			document.getElementsByClassName('wg-zoom')[0].style.display = 'none'

			layers.value = [...layerStore.visibleLayers]
			// html2canvas => html 화면을 캡쳐하여 이미지 파일로 저장할 수 있는 라이브러리
			setTimeout(() => {
				isLoading.value = false
				html2canvas(mapCanvas, { useCORS: true, allowTaint: true }).then((canvas) => {
					mapCanvas.style.zoom = '133.3%'
					const canvasWidth = canvas.width
					const canvasHeight = canvas.height
					// 인쇄 사이즈 틀의 넓이
					const frameWidth = 1200
					// 지도의 넓이
					const resizeWidth = frameWidth
					// 지도의 높이
					const resizeHeight = (frameWidth * canvasHeight) / canvasWidth
					const modalBodyHeight = resizeHeight + 120

					canvas.style.width = resizeWidth + 'px'
					canvas.style.height = resizeHeight + 'px'

					mapImg.value.append(canvas)
					document.getElementsByClassName('wg-zoom')[0].style.display = 'block'
					document.getElementById('printTxtArea').value = ''

					document.getElementsByClassName('modal-body')[0].style.height = modalBodyHeight + 'px'

					$('.capture-frame canvas')[0].id = 'canvas-map'
				})
			}, 10)

			// 주택동향, 토지동향, 실거래 부동산 범례
			setTimeout(() => {
				html2canvas(document.querySelector('#colorsLegend'), { useCORS: true, allowTaint: true })
					.then((canvas) => {
						const mapCanvas = document.getElementById('canvas-map')
						const ctxb = mapCanvas.getContext('2d')
						const x = 30
						const y = mapCanvas.height - canvas.height - 30
						ctxb.drawImage(canvas, x, y)
					})
					.catch((error) => console.error(error))
			}, 10)

			// 서울, 수도권 평균
			setTimeout(() => {
				html2canvas(document.querySelector('.average-count'), { useCORS: true, allowTaint: true })
					.then((canvas) => {
						const mapCanvas = document.getElementById('canvas-map')
						const ctxb = mapCanvas.getContext('2d')
						const averageCount = document.querySelector('.average-count')
						const x = mapCanvas.width - canvas.width - 20
						const y = averageCount.style.top + 10

						ctxb.drawImage(canvas, x, y)
					})
					.catch((error) => console.error(error))
			}, 10)
		}

		const printMap = () => {
			window.print()
		}

		const closePrintPopup = () => {
			popupStore.setPopupState({
				printPopupVisible: false,
			})
		}

		const beforePrint = () => {
			document.getElementsByClassName('abno-transaction')[0].style.display = 'none'
			document.getElementsByClassName('blind')[0].style.display = 'none'
			document.getElementsByClassName('gnb')[0].style.display = 'none'
			document.getElementsByClassName('content')[0].style.display = 'none'
			document.getElementsByClassName('btn-fold')[0].style.display = 'none'
			document.getElementsByClassName('toolbar')[0].style.display = 'none'
			document.getElementsByClassName('btn-print-group')[0].style.display = 'none'
			document.getElementsByClassName('side-panel')[0].style.display = 'none'
		}

		const afterPrint = () => {
			document.getElementsByClassName('abno-transaction')[0].style.display = 'block'
			document.getElementsByClassName('blind')[0].style.display = 'flex'
			document.getElementsByClassName('gnb')[0].style.display = 'flex'
			document.getElementsByClassName('content')[0].style.display = 'block'
			document.getElementsByClassName('btn-fold')[0].style.display = 'flex'
			document.getElementsByClassName('toolbar')[0].style.display = 'flex'
			document.getElementsByClassName('btn-print-group')[0].style.display = 'flex'
			document.getElementsByClassName('side-panel')[0].style.display = 'flex'
		}

		window.onbeforeprint = beforePrint
		window.onafterprint = afterPrint

		return {
			mapImg,
			layers,
			isLoading,
			showMapImg,
			closePrintPopup,
			printMap,
			popupStore,
			areaStore,
			menuStore,
			colorStore,
		}
	},
}
</script>

<style scoped>
.modal,
.sort-list {
	display: block;
}

.modal-head,
.modal-body {
	width: 1200px;
}

.modal-content,
.print-popup,
.modal-body {
	height: 82%;
}

.btn-print-group {
	margin-top: -20px;
}
.btn-print {
	margin-right: 40px;
}

.action-btn-group {
	margin-top: 10px;
}

.sortable li {
	display: flex;
	align-items: center;
	margin-bottom: 3px;
	font-size: 150%;
}

.modal-dialog {
	position: relative;
	width: 1100px;
	margin: 0.5rem;
}

.print-popup {
	margin: 0 auto;
}

.print-popup .modal-content {
	max-width: 1100px;
}

/* 도구 : 화면캡쳐 */
.capture-frame img {
	width: 100%;
	height: 100%;
}

#layer-sort-print {
	background-color: white;
	min-width: 150px;
	position: sticky;
	padding: 1rem !important;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
	display: none;
	position: absolute;
	z-index: 350;
	line-height: 0.5;
}

#tit-print-summary {
	font-size: 0.1rem;
}

.bullet-tit-print {
	margin: 0 0 1rem 0;
	font-size: 0.5rem;
	font-weight: 500;
	position: relative;
	line-height: 0.5;
}

.area-layer-legend {
	width: 10px;
	height: 10px;
	margin: 2px 4px 0 0;
}

@media print {
	@page {
		size: A4 landscape;
		margin: 10px;
		padding: 0;
	}

	.modal-body,
	.modal-content,
	.print-popup {
		padding: 0;
		margin: 0;
	}
	.capture-frame {
		zoom: 122.5%;
	}

	.input-print-text {
		line-height: 2;
		position: absolute;
		left: 0;
		margin-top: 5px;
		border: none;
		width: 170%;
	}

	.modal-head {
		display: none;
	}
}
</style>
