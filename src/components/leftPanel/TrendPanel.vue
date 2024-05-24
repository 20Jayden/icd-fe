<template>
	<div class="content show">
		<div class="head">
			<h3>동향분석 주제도</h3>
			<div class="action-btn-group mb-15">
				<div class="right">
					<button type="button" class="btn btn-primary btn-sm open-order">순서변경</button>
				</div>
			</div>
		</div>
		<div class="body slim-scroll">
			<div class="tab">
				<ul>
					<li :class="{ 'active': activeTab === 'layer' }">
						<a @click="onLayerTabClick"><span>주제도</span></a>
						<div class="tab-pane" v-show="activeTab === 'layer'">
							<div class="accordion">
								<a v-if="basicBoundaryAreaLayerList.length > 0" class="tit active" @click="onAccordionClick"
									>행정경계/구역</a
								>
								<ul class="house-trend">
									<li v-for="layer in basicBoundaryAreaLayerList" :key="layer.layerSequence">
										<div class="custom-control">
											<input
												type="checkbox"
												:id="layer.layerSequence"
												v-model="layerStore.visible[layer.layerSequence]"
												@change="onLayerStateChange($event, layer)"
											/>
											<label :for="layer.layerSequence" class="icon">
												<BlurLegend
													v-if="
														layerStore.visible[layer.layerSequence] &&
														zoomLimitLayerSquence.includes(layer.layerSequence) &&
														viewStore.zoom < 14
													"
												/>
												<template v-else>
													<PointLegend v-if="layer.layerVectorCode == 'AB001'" :layer="layer" />
													<PolygonLegend v-if="layer.layerVectorCode == 'AB003'" :layer="layer" />
												</template>
												{{ layer.layerDescription }}
											</label>
										</div>
									</li>
								</ul>
							</div>

							<div class="accordion">
								<a v-if="terrainBuildingLayerList.length > 0" class="tit active" @click="onAccordionClick">건물/토지</a>
								<ul class="house-trend">
									<li v-for="layer in terrainBuildingLayerList" :key="layer.layerSequence">
										<div class="custom-control">
											<input
												type="checkbox"
												:id="layer.layerSequence"
												v-model="layerStore.visible[layer.layerSequence]"
												@change="onLayerStateChange($event, layer)"
											/>
											<label :for="layer.layerSequence" class="icon">
												<BlurLegend
													v-if="
														layerStore.visible[layer.layerSequence] &&
														zoomLimitLayerSquence.includes(layer.layerSequence) &&
														viewStore.zoom < 14
													"
												/>
												<template v-else>
													<PointLegend v-if="layer.layerVectorCode == 'AB001'" :layer="layer" />
													<PolygonLegend v-if="layer.layerVectorCode == 'AB003'" :layer="layer" />
												</template>
												{{ layer.layerDescription }}
											</label>
										</div>
									</li>
								</ul>
							</div>

							<div class="accordion">
								<a v-if="areaLayerList.length > 0" class="tit active" @click="onAccordionClick">구역</a>
								<ul class="house-trend">
									<li v-for="layer in areaLayerList" :key="layer.layerSequence">
										<div class="custom-control">
											<input
												type="checkbox"
												:id="layer.layerSequence"
												v-model="layerStore.visible[layer.layerSequence]"
												@change="onLayerStateChange($event, layer)"
											/>
											<label :for="layer.layerSequence" class="icon">
												<BlurLegend
													v-if="
														layerStore.visible[layer.layerSequence] &&
														zoomLimitLayerSquence.includes(layer.layerSequence) &&
														viewStore.zoom < 14
													"
												/>
												<template v-else>
													<PointLegend v-if="layer.layerVectorCode == 'AB001'" :layer="layer" />
													<PolygonLegend v-if="layer.layerVectorCode == 'AB003'" :layer="layer" />
												</template>
												{{ layer.layerDescription }}
											</label>
										</div>
									</li>
								</ul>
							</div>

							<div class="accordion">
								<a v-if="zonningDistrictLayerList.length > 0" class="tit active" @click="onAccordionClick"
									>용도지역지구</a
								>
								<ul class="house-trend">
									<li v-for="layer in zonningDistrictLayerList" :key="layer.layerSequence">
										<div class="custom-control">
											<input
												type="checkbox"
												:id="layer.layerSequence"
												v-model="layerStore.visible[layer.layerSequence]"
												@change="onLayerStateChange($event, layer)"
											/>
											<label :for="layer.layerSequence" class="icon">
												<BlurLegend
													v-if="
														layerStore.visible[layer.layerSequence] &&
														zoomLimitLayerSquence.includes(layer.layerSequence) &&
														viewStore.zoom < 14
													"
												/>
												<template v-else>
													<PointLegend
														v-if="layer.layerVectorCode == 'AB001' && layer.layerSourceCode !== 'VWORLD'"
														:layer="layer"
													/>
													<PolygonLegend
														v-if="layer.layerVectorCode == 'AB003' && layer.layerSourceCode !== 'VWORLD'"
														:layer="layer"
													/>
												</template>
												{{ layer.layerDescription }}
											</label>
										</div>
									</li>
								</ul>
							</div>

							<div class="accordion">
								<a v-if="propertyLayerList.length > 0" class="tit active" @click="onAccordionClick">부동산</a>
								<ul class="house-trend">
									<li v-for="layer in propertyLayerList" :key="layer.layerSequence">
										<div class="custom-control">
											<input
												type="checkbox"
												:id="layer.layerSequence"
												v-model="layerStore.visible[layer.layerSequence]"
												@change="onLayerStateChange($event, layer)"
											/>
											<label :for="layer.layerSequence" class="icon">
												<BlurLegend
													v-if="
														layerStore.visible[layer.layerSequence] &&
														zoomLimitLayerSquence.includes(layer.layerSequence) &&
														viewStore.zoom < 14
													"
												/>
												<template v-else>
													<PointLegend v-if="layer.layerVectorCode == 'AB001'" :layer="layer" />
													<PolygonLegend v-if="layer.layerVectorCode == 'AB003'" :layer="layer" />
												</template>
												{{ layer.layerDescription }}
											</label>
										</div>
									</li>
								</ul>
							</div>
							<div class="accordion">
								<a v-if="etcLayerList.length > 0" class="tit active" @click="onAccordionClick">기타</a>
								<ul class="house-trend">
									<li v-for="layer in etcLayerList" :key="layer.layerSequence">
										<div class="custom-control">
											<input
												type="checkbox"
												:id="layer.layerSequence"
												v-model="layerStore.visible[layer.layerSequence]"
												@change="onLayerStateChange($event, layer)"
											/>
											<label :for="layer.layerSequence" class="icon">
												<BlurLegend
													v-if="
														layerStore.visible[layer.layerSequence] === true &&
														zoomLimitLayerSquence.includes(layer.layerSequence) &&
														viewStore.zoom < 14
													"
												/>
												<template v-else>
													<PointLegend v-if="layer.layerVectorCode == 'AB001'" :layer="layer" />
													<PolygonLegend v-if="layer.layerVectorCode == 'AB003'" :layer="layer" />
												</template>
												{{ layer.layerDescription }}
											</label>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</li>
					<li :class="{ 'active': activeTab === 'user' }">
						<a @click="onUserTabClick"><span>사용자 레이어</span></a>
						<UserLayerTab />
					</li>
				</ul>
			</div>
		</div>
	</div>
	<TrendPanelLegend />
</template>

<script>
//basic
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
//components
import BlurLegend from '@/components/leftPanel/legend/BlurLegend.vue'
import PointLegend from '@/components/leftPanel/legend/PointLegend.vue'
import PolygonLegend from '@/components/leftPanel/legend/PolygonLegend.vue'
import TrendPanelLegend from '@/components/leftPanel/legend/TrendPanelLegend.vue'

import UserLayerTab from '../UserLayerTab.vue'
//api
import CommonUtil from '@/api/logTable'
//stores
import { useLog } from '@/stores/log'
import { useWmsStore } from '@/stores/wms'
import { useViewStore } from '@/stores/view'
import { useLayerStore } from '@/stores/layer'
import { useModalStore } from '@/stores/modal'
import { useLoadingStore } from '@/stores/loading'
//composition
import wms from '@/composition/wms'
import wgLayers from '@/composition/wgLayers'
import vworld from '@/composition/vworld'
import useStyle from '@/composition/style'

let tooltipElement = null
let tooltip = null

/**
 * 건물연령정보 Feature Hover 이벤트
 */
const onPointerMove = (e) => {
	if (WGMap.getView().getZoom() < 17) {
		tooltipElement.style.display = 'none'
		return
	}
	if (e.dragging) {
		tooltipElement.style.display = 'none'
		return
	}

	// 건물연령정보 레이어
	let wmsLayer = WGMap.getLayerById('wms-10')

	let pixel = WGMap.getEventPixel(e.originalEvent)
	let hit = WGMap.hasFeatureAtPixel(pixel)
	let viewResolution = WGMap.getView().getResolution()
	let url = wmsLayer.getSource().getFeatureInfoUrl(
		e.coordinate,
		viewResolution,
		'EPSG:3857',
		{ 'INFO_FORMAT': 'application/json' } // 또는 'text/html' 등 다른 포맷 사용 가능
	)

	if (url) {
		fetch(url)
			.then((res) => res.json())
			.then((res) => {
				if (res.features[0]) {
					// 피처 정보를 사용하여 툴팁 내용을 설정
					tooltipElement.innerHTML = res.features[0].properties.BLDG_AGE // 예: JSON 정보를 사용하여 내용 설정
					tooltip.setPosition(e.coordinate)
					tooltipElement.style.display = 'block'
				} else {
					tooltipElement.style.display = 'none'
				}
			})
	}
}

export default {
	components: {
		PointLegend,
		PolygonLegend,
		TrendPanelLegend,
		UserLayerTab,
		BlurLegend,
	},
	setup() {
		const wmsStore = useWmsStore()
		const viewStore = useViewStore()
		const layerStore = useLayerStore()
		const loadingStore = useLoadingStore()
		const modalStore = useModalStore()
		const log = useLog()

		let activeTab = ref('layer')
		let hoverFeature = null

		let wfsLayer = null

		const zoomLimitLayerSquence = [6, 7, 8, 9, 10, 11, 12, 13, 14, 19, 20, 21, 24]

		// style composition
		const style = useStyle()

		/**
		 * WMS 레이어 타일 로드 감지
		 */
		watch(
			() => wmsStore.tileLoadCount,
			() => {
				if (wmsStore.tileLoadCount === 0) {
					setTimeout(() => {
						loadingStore.isLoading = false
					}, 1000)
				} else {
					loadingStore.isLoading = true
				}
			}
		)

		// 컴포넌트 마운트
		onMounted(() => {
			layerStore.listLayer()
			addEventHandler()
			$('.side-panel .body').slimScroll({
				height: 'calc(100% - 75px)',
				railVisible: true,
				wheelStep: 50,
				allowPageScroll: false,
				disableFadeOut: false,
			})
			createTooltipOverlay()
		})

		// 컴포넌트 Unmount 될 때, 레이어 끄기
		onUnmounted(() => {})

		// 주제도레이어 리스트
		const {
			basicBoundaryAreaLayerList, //행정경계/구역
			terrainBuildingLayerList, //건물/토지
			areaLayerList, // 구역
			propertyLayerList, // 부동산
			etcLayerList, // 기타
			zonningDistrictLayerList, //용도지역지구
		} = storeToRefs(layerStore)

		/**
		 * 주제도 순서변경 팝업 접기/펼치기 Handler
		 */
		const addEventHandler = () => {
			// 동향분석 주제도 : 순서변경 접기/펼치기
			$('.change-order .btn-close').on('click', function () {
				$('.change-order .content').hide()
			})
			$('.open-order').on('click', function () {
				$('.change-order .content').show()
			})
		}

		/**
		 * 레이어리스트 체크박스 on/off 감지
		 */

		const layerVisible = (layer) => {
			if (layerStore.visible[layer.layerSequence] == true) {
				if (layer.layerSequence == 1) {
					//로그테이블(자치구 경계)
					CommonUtil.log(log.TARGET.BASICBOUNDARYAREALAYER1, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 3) {
					//로그테이블(법정동 경계1)
					CommonUtil.log(log.TARGET.BASICBOUNDARYAREALAYER2, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 2) {
					//로그테이블(행정동경계)
					CommonUtil.log(log.TARGET.BASICBOUNDARYAREALAYER3, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 4) {
					//로그테이블(법정동 경계)
					CommonUtil.log(log.TARGET.BASICBOUNDARYAREALAYER4, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 5) {
					//로그테이블(기초구역)
					CommonUtil.log(log.TARGET.BASICBOUNDARYAREALAYER5, log.ACTION.SUCCESS, null)
				}
				//지형/건축물
				if (layer.layerSequence == 6) {
					//로그테이블(건물_SDW)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER1, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 7) {
					//로그테이블(건물(도로명안내시스템))
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER2, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 8) {
					//로그테이블(건물군(도로명안내시스템))
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER3, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 9) {
					//로그테이블(건물통합정보)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER4, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 10) {
					//로그테이블(건물연령정보)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER5, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 11) {
					//로그테이블(건물용도별정보)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER6, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 12) {
					//로그테이블(공동주택정보)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER7, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 13) {
					//로그테이블(연속지적도)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER8, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 14) {
					//로그테이블(지하철 역사)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER9, log.ACTION.SUCCESS, null)
				}
				//주택/토지
				if (layer.layerSequence == 15) {
					//로그테이블(토지거래허가구역(부동산종합공부))
					CommonUtil.log(log.TARGET.HOUSELANDLAYER1, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 16) {
					//로그테이블(토지거래허가구역(SDW))
					CommonUtil.log(log.TARGET.HOUSELANDLAYER2, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 17) {
					//로그테이블(재개발구역)
					CommonUtil.log(log.TARGET.HOUSELANDLAYER3, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 18) {
					//로그테이블(개발제한구역)
					CommonUtil.log(log.TARGET.HOUSELANDLAYER4, log.ACTION.SUCCESS, null)
				}
				//허가구역
				if (layer.layerSequence == 19) {
					//로그테이불(개별공시지가)
					CommonUtil.log(log.TARGET.PERMITTEDZONELAYER1, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 20) {
					//로그테이블(개별주택가격)
					CommonUtil.log(log.TARGET.PERMITTEDZONELAYER2, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 21) {
					//로그테이블(부동산중개업소)
					CommonUtil.log(log.TARGET.PERMITTEDZONELAYER3, log.ACTION.SUCCESS, null)
				}
				//부동산거래
				if (layer.layerSequence == 22) {
					//로그테이블(상주인구(2022년 6월))
					CommonUtil.log(log.TARGET.PROPERTYTRADELAYER1, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 23) {
					//로그테이블(상주인구(2022년 12월))
					CommonUtil.log(log.TARGET.PROPERTYTRADELAYER2, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 24) {
					//로그테이불(사업체조사(2022년))
					CommonUtil.log(log.TARGET.PROPERTYTRADELAYER3, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 25) {
					//로그테이블(생활권 경계(18년 3월))
					CommonUtil.log(log.TARGET.PROPERTYTRADELAYER4, log.ACTION.SUCCESS, null)
				}
				if (layer.layerSequence == 26) {
					//로그테이블(생활권 중심지(18년 3월))
					CommonUtil.log(log.TARGET.PROPERTYTRADELAYER5, log.ACTION.SUCCESS, null)
				}
			}
		}
		const onLayerStateChange = async (event, layer) => {
			if (layer.layerSourceCode === 'VWORLD') {
				vworld.setVisible(layer.layerSequence, event.target.checked)
			} else {
				if (
					layer.layerSequence === 1 ||
					layer.layerSequence === 2 ||
					layer.layerSequence === 4 ||
					layer.layerSequence === 13
				) {
					if (event.target.checked) {
						wfsLayer = await wgLayers.addLayerWFS(
							`${layer.layerWorkSpace}:${layer.layerId}`,
							layer.wgMapId,
							layer.layerSequence === 1
								? style.getTrendLayerStyle().sgg
								: layer.layerSequence === 2
								? style.getTrendLayerStyle().hjd
								: layer.layerSequence === 4
								? style.getTrendLayerStyle().bjd
								: style.getTrendLayerStyle().cbnd,
							1,
							1
						)
					} else {
						WGMap.removeLayer(WGMap.getLayerById(layer.wgMapId))
					}
				} else {
					if (event.target.checked) {
						if (WGMap.getView().getZoom() < 14) {
							if (
								layer.layerSequence === 6 ||
								layer.layerSequence === 7 ||
								layer.layerSequence === 8 ||
								layer.layerSequence === 9 ||
								layer.layerSequence === 10 ||
								layer.layerSequence === 11 ||
								layer.layerSequence === 12 ||
								layer.layerSequence === 13 ||
								layer.layerSequence === 14 ||
								layer.layerSequence === 19 ||
								layer.layerSequence === 20 ||
								layer.layerSequence === 21 ||
								layer.layerSequence === 24
							) {
								// 체크 해제
								event.target.checked = false
								layerStore.visible[layer.layerSequence] = false

								modalStore.showToast('info', '14레벨 이상 조회 가능한 레이어입니다')

								return
							}
						}
					}
					wms.setVisible('spta', layer.layerSequence, event.target.checked)
				}
			}

			if (layer.layerSequence === 10) {
				onBuildingAgeTooltipVisible(event.target.checked)
			}

			if (event.target.checked == true) {
				//기초 경계/구역
				if (layer.layerSequence == 1) {
					//로그테이블(자치구 경계)
					CommonUtil.log(log.TARGET.BASICBOUNDARYAREALAYER1, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 3) {
					//로그테이블(법정동 경계1)
					CommonUtil.log(log.TARGET.BASICBOUNDARYAREALAYER2, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 2) {
					//로그테이블(행정동경계)
					CommonUtil.log(log.TARGET.BASICBOUNDARYAREALAYER3, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 4) {
					//로그테이블(법정동 경계)
					CommonUtil.log(log.TARGET.BASICBOUNDARYAREALAYER4, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 5) {
					//로그테이블(기초구역)
					CommonUtil.log(log.TARGET.BASICBOUNDARYAREALAYER5, log.ACTION.CLICK, null)
				}
				//지형/건축물
				if (layer.layerSequence == 6) {
					//로그테이블(건물_SDW)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER1, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 7) {
					//로그테이블(건물(도로명안내시스템))
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER2, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 8) {
					//로그테이블(건물군(도로명안내시스템))
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER3, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 9) {
					//로그테이블(건물통합정보)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER4, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 10) {
					//로그테이블(건물연령정보)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER5, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 11) {
					//로그테이블(건물용도별정보)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER6, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 12) {
					//로그테이블(공동주택정보)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER7, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 13) {
					//로그테이블(연속지적도)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER8, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 14) {
					//로그테이블(지하철 역사)
					CommonUtil.log(log.TARGET.TERRAINBUILDINGLAYER9, log.ACTION.CLICK, null)
				}
				//주택/토지
				if (layer.layerSequence == 15) {
					//로그테이블(토지거래허가구역(부동산종합공부))
					CommonUtil.log(log.TARGET.HOUSELANDLAYER1, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 16) {
					//로그테이블(토지거래허가구역(SDW))
					CommonUtil.log(log.TARGET.HOUSELANDLAYER2, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 17) {
					//로그테이블(재개발구역)
					CommonUtil.log(log.TARGET.HOUSELANDLAYER3, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 18) {
					//로그테이블(개발제한구역)
					CommonUtil.log(log.TARGET.HOUSELANDLAYER4, log.ACTION.CLICK, null)
				}
				//허가구역
				if (layer.layerSequence == 19) {
					//로그테이불(개별공시지가)
					CommonUtil.log(log.TARGET.PERMITTEDZONELAYER1, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 20) {
					//로그테이블(개별주택가격)
					CommonUtil.log(log.TARGET.PERMITTEDZONELAYER2, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 21) {
					//로그테이블(부동산중개업소)
					CommonUtil.log(log.TARGET.PERMITTEDZONELAYER3, log.ACTION.CLICK, null)
				}
				//부동산거래
				if (layer.layerSequence == 22) {
					//로그테이블(상주인구(2022년 6월))
					CommonUtil.log(log.TARGET.PROPERTYTRADELAYER1, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 23) {
					//로그테이블(상주인구(2022년 12월))
					CommonUtil.log(log.TARGET.PROPERTYTRADELAYER2, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 24) {
					//로그테이불(사업체조사(2022년))
					CommonUtil.log(log.TARGET.PROPERTYTRADELAYER3, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 25) {
					//로그테이블(생활권 경계(18년 3월))
					CommonUtil.log(log.TARGET.PROPERTYTRADELAYER4, log.ACTION.CLICK, null)
				}
				if (layer.layerSequence == 26) {
					//로그테이블(생활권 중심지(18년 3월))
					CommonUtil.log(log.TARGET.PROPERTYTRADELAYER5, log.ACTION.CLICK, null)
				}
			}
			layerVisible(layer)
		}

		/**
		 * 건물연령정보 Tooltip
		 */
		const onBuildingAgeTooltipVisible = (bool) => {
			if (bool) {
				if (!WGMap.hasListener('pointermove')) {
					WGMap.on('pointermove', onPointerMove)
				}
			} else {
				WGMap.un('pointermove', onPointerMove)
				tooltipElement.style.display = 'none'
			}
		}

		/**
		 * 아코디언 이벤트 핸들러
		 * @param {*} e
		 */
		const onAccordionClick = (e) => {
			$(e.target).next().slideToggle(200).prev().toggleClass('active')
		}

		/**
		 * 주제도레이어 탭 클릭
		 */
		const onLayerTabClick = () => {
			activeTab.value = 'layer'
		}

		/**
		 * 사용자레이어 탭 클릭
		 */
		const onUserTabClick = () => {
			activeTab.value = 'user'
		}

		/**
		 * 건물연령정보 Tooltip 오버레이 생성
		 */
		const createTooltipOverlay = () => {
			tooltipElement = document.createElement('div')
			tooltipElement.className = 'oldage-tooltip'

			tooltip = new wg.Overlay({
				element: tooltipElement,
				offset: [0, -30],
				positioning: 'center-center',
			})

			WGMap.addOverlay(tooltip)
		}

		return {
			activeTab,
			layerStore,
			viewStore,
			basicBoundaryAreaLayerList,
			terrainBuildingLayerList,
			areaLayerList,
			propertyLayerList,
			etcLayerList,
			zonningDistrictLayerList,
			zoomLimitLayerSquence,
			onLayerStateChange,
			onAccordionClick,
			onLayerTabClick,
			onUserTabClick,
			layerVisible,
		}
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}

.side-panel .content .body {
	padding: 15px 15px 30px 15px;
}
.tab-pane {
	padding-top: 1px !important;
}
.mb-15 {
	margin-bottom: 2px !important;
}
</style>
