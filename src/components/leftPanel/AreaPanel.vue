<template>
	<div class="content show">
		<div class="head">
			<h3>허가구역 관리</h3>
		</div>
		<div class="body slim-scroll">
			<div class="accordion" style="margin-bottom: 15px">
				<a class="tit active" @click="onAccordionClick2">토지거래허가구역 현황</a>
				<ul class="house-trend">
					<li>
						<div class="custom-control">
							<input type="checkbox" id="sdw" checked v-model="sdwLayerCheck" @change="onAreaCheck($event)" />
							<label for="sdw" class="icon" style="margin-right: 3px"
								><i style="background-color: #00ff00"></i>허가구역현황(SDW)</label
							>
						</div>
						<div class="custom-control custom-switch">
							<input
								type="checkbox"
								class="custom-control-input"
								id="sdw-switch"
								v-model="sdwCheck"
								@change="onDeleteCheck($event)"
							/>
						</div>
						<div class="landtrade-area">
							<div class="btn-group">
								<a class="btn-shp" @click="onShpDownloadLayerClick('GIS_LT_B_UQ141_SDW')"
									><span class="blind">SHP</span></a
								>
							</div>
						</div>
					</li>
					<li style="margin-left: 5px">
						<div class="custom-control">
							<input type="checkbox" id="info_sys" checked v-model="infoSysLayerCheck" @change="onAreaCheck($event)" />
							<label for="info_sys" class="icon" style="margin-right: 3px; font-size: smaller"
								><i style="background-color: #00b050"></i>허가구역현황(부동산종합공부)</label
							>
						</div>
						<div class="custom-control custom-switch">
							<input
								type="checkbox"
								class="custom-control-input"
								id="infosys-switch"
								v-model="sdwMenuCheck"
								@change="onDeleteCheck($event)"
							/>
							<label class="label custom-control-label" for="infosys-switch" style="margin-right: 5px"
								><span>지적추출</span></label
							>
						</div>
						<div class="landtrade-area">
							<div class="btn-group">
								<a class="btn-shp" @click="onShpDownloadLayerClick('GIS_LSMD_CONT_UQ141')"
									><span class="blind">SHP</span></a
								>
							</div>
						</div>
					</li>
					<li>
						<div class="custom-control">
							<input
								type="checkbox"
								id="st_rebuilt"
								checked
								v-model="stRebuiltLayerCheck"
								@change="onAreaCheck($event)"
							/>
							<label for="st_rebuilt" class="icon"><i style="background-color: #ff0000"></i>신통 재개발</label>
						</div>
						<div class="custom-control custom-switch">
							<input
								type="checkbox"
								class="custom-control-input"
								id="st-rebuilt-switch"
								v-model="stRebuiltCheck"
								@change="onDeleteCheck($event)"
							/>
							<label class="label custom-control-label" for="st-rebuilt-switch" style="margin-right: 5px"
								><span>삭제이력</span></label
							>
							<div class="landtrade-area">
								<div class="btn-group">
									<a class="btn-xls" @click="onBizExcelDownloadClick('3.신통_재개발')"
										><span class="blind">XLS</span></a
									>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="custom-control">
							<input
								type="checkbox"
								id="pb_rebuilt"
								checked
								v-model="pbRebuiltLayerCheck"
								@change="onAreaCheck($event)"
							/>
							<label for="pb_rebuilt" class="icon"><i style="background-color: #ee7012"></i>공공 재개발</label>
						</div>
						<div class="custom-control custom-switch">
							<input
								type="checkbox"
								class="custom-control-input"
								id="pb-rebuilt-switch"
								v-model="pbRebuiltCheck"
								@change="onDeleteCheck($event)"
							/>
							<label class="label custom-control-label" for="pb-rebuilt-switch" style="margin-right: 5px"
								><span>삭제이력</span></label
							>
							<div class="landtrade-area">
								<div class="btn-group">
									<a class="btn-xls" @click="onBizExcelDownloadClick('1.공공재개발')"><span class="blind">XLS</span></a>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="custom-control">
							<input
								type="checkbox"
								id="re_construct"
								checked
								v-model="reConstructLayerCheck"
								@change="onAreaCheck($event)"
							/>
							<label for="re_construct" class="icon"><i style="background-color: #ffc000"></i>재건축</label>
						</div>
						<div class="custom-control custom-switch">
							<input
								type="checkbox"
								class="custom-control-input"
								id="re-construct-switch"
								v-model="reConstructCheck"
								@change="onDeleteCheck($event)"
							/>
							<label class="label custom-control-label" for="re-construct-switch" style="margin-right: 5px"
								><span>삭제이력</span></label
							>
							<div class="landtrade-area">
								<div class="btn-group">
									<a class="btn-xls" @click="onBizExcelDownloadClick('2.재건축')"><span class="blind">XLS</span></a>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="custom-control">
							<input
								type="checkbox"
								id="st_reconstruct"
								checked
								v-model="stReconstructLayerCheck"
								@change="onAreaCheck($event)"
							/>
							<label for="st_reconstruct" class="icon"><i style="background-color: #d3be3d"></i>신통 민간 재건축</label>
						</div>
						<div class="custom-control custom-switch">
							<input
								type="checkbox"
								class="custom-control-input"
								id="st-reconstruct-switch"
								v-model="stReConstructCheck"
								@change="onDeleteCheck($event)"
							/>
							<label class="label custom-control-label" for="st-reconstruct-switch" style="margin-right: 5px"
								><span>삭제이력</span></label
							>
							<div class="landtrade-area">
								<div class="btn-group">
									<a class="btn-xls" @click="onBizExcelDownloadClick('4.신통_민간재건축')"
										><span class="blind">XLS</span></a
									>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="custom-control">
							<input type="checkbox" id="area_etc" checked v-model="areaEtcLayerCheck" @change="onAreaCheck($event)" />
							<label for="area_etc" class="icon"><i style="background-color: #f9fd5d"></i>기타</label>
						</div>
						<div class="custom-control custom-switch">
							<input
								type="checkbox"
								class="custom-control-input"
								id="area-etc-switch"
								v-model="areaEtcCheck"
								@change="onDeleteCheck($event)"
							/>
							<label class="label custom-control-label" for="area-etc-switch" style="margin-right: 5px"
								><span>삭제이력</span></label
							>
							<div class="landtrade-area">
								<div class="btn-group">
									<a class="btn-xls" @click="onBizExcelDownloadClick('5.기타')"><span class="blind">XLS</span></a>
								</div>
							</div>
						</div>
					</li>
					<button @click="isAdditionalStat" class="btn addition">권역/자치구 단위 통계</button>
				</ul>
			</div>

			<div class="accordion">
				<a class="tit active" id="accordion" @click="onAccordionClick">토지거래허가구역 목록</a>
				<div class="landtrade-area">
					<div class="search-form">
						<div class="keyword">
							<input
								type="text"
								class="form-control"
								placeholder="구역명을 입력하세요"
								v-model="inputSearchValue"
								@keyup.enter="onSearchNameClick"
							/>
							<button type="button" class="btn btn-search" @click="onSearchNameClick"></button>
						</div>
					</div>
					<div class="tit">토지거래허가구역 리스트</div>
					<div class="result-list treemenu">
						<div v-if="searchSggList.length == 0 && searchUserArea.length == 0" class="none">
							<span>결과가 없습니다.</span>
						</div>
						<ul>
							<li :class="{ active: isSearch }" id="sggListLi" v-for="(sgg, index) in searchSggList" :key="index">
								<a class="groupAtag" @click="onTreeActive($event)">{{ sgg[0] }}</a>
								<ol>
									<li
										v-for="area in searchSggList[index][1]"
										:key="area.mngGrpCd"
										@click="selectClickedGroup(area.mngGrpCd, 'click')"
									>
										<span v-if="area.delYn === 'Y'" class="groupbusinessName">{{ area.mngGrpNm }}</span>
										<span v-else-if="area.delYn === 'N'" class="groupbusinessName" style="color: #ff0000">{{
											area.mngGrpNm
										}}</span>
										<div class="btn-group">
											<a class="btn-xls" @click="onExcelDownloadClick(area.mngGrpCd, area.mngGrpNm)"
												><span class="blind">XLS</span></a
											>
											<a class="btn-shp" @click="onShpDownloadClick(area.mngGrpCd, area.mngGrpNm)"
												><span class="blind">SHP</span></a
											>
										</div>
									</li>
								</ol>
							</li>
							<li v-if="isUserArray" :class="{ active: isSearch }">
								<a @click="onTreeActive($event)">임의구역</a>
								<ol>
									<li
										v-for="group in searchUserArea"
										:key="group.mngGrpCd"
										@click="selectClickedGroup(group.mngGrpCd, 'click')"
									>
										<span v-if="group.delYn === 'Y'" class="groupbusinessName">{{ group.mngGrpNm }} </span>
										<span v-else-if="group.delYn === 'N'" class="groupbusinessName" style="color: #ff0000"
											>{{ group.mngGrpNm }}
										</span>
										<div class="btn-group">
											<a class="btn-xls" @click="onExcelDownloadClick(group.mngGrpCd, group.mngGrpNm)"
												><span class="blind">XLS</span></a
											>
											<a class="btn-shp"><span class="blind">SHP</span></a>
										</div>
									</li>
								</ol>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<Teleport to="#popupContainer">
			<AreaSearchCondition @showPopUp="selectClickedGroup" />
			<AreaDetailPopup
				v-if="isDetailPopupShow && isSysinfoShow"
				:isDetailPopupShow="isDetailPopupShow"
				:lon="lon"
				:lat="lat"
				@closeDetailPopup="closeDetailPopup"
			/>
			<AreaGroupDetailPopup
				v-if="isPopupShow"
				:isPopupShow="isPopupShow"
				:clickedGroupCd="clickedGroupCd"
				:clickedGroupNm="clickedGroupNm"
				@closePopup="closePopup"
			/>
			<AreaAdditionalStat v-if="isAdditional" :isAdditional="isAdditional" @close-popup="closeAdditionPopup" />
		</Teleport>
	</div>
	<Loading v-if="isLoading" :title="loadingText.title" :subTitle="loadingText.subTitle" />
</template>
<!-- v-if="menuStore.lnbActive === 'area'" -->
<script>
import { onMounted, ref, onUnmounted, watch, computed, setDevtoolsHook } from 'vue'
import AreaSearchCondition from '@/components/popup/AreaSearchCondition.vue'
import AreaDetailPopup from '@/components/popup/AreaDetailPopup.vue'
import AreaGroupDetailPopup from '@/components/popup/AreaGroupDetailPopup.vue'
import AreaAdditionalStat from '@/components/popup/AreaAdditionalStat.vue'
import { useMenuStore } from '@/stores/menu'
import { useAreaStore } from '@/stores/area'
import { useToolStore } from '@/stores/tool'
import { useLayerStore } from '@/stores/layer'
import areaApi from '@/api/area'
import optionsApi from '@/api/options'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import Loading from '@/components/Loading.vue'
import axios from 'axios'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import wms from '@/composition/wms'
import wgLayers from '@/composition/wgLayers'
import wgTools from '@/composition/wgTools'
import useStyle from '@/composition/style'

export default {
	components: {
		AreaSearchCondition,
		AreaDetailPopup,
		AreaGroupDetailPopup,
		AreaAdditionalStat,
		Loading,
	},
	setup() {
		let isLoading = ref(false)

		let loadingText = {
			title: '잠시만 기다려주세요.',
			subTitle: '',
		}
		onMounted(async () => {
			$('.side-panel .body').slimScroll({
				height: 'calc(100% - 75px)',
				railVisible: true,
				wheelStep: 10,
				allowPageScroll: false,
				disableFadeOut: false,
			})
			// 허가구역 layer init
			await initLayer()
			// get 허가구역 group list
			await getMangeArea('init')
			// get 시군구 코드 list
			await getSggCode()
			// get 허가 구역 필지의 sgg 정보
			await getSggList()
		})

		// 허가구역 layer
		let mngLayer = null
		// 선택(클릭)된 필지 layer
		let selectedLayer = null
		//
		let stRebuiltTileLayer = null
		//
		let bpRebuiltTileLayer = null
		//
		let reConstructTileLayer = null
		//
		let stReConstructTileLayer = null
		//
		let areaEtcTileLayer = null
		//
		let stRebuiltNoTileLayer = null
		//
		let pbRebuiltNoTileLayer = null
		//
		let reConstructNoTileLayer = null
		//
		let stReConstructNoTileLayer = null
		//
		let areaEtcNoTileLayer = null
		// 부동산종합정보시스템 레이어
		let infoSysLayer = null
		// sdw 레이어
		let sdwLayer = null

		const layerStore = useLayerStore()
		const sdwLayerCheck = ref(true)
		const infoSysLayerCheck = ref(true)
		const stRebuiltLayerCheck = ref(true)
		const pbRebuiltLayerCheck = ref(true)
		const reConstructLayerCheck = ref(true)
		const stReconstructLayerCheck = ref(true)
		const areaEtcLayerCheck = ref(true)
		const toolStore = useToolStore()
		const log = useLog()
		const style = useStyle()

		const isAdditional = ref(false)
		const clickSelect = async (groupCd) => {
			const paramsForArea = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: 'spta:GIS_PERM_AREA',
				outputformat: 'application/json',
				format_options: 'CHARSET:EUC-KR',
				cql_filter: `MNG_GRP_CD='${groupCd}'AND IMP_FILE='Y'`,
			}

			const areaObjectInfo = await axios.get('/gis/wfs?' + getParamString(paramsForArea))
			//const { data } = await areaApi.getGeometryListByGroupCd(groupCd)
			const geometry = areaObjectInfo.data.features.map((item) => item.geometry)
			const areaGroupLayer = WGMap.getLayerById('areaGroup')
			if (!areaGroupLayer) {
				const source = new wg.source.Vector()
				selectedLayer = new wg.layer.Vector({
					id: 'areaGroup',
					source: source,
					style: new wg.style.Style({
						stroke: new wg.style.Stroke({
							color: '#ff008e14',
							width: 3,
						}),
					}),
					visible: true,
					zIndex: 6,
				})
				geometry.forEach((geom) => {
					let feature = new wg.format.GeoJSON().readFeature(geom)
					//feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
					source.addFeature(feature)
				})
				WGMap.addLayer(selectedLayer)
			} else {
				const newVectorSource = new wg.source.Vector()
				geometry.forEach((geom) => {
					let feature = new wg.format.GeoJSON().readFeature(geom)
					//feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
					newVectorSource.addFeature(feature)
				})
				areaGroupLayer.setSource(newVectorSource)
			}
		}
		function areaGroupClickEvent(event) {
			if (isOverlayClicked.value) {
				isOverlayClicked.value = false
				return
			}
			var coordinate = event.coordinate

			WGMap.forEachLayerAtPixel(event.pixel, async function (layer, a) {
				if (layer instanceof wg.layer.Tile && layer.values_.zIndex == 5) {
					var viewResolution = WGMap.getView().getResolution()
					var url = layer
						.getSource()
						.getFeatureInfoUrl(event.coordinate, viewResolution, WGMap.getView().getProjection(), {
							'INFO_FORMAT': 'application/json', // GetFeatureInfo 응답 형식 설정
						})
					if (url) {
						fetch(url)
							.then((res) => res.json())
							.then((res) => {
								if (res.features[0]) {
									clickedGroupCd.value = res.features[0].properties.MNG_GRP_CD
									clickedGroupNm.value = res.features[0].properties.MNG_GRP_NM
									areaStore.setClickedGroup(res.features[0].properties.MNG_GRP_CD)
									isPopupShow.value = true
									clickSelect(res.features[0].properties.MNG_GRP_CD)
								}
							})
					}
				}

				if(layer.values_.id == 'infoSys' && isSysinfoShow.value) {
					isDetailPopupShow.value = true
					areaStore.setAreaLon(event.coordinate[0])
					areaStore.setAreaLat(event.coordinate[1])
				}
			})
		}

		onUnmounted(() => {
			WGMap.removeLayer(mngLayer)
			WGMap.removeLayer(selectedLayer)
			WGMap.removeLayer(stRebuiltTileLayer)
			WGMap.removeLayer(bpRebuiltTileLayer)
			WGMap.removeLayer(reConstructTileLayer)
			WGMap.removeLayer(stReConstructTileLayer)
			WGMap.removeLayer(areaEtcTileLayer)
			WGMap.removeLayer(WGMap.getLayerById('sdw'))
			WGMap.removeLayer(WGMap.getLayerById('infoSys'))
			WGMap.removeLayer(WGMap.getLayerById('stRebuiltNo'))
			WGMap.removeLayer(WGMap.getLayerById('pbRebuiltNo'))
			WGMap.removeLayer(WGMap.getLayerById('reConstructNo'))
			WGMap.removeLayer(WGMap.getLayerById('stReConstructNo'))
			WGMap.removeLayer(WGMap.getLayerById('areaEtcNo'))
			WGMap.removeLayer(WGMap.getLayerById('centerGroupName'))
			WGMap.removeLayer(WGMap.getLayerById('areaFeatureLayer'))
			WGMap.removeLayer(WGMap.getLayerById('areaFieldGroup'))
			WGMap.un('singleclick', areaGroupClickEvent)
			//허가구역현황 레이어 일부가 사라지지 않고 지도에 잔상이 남는 버그 - 레이어 강제 off
			reVisibleAreaLayer()
		})

		const menuStore = useMenuStore()
		const areaStore = useAreaStore()
		const clickedGroupCd = ref('')
		const clickedGroupNm = ref('')
		const isSearch = ref(false)
		const isOverlayClicked = ref(false)
		const sggList = ref([])
		// 시군구 코드 리스트
		const sggCodeList = ref([])

		const officialArea = ref([])

		const inputSearchValue = ref('')

		const groupObject = ref([])

		const businessNm = ref([true, true, true, true, true, true])
		const sdwCheck = ref(false)
		const sdwMenuCheck = ref(false)
		const stRebuiltCheck = ref(false)
		const pbRebuiltCheck = ref(false)
		const reConstructCheck = ref(false)
		const stReConstructCheck = ref(false)
		const areaEtcCheck = ref(false)
		const selectedLayerCheck = ref(false)
		// popup show 여부
		const isPopupShow = ref(false)
		// popup detail show 여부
		const isDetailPopupShow = ref(false)
		// 지적추출 여부
		const isSysinfoShow = ref(false)
		const lon = ref(false)
		const lat = ref(false)

		const layerCheckArr = ref([])
		let topLayer = ref('')
		watch(
			() => areaStore.selectedGroup,
			() => {
				if (!areaStore.isChartVisible) {
					removeStat()
				}
			}
		)

		let layerState = {
			sdwLayerCheck: true,
			infoSysLayerCheck: true,
			stRebuiltLayerCheck: true,
			pbRebuiltLayerCheck: true,
			reConstructLayerCheck,
			stReconstructLayerCheck,
			areaEtcLayerCheck,
		}
		watch(
			() => sdwMenuCheck.value,
			() => {
				if (sdwMenuCheck.value) {
					layerCheckArr.value = [
						sdwLayerCheck.value,
						stRebuiltLayerCheck.value,
						pbRebuiltLayerCheck.value,
						reConstructLayerCheck.value,
						stReconstructLayerCheck.value,
						areaEtcLayerCheck.value,
					]
					setupLayerVisible('sdw', sdwLayerCheck, sdwLayer, false)
					setupLayerVisible('infoSys', infoSysLayerCheck, infoSysLayer, true)
					setupLayerVisible('stRebuilt', stRebuiltLayerCheck, stRebuiltTileLayer, false)
					setupLayerVisible('pbRebuilt', pbRebuiltLayerCheck, bpRebuiltTileLayer, false)
					setupLayerVisible('reConstruct', reConstructLayerCheck, reConstructTileLayer, false)
					setupLayerVisible('stReConstruct', stReconstructLayerCheck, stReConstructTileLayer, false)
					setupLayerVisible('areaEtc', areaEtcLayerCheck, areaEtcTileLayer, false)

					accordionActive(false)
				} else {
					if (layerCheckArr.value[0]) setupLayerVisible('sdw', sdwLayerCheck, sdwLayer, true)
					if (layerCheckArr.value[1]) setupLayerVisible('stRebuilt', stRebuiltLayerCheck, stRebuiltTileLayer, true)
					if (layerCheckArr.value[2]) setupLayerVisible('pbRebuilt', pbRebuiltLayerCheck, bpRebuiltTileLayer, true)
					if (layerCheckArr.value[3]) setupLayerVisible('reConstruct', reConstructLayerCheck, reConstructTileLayer, true)
					if (layerCheckArr.value[4]) setupLayerVisible('stReConstruct', stReconstructLayerCheck, stReConstructTileLayer, true)
					if (layerCheckArr.value[5]) setupLayerVisible('areaEtc', areaEtcLayerCheck, areaEtcTileLayer, true)
				}
			}
		)
		// sdw 레이어 클릭 여부
		watch(
			() => areaStore.isSdw,
			() => {
				const active = areaStore.isSdw
				businessNm.value[0] = active
				sdwCheck.value = active
			}
		)

		// 신통 재개발 레이어 클릭 여부
		watch(
			() => areaStore.isStRebuilt,
			() => {
				const active = areaStore.isStRebuilt
				businessNm.value[1] = active
				if(active && stRebuiltCheck.value) {
					stRebuiltCheck.value = active
					const stRebuiltLayer = WGMap.getLayerById('stRebuiltNo')
					if (stRebuiltLayer) {
						stRebuiltLayer.setVisible(active)
					}
				}
				onSearchNameClick()
				if(active) accordionActive(active)
			}
		)

		// 공공 재개발 레이어 클릭 여부
		watch(
			() => areaStore.isPbRebuilt,
			() => {
				const active = areaStore.isPbRebuilt
				businessNm.value[2] = active
				if(active && pbRebuiltCheck.value) {
					pbRebuiltCheck.value = active
					const pbRebuiltLayer = WGMap.getLayerById('pbRebuiltNo')
					if (pbRebuiltLayer) {
						pbRebuiltLayer.setVisible(active)
					}
				}
				onSearchNameClick()
				if(active) accordionActive(active)
			}
		)

		// 재건축 레이어 클릭 여부
		watch(
			() => areaStore.isReConstruct,
			() => {
				const active = areaStore.isReConstruct
				businessNm.value[3] = active
				if(active && reConstructCheck.value) {
					reConstructCheck.value = active
					const reConstructLayer = WGMap.getLayerById('reConstructNo')
					if (reConstructLayer) {
						reConstructLayer.setVisible(active)
					}
				}
				onSearchNameClick()
				if(active) accordionActive(active)
			}
		)

		// 신통 민간 재건축 레이어 클릭 여부
		watch(
			() => areaStore.isStReConstruct,
			() => {
				const active = areaStore.isStReConstruct
				businessNm.value[4] = active
				if(active && stReConstructCheck.value) {
					stReConstructCheck.value = active
					const stReConstructLayer = WGMap.getLayerById('stReConstructNo')
					if (stReConstructLayer) {
						stReConstructLayer.setVisible(active)
					}
				}
				onSearchNameClick()
				if(active) accordionActive(active)
			}
		)

		// 기타 레이어 클릭 여부
		watch(
			() => areaStore.isAreaEtc,
			() => {
				const active = areaStore.isAreaEtc
				businessNm.value[5] = active
				if(active && areaEtcCheck.value) {
					areaEtcCheck.value = active
					const areaEtcLayer = WGMap.getLayerById('areaEtcNo')
					if (areaEtcLayer) {
						areaEtcLayer.setVisible(active)
					}
				}
				onSearchNameClick()
				if(active) accordionActive(active)
			}
		)

		watch(
			() => toolStore.activeName,
			(name) => {
				if (
					name === 'area' ||
					name === 'distance' ||
					name === 'areaSelection' ||
					name === 'landBuilding' ||
					name === 'areaAnalysis' ||
					name === 'propertyAnalysis' ||
					name === 'Style' ||
					name === 'Point' ||
					name === 'LineString' ||
					name === 'rectangle' ||
					name === 'Polygon' ||
					name === 'circle' ||
					name === 'freehand' ||
					name === 'Text'
				) {
					WGMap.un('singleclick', areaGroupClickEvent)
				} else {
					WGMap.on('singleclick', areaGroupClickEvent)
				}
			}
		)
		const initLayer = async () => {

			sdwLayer = await wgLayers.addLayerWFS('GIS_LT_B_UQ141_SDW', 'sdw', style.getRestrictAreaStyle().sdw, 0.7, 3)
			infoSysLayer = await wgLayers.addLayerWFS('spta:GIS_LSMD_CONT_UQ141', 'infoSys', style.getRestrictAreaStyle().landinfo, 0.7, 4)

			stRebuiltTileLayer = wgLayers.addLayerWMS(`spta:GIS_MST_MNG_REGN_STREBUILT`, 'stRebuilt', 0.7, 5, log.TARGET.STREBUILT);
			bpRebuiltTileLayer = wgLayers.addLayerWMS(`spta:GIS_MST_MNG_REGN_PBREBUILT`, 'pbRebuilt', 0.7, 5, log.TARGET.PBREBUILT);
			reConstructTileLayer = wgLayers.addLayerWMS(`spta:GIS_MST_MNG_REGN_RECONSTRUCT`, 'reConstruct', 0.7, 5, log.TARGET.RECONSTRUCT);
			stReConstructTileLayer = wgLayers.addLayerWMS(`spta:GIS_MST_MNG_REGN_STRECONSTRUCT`, 'stReConstruct', 0.7, 5, log.TARGET.STRECONSTRUCT);
			areaEtcTileLayer = wgLayers.addLayerWMS(`spta:GIS_MST_MNG_REGN_ETC`, 'areaEtc', 0.7, 5, log.TARGET.AREAETC);

			if (
				toolStore.activeName !== 'area' &&
				toolStore.activeName !== 'distance' &&
				toolStore.activeName !== 'areaSelection' &&
				toolStore.activeName !== 'landBuilding' &&
				toolStore.activeName !== 'areaAnalysis' &&
				toolStore.activeName !== 'propertyAnalysis' &&
				toolStore.activeName !== 'Style' &&
				toolStore.activeName !== 'Point' &&
				toolStore.activeName !== 'LineString' &&
				toolStore.activeName !== 'rectangle' &&
				toolStore.activeName !== 'Polygon' &&
				toolStore.activeName !== 'circle' &&
				toolStore.activeName !== 'freehand' &&
				toolStore.activeName !== 'Text'
			) {
				WGMap.on('singleclick', areaGroupClickEvent)
			}
			CommonUtil.log(log.TARGET.AREASDW, log.ACTION.SUCCESS, null)
			CommonUtil.log(log.TARGET.INFOSYS, log.ACTION.SUCCESS, null)
			CommonUtil.log(log.TARGET.STREBUILT, log.ACTION.SUCCESS, null)
			CommonUtil.log(log.TARGET.PBREBUILT, log.ACTION.SUCCESS, null)
			CommonUtil.log(log.TARGET.RECONSTRUCT, log.ACTION.SUCCESS, null)
			CommonUtil.log(log.TARGET.STRECONSTRUCT, log.ACTION.SUCCESS, null)
			CommonUtil.log(log.TARGET.AREAETC, log.ACTION.SUCCESS, null)
		}

		const accordionActive = (active) => {
			const accord = document.getElementById("accordion");
			if(active && !accord.classList.contains("active")) {
				accord.classList.add("active")
			} else if(!active) {
				accord.classList.remove("active")
			}
		}

		const accordionToggle = () => {
			const accord = document.getElementById("accordion");
			accordionActive(!accord.classList.contains("active"))
		}

		const setupLayerVisible = (layerId, checker, layer, visible) => {
			checker.value = visible
			layer.setVisible(visible)
			if(layerId == 'sdw') areaStore.setIsSdw(visible)
			else if(layerId == 'infoSys') areaStore.setIsInfoSys(visible)
			else if(layerId == 'stRebuilt') areaStore.setIsStRebuilt(visible)
			else if(layerId == 'pbRebuilt') areaStore.setIsPbRebuilt(visible)
			else if(layerId == 'reConstruct') areaStore.setIsReConstruct(visible)
			else if(layerId == 'stReConstruct') areaStore.setIsStReConstruct(visible)
			else if(layerId == 'areaEtc') areaStore.setIsAreaEtc(visible)
		}

		const closeDetailPopup = () => {
			isDetailPopupShow.value = false
		}

		const closePopup = () => {
			isPopupShow.value = false
			WGMap.getLayerById('areaGroup').getSource().clear()
		}
		const selectClickedGroup = async (mngGrpCd, param) => {
			isLoading.value = true
			isOverlayClicked.value = true
			isPopupShow.value = true
			areaStore.setClickedGroup(mngGrpCd)
			areaStore.setGroupPopStandMonth(dayjs().format('YYYY-MM'))
			//const { data } = await areaApi.getGeometryListByGroupCd(mngGrpCd)
			const paramsForArea = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: 'spta:GIS_PERM_AREA',
				outputformat: 'application/json',
				format_options: 'CHARSET:EUC-KR',
				cql_filter: `MNG_GRP_CD='${mngGrpCd}'AND IMP_FILE='Y'`,
			}

			const areaObjectInfo = await axios.get('/gis/wfs?' + getParamString(paramsForArea))

			if (areaObjectInfo.data.features.length > 0) {
				const geometry = areaObjectInfo.data.features.map((item) => item.geometry)
				const areaGroupLayer = WGMap.getLayerById('areaGroup')
				if (!areaGroupLayer) {
					const source = new wg.source.Vector()
					selectedLayer = new wg.layer.Vector({
						id: 'areaGroup',
						source: source,
						style: new wg.style.Style({
							stroke: new wg.style.Stroke({
								color: '#ff008e14',
								width: 3,
							}),
						}),
						visible: true,
						zIndex: 6,
					})
					geometry.forEach((geom) => {
						let feature = new wg.format.GeoJSON().readFeature(geom)
						//feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
						source.addFeature(feature)
					})
					WGMap.addLayer(selectedLayer)
					if (param === 'click') {
						//WGMap.getView().fit(source.getExtent())
						wgTools.fitAnim(source.getExtent())
					}
				} else {
					const newVectorSource = new wg.source.Vector()
					geometry.forEach((geom) => {
						let feature = new wg.format.GeoJSON().readFeature(geom)
						//feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
						newVectorSource.addFeature(feature)
					})
					areaGroupLayer.setSource(newVectorSource)
					if (param === 'click') {
						//WGMap.getView().fit(newVectorSource.getExtent())
						wgTools.fitAnim(newVectorSource.getExtent())
					}
				}
			}
			isLoading.value = false
		}

		const removeStat = () => {
			const overlayArray = WGMap.getOverlays().getArray()
			for (let i = 0; i < overlayArray.length; i++) {
				if (!overlayArray[i].id.indexOf('stat')) {
					WGMap.removeOverlay(overlayArray[i])
				}
			}
		}

		const drawChart = () => {
			removeStat()
			groupObject.value = areaStore.searchResult.filter((result) => result.mngGrpCd === areaStore.selectedGroup)
			if (groupObject.value.length > 0) {
				let monthArr = new Array(12)
				let overlayArray = []
				monthArr[11] = areaStore.standMonth.replace('-', '')
				const timeStandard = dayjs(areaStore.standMonth)
				for (let k = 1; k < 12; k++) {
					let prevDate = timeStandard.subtract(k, 'month')
					if (k == 11) {
						monthArr[0] = prevDate.format('YYYYMM')
					} else {
						monthArr[k] = ''
					}
				}

				const dataArray = [
					groupObject.value[0].m1,
					groupObject.value[0].m2,
					groupObject.value[0].m3,
					groupObject.value[0].m4,
					groupObject.value[0].m5,
					groupObject.value[0].m6,
					groupObject.value[0].m7,
					groupObject.value[0].m8,
					groupObject.value[0].m9,
					groupObject.value[0].m10,
					groupObject.value[0].m11,
					groupObject.value[0].m12,
				]

				let subTextContent = ''
				if (areaStore.statType === 'price') {
					subTextContent = '평균가격'
				} else if (areaStore.statType === 'area') {
					subTextContent = '1㎡가격'
				} else if (areaStore.statType === 'volume') {
					subTextContent = '거래량'
				}
				const option = {
					xAxis: {
						type: 'category',
						name: groupObject.value[0].mngGrpNm,
						data: monthArr,
						axisLabel: {
							interval: 0,
						},
						nameLocation: 'middle',
						nameTextStyle: {
							fontSize: 10,
							padding: [5, 0, 0, 0],
						},
					},
					yAxis: {
						axisLabel: {
							show: false, // Y 축 레이블 숨김
						},
						splitLine: {
							show: false,
						},
						type: 'value',
					},
					backgroundColor: 'rgba(255, 255, 255, 0.8)',
					series: [
						{
							data: dataArray,
							type: 'line',
							symbol: function (value, params) {
								if (params.dataIndex == 0 || params.dataIndex == 11) {
									return 'emptyCircle'
								} else {
									return 'none'
								}
							},
							smooth: true,
						},
					],
					title: {
						left: 'center',
						subtext: subTextContent,
						/* subtext: 'test',
						subtextStyle: {
							align: 'center',
							verticalAlign: 'bottom',
						} */
					},
				}
				const element = document.createElement('div')
				element.id = 'areaChart-' + groupObject.value[0].mngGrpCd
				element.style.width = '200px'
				element.style.height = '100px'
				element.onclick = function (event) {
					selectClickedGroup(groupObject.value[0].mngGrpCd)
					//event.stopPropagation()
				}
				//element.style.backgroundColor = 'white'

				const [lon, lat] = wg.proj.transform(
					[groupObject.value[0].lon, groupObject.value[0].lat],
					'EPSG:5186',
					'EPSG:3857'
				)

				const overlay = new wg.Overlay({
					id: 'stat' + groupObject.value[0].mngGrpCd,
					element: element,
					positioning: 'center-center',
					offset: [0, 0],
					stopEvent: false,
					position: [lon, lat],
				})
				overlayArray.push(overlay)
				WGMap.addOverlay(overlay)
				const chart = echarts.init(element)
				chart.setOption(option)
			}
		}

		let searchSggList = computed(() => sggNameArr.value.filter((sgg) => sgg[1].length > 0))
		let isUserArray = computed(() => searchUserArea.value.length > 0)
		let areaArr = ref({
			강동구: [],
			송파구: [],
			강남구: [],
			서초구: [],
			관악구: [],
			동작구: [],
			영등포구: [],
			금천구: [],
			구로구: [],
			강서구: [],
			양천구: [],
			마포구: [],
			서대문구: [],
			은평구: [],
			노원구: [],
			도봉구: [],
			강북구: [],
			성북구: [],
			중랑구: [],
			동대문구: [],
			광진구: [],
			성동구: [],
			용산구: [],
			중구: [],
			종로구: [],
		})

		const onTreeActive = (event) => {
			event.target.parentElement.classList.toggle('active')
			return false
		}
		let sggNameArr = ref([])
		// 사용자 지정 허가 구역
		const userCreateArea = ref([])
		const searchUserArea = ref([])
		/**
		 * 거래공통코드 옵션 목록 조회
		 * @param {string} code
		 */
		const getMangeArea = async (isString) => {
			let businessNmStr
			if (isString === 'init') {
				businessNmStr = '1.공공재개발,2.재건축,3.신통_재개발,4.신통_민간재건축,5.기타'
			} else {
				businessNmStr = isString
			}

			const { data } = await areaApi.getManageArea(businessNmStr)
			userCreateArea.value = data.filter((group) => group.mngKindNm !== '1.토지거래허가구역')
			searchUserArea.value = []

			userCreateArea.value.forEach((area) => {
				if (area.mngGrpNm.indexOf(inputSearchValue.value) == 0) {
					searchUserArea.value.push(area)
				}
			})
		}

		const getSggCode = async () => {
			const { data } = await optionsApi.getSGGOptions()
			sggCodeList.value = data
		}
		/**
		 * 시군구 별 허가구역 list 목록 조회
		 * @param {string} code
		 */
		const getSggList = async () => {
			const businessNmStr = '1.공공재개발,2.재건축,3.신통_재개발,4.신통_민간재건축,5.기타'
			const { data } = await areaApi.getManageSgg('', businessNmStr)
			sggList.value = data

			officialArea.value = data.filter((group) => group.mngKindNm === '1.토지거래허가구역')
			for (let i = 0; i < officialArea.value.length; i++) {
				for (let j = 0; j < sggCodeList.value.length; j++) {
					if (officialArea.value[i].pnu === sggCodeList.value[j].value) {
						const areaObject = new Object()
						areaObject.mngGrpCd = officialArea.value[i].mngGrpCd
						areaObject.mngGrpNm = officialArea.value[i].mngGrpNm
						areaObject.delYn = officialArea.value[i].delYn
						let sggNm = sggCodeList.value[j].text
						areaArr.value[sggNm].push(areaObject)
					}
				}
			}
			sggNameArr.value = Object.entries(areaArr.value)
			areaStore.setListOfSgg(Object.entries(areaArr.value))
		}

		/**
		 * 그룹 get geometry 주소검색리스트 객체 클릭시 동작
		 * @param {*} e
		 */
		const onGroupGeometryClick = async (groupCd, param) => {
			const paramsForArea = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: 'spta:GIS_PERM_AREA',
				outputformat: 'application/json',
				format_options: 'CHARSET:EUC-KR',
				cql_filter: `MNG_GRP_CD='${groupCd}'AND IMP_FILE='Y'`,
			}

			const areaObjectInfo = await axios.get('/gis/wfs?' + getParamString(paramsForArea))
			//const { data } = await areaApi.getGeometryListByGroupCd(groupCd)

			const geometry = areaObjectInfo.data.features.map((item) => item.geometry)
			const areaGroupLayer = WGMap.getLayerById('areaGroup')
			if (!areaGroupLayer) {
				const source = new wg.source.Vector()
				selectedLayer = new wg.layer.Vector({
					id: 'areaGroup',
					source: source,
					style: new wg.style.Style({
						stroke: new wg.style.Stroke({
							color: '#ff008e14',
							width: 3,
						}),
					}),
					visible: true,
					zIndex: 4,
				})
				geometry.forEach((geom) => {
					let feature = new wg.format.GeoJSON().readFeature(geom)
					//feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
					source.addFeature(feature)
				})
				//WGMap.addLayer(selectedLayer)
				//selectedLayerCheck.value = true
				if (param === 'click') {
					//WGMap.getView().fit(source.getExtent())
					wgTools.fitAnim(source.getExtent())
				}
			} else {
				const newVectorSource = new wg.source.Vector()
				geometry.forEach((geom) => {
					let feature = new wg.format.GeoJSON().readFeature(geom)
					//feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
					newVectorSource.addFeature(feature)
				})
				areaGroupLayer.setSource(newVectorSource)
				if (param === 'click') {
					//WGMap.getView().fit(newVectorSource.getExtent())
					wgTools.fitAnim(newVectorSource.getExtent())
				}
			}
		}

		// 구역명 검색어에 맞는 구역 그룹 Li 활성화
		const onSearchNameClick = async () => {
			let businessString = ''
			let count = 0
			for (let i = 1; i < businessNm.value.length; i++) {
				if (businessNm.value[i] && i == 1) {
					businessString += '3.신통_재개발,'
					count++
				}
				if (businessNm.value[i] && i == 2) {
					businessString += '1.공공재개발,'
					count++
				}
				if (businessNm.value[i] && i == 3) {
					businessString += '2.재건축,'
					count++
				}
				if (businessNm.value[i] && i == 4) {
					businessString += '4.신통_민간재건축,'
					count++
				}
				if (businessNm.value[i] && i == 5) {
					if (businessNm.value.length == 1) {
						businessString += '5.기타'
					} else {
						businessString += '5.기타,'
					}

					count++
				}
			}
			const businessNmParam = businessString.slice(0, -1)

			const { data } = await areaApi.getManageSgg(inputSearchValue.value, businessNmParam)
			if (!inputSearchValue.value !== '') {
				isSearch.value = true
			}
			if (inputSearchValue.value === '') {
				isSearch.value = false
			}
			sggList.value = []
			officialArea.value = []

			sggList.value = data

			officialArea.value = data.filter((group) => group.mngKindNm === '1.토지거래허가구역')
			for (let k = 0; k < sggCodeList.value.length; k++) {
				areaArr.value[sggCodeList.value[k].text] = []
			}
			for (let i = 0; i < officialArea.value.length; i++) {
				for (let j = 0; j < sggCodeList.value.length; j++) {
					if (officialArea.value[i].pnu === sggCodeList.value[j].value) {
						const areaObject = new Object()
						areaObject.mngGrpCd = officialArea.value[i].mngGrpCd
						areaObject.mngGrpNm = officialArea.value[i].mngGrpNm
						areaObject.delYn = officialArea.value[i].delYn
						let sggNm = sggCodeList.value[j].text
						areaArr.value[sggNm].push(areaObject)
					}
				}
			}
			sggNameArr.value = Object.entries(areaArr.value)

			getMangeArea(businessNmParam)
			/* searchUserArea.value = []
			userCreateArea.value.forEach((area) => {
				if (area.mngGrpNm.indexOf(inputSearchValue.value) == 0) {
					searchUserArea.value.push(area)
				}
			}) */
		}

		const getParamString = (params) => {
			return Object.keys(params)
				.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
				.join('&')
		}
		// 그룹에 대한 엑셀 다운로드
		const onExcelDownloadClick = async (mngGrpCd, mngGrpNm) => {
			isLoading.value = true
			const { data } = await areaApi.groupDetailExcel(mngGrpCd)

			const url = window.URL.createObjectURL(data)
			var link = document.createElement('a')

			link.href = url
			link.download = mngGrpNm + '.xlsx'
			link.click()
			isLoading.value = false
		}

		// 사업구역을 기준으로 엑셀 다운로드
		const onBizExcelDownloadClick = async (bizNm) => {
			isLoading.value = true
			const { data } = await areaApi.BizDetailExcel(bizNm)

			const url = window.URL.createObjectURL(data)
			var link = document.createElement('a')

			link.href = url
			link.download = bizNm + '.xlsx'
			link.click()
			isLoading.value = false
		}
		// 그룹에 대한 shp 파일 다운로드
		const onShpDownloadClick = (mngGrpCd, mngGrpNm) => {
			const geoserverQuery = `/gis/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&typeNames=GIS_MST_MNG_REGN&outputformat=SHAPE-ZIP&format_options=CHARSET:EUC-KR&srsName=EPSG:4326&`
			const groupPram = `cql_filter=MNG_GRP_CD='${mngGrpCd}'`
			const url = geoserverQuery + groupPram
			const link = document.createElement('a')
			link.style.display = 'none'
			document.body.appendChild(link)
			link.setAttribute('href', encodeURI(url))
			link.setAttribute('download', mngGrpNm)

			link.click()
			document.body.removeChild(link)
		}

		// 허가구역현황 - SDW, 부동산종합공부 두가지 레이어에 대한 SHP 다운로드
		const onShpDownloadLayerClick = (layerName) => {
			const clickLayerName = layerName
			const geoserverQuery = `/gis/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&typeNames=${clickLayerName}&outputformat=SHAPE-ZIP&format_options=CHARSET:EUC-KR&srsName=EPSG:4326`
			const url = geoserverQuery
			const link = document.createElement('a')
			link.style.display = 'none'
			document.body.appendChild(link)
			link.setAttribute('href', encodeURI(url))
			let layerNm
			if (layerName === 'GIS_LT_B_UQ141_SDW') {
				layerNm = '허가구역-SDW'
			} else if (layerName === 'GIS_LSMD_CONT_UQ141') {
				layerNm = '허가구역-부동산종합공부'
			}
			//link.download = layerNm + '.zip'
			link.setAttribute('download', layerNm)

			link.click()
			document.body.removeChild(link)
		}
		/**
		 * 아코디언 이벤트 핸들러
		 * @param {*} e
		 */

		const onAccordionClick2 = (e) => {
			$(e.target).next().slideToggle(200).prev().toggleClass('active')
		}
		const onAccordionClick = (e) => {
			// 여기서 checkboxStates를 확인하여 비활성화 여부를 판단
			const isDisabled = Object.keys(checkboxStates).every((key) => !checkboxStates[key])
			const targetId = e.target.id
			// 비활성화 상태일 경우 클릭 이벤트 무시
			if (isDisabled) {
				console.log('Accordion is disabled.')
				return
			}

			// 활성화 상태일 경우 토글 동작 수행
			const trueCount = Object.values(checkboxStates).filter((value) => value).length
			if (targetId == 'infosys-switch') {
				console.log('infosys-switch clicked')
				accordionActive(false)
				if (trueCount === 0) {
					console.log('all false')
					accordionActive(false)
				} else {
					console.log('true')
					accordionActive(true)
				}
			} else if(targetId == 'accordion') {
				accordionToggle()
			}
		}

		const checkboxStates = {
			st_rebuilt: true,
			pb_rebuilt: true,
			re_construct: true,
			st_reconstruct: true,
			area_etc: true,
		}

		const onAreaCheck = (event) => {
			const elemId = event.target.id
			const isChecked = event.target.checked

			if (elemId === 'sdw') {
				const sdwLayer = WGMap.getLayerById('sdw')
				if (isChecked) {
					areaStore.setIsSdw(true)
					sdwLayer.setVisible(true)
					//로그테이블(허가구역현황(SDW))
					CommonUtil.log(log.TARGET.AREASDW, log.ACTION.CLICK, null)
				} else if (!isChecked) {
					areaStore.setIsSdw(false)
					sdwLayer.setVisible(false)
				}
			} else if (elemId === 'info_sys') {
				const infoSysLayer = WGMap.getLayerById('infoSys')
				if (isChecked) {
					areaStore.setIsInfoSys(true)
					infoSysLayer.setVisible(true)
					//로그테이블(허가구역현황(부동산종합정보시스템))
					CommonUtil.log(log.TARGET.INFOSYS, log.ACTION.CLICK, null)
				} else if (!isChecked) {
					areaStore.setIsInfoSys(false)
					infoSysLayer.setVisible(false)
				}
			}
			if (checkboxStates[elemId] !== undefined) {
				checkboxStates[elemId] = isChecked
				if (elemId === 'st_rebuilt') {
					const stRebuiltLayer = WGMap.getLayerById('stRebuilt')
					if (isChecked) {
						areaStore.setIsStRebuilt(true)
						stRebuiltLayer.setVisible(true)
						//로그테이블(신통재개발)
						CommonUtil.log(log.TARGET.STREBUILT, log.ACTION.CLICK, null)
					} else if (!isChecked) {
						areaStore.setIsStRebuilt(false)
						stRebuiltLayer.setVisible(false)
					}
				} else if (elemId === 'pb_rebuilt') {
					const bpRebuiltLayer = WGMap.getLayerById('pbRebuilt')
					if (isChecked) {
						areaStore.setIsPbRebuilt(true)
						bpRebuiltLayer.setVisible(true)
						//로그테이블(공공재개발)
						CommonUtil.log(log.TARGET.PBREBUILT, log.ACTION.CLICK, null)
					} else if (!isChecked) {
						areaStore.setIsPbRebuilt(false)
						bpRebuiltLayer.setVisible(false)
					}
				} else if (elemId === 're_construct') {
					const reConstructLayer = WGMap.getLayerById('reConstruct')
					if (isChecked) {
						areaStore.setIsReConstruct(true)
						reConstructLayer.setVisible(true)
						//로그테이블(재건축)
						CommonUtil.log(log.TARGET.RECONSTRUCT, log.ACTION.CLICK, null)
					} else if (!isChecked) {
						areaStore.setIsReConstruct(false)
						reConstructLayer.setVisible(false)
					}
				} else if (elemId === 'st_reconstruct') {
					const stReConstructLayer = WGMap.getLayerById('stReConstruct')
					if (isChecked) {
						areaStore.setIsStReConstruct(true)
						stReConstructLayer.setVisible(true)
						//로그테이블(신통 민간 재건축)
						CommonUtil.log(log.TARGET.STRECONSTRUCT, log.ACTION.CLICK, null)
					} else if (!isChecked) {
						areaStore.setIsStReConstruct(false)
						stReConstructLayer.setVisible(false)
					}
				} else if (elemId === 'area_etc') {
					const areaEtcLayer = WGMap.getLayerById('areaEtc')
					if (isChecked) {
						areaStore.setIsAreaEtc(true)
						areaEtcLayer.setVisible(true)
						//로그테이블(기타)
						CommonUtil.log(log.TARGET.AREAETC, log.ACTION.CLICK, null)
					} else if (!isChecked) {
						areaStore.setIsAreaEtc(false)
						areaEtcLayer.setVisible(false)
					}
				}
				const trueCount = Object.values(checkboxStates).filter((value) => value).length
				console.log('true인 체크박스 개수:', trueCount)
				if (Object.values(checkboxStates).filter((value) => value).length == 0) {
					accordionActive(false)
				} else if (Object.values(checkboxStates).filter((value) => value).length != 0) {
					accordionActive(true)
				}
			}
		}

		Object.values(checkboxStates).forEach((isChecked, index) => {
			const checkbox = document.getElementById(Object.keys(checkboxStates)[index])
			if (checkbox) {
				checkbox.checked = isChecked
				checkbox.addEventListener('change', onAreaCheck)
			}
		})

		const onDeleteCheck = (event) => {
			const targetId = event.target.id
			if (targetId === 'sdw-switch') {
				return
			} else if (targetId === 'infosys-switch') {
				if (event.target.checked) {
					isSysinfoShow.value = true
					isDetailPopupShow.value = false
					const areaGroupLayer = WGMap.getLayerById('areaGroup')
					WGMap.removeLayer(areaGroupLayer)
					accordionActive(false)
				} else {
					isSysinfoShow.value = false
					isDetailPopupShow.value = false
					isSearch.value = true
					inputSearchValue.value = ''
					const areaFeatureLayer = WGMap.getLayerById('areaFeatureLayer')
					WGMap.removeLayer(areaFeatureLayer)
					onSearchNameClick()
				}
				return
			} else if (targetId === 'st-rebuilt-switch') {
				const stRebuiltNoLayer = WGMap.getLayerById('stRebuiltNo')
				if (event.target.checked) {
					if (stRebuiltNoLayer) {
						stRebuiltNoLayer.setVisible(true)
					} else {
						stRebuiltNoLayer = wgLayers.addLayerWMS(`spta:GIS_MST_MNG_REGN_STREBUILT_NOUSE`, 'stRebuiltNo', 0.7, 5, null);
					}
				} else {
					stRebuiltNoLayer.setVisible(false)
				}
			} else if (targetId === 'pb-rebuilt-switch') {
				const pbRebuiltNoLayer = WGMap.getLayerById('pbRebuiltNo')
				if (event.target.checked) {
					if (pbRebuiltNoLayer) {
						pbRebuiltNoLayer.setVisible(true)
					} else {
						pbRebuiltNoLayer = wgLayers.addLayerWMS(`spta:GIS_MST_MNG_REGN_PBREBUILT_NOUSE`, 'pbRebuiltNo', 0.7, 5, null);
					}
				} else {
					pbRebuiltNoLayer.setVisible(false)
				}
			} else if (targetId === 're-construct-switch') {
				const reConstructNoLayer = WGMap.getLayerById('reConstructNo')
				if (event.target.checked) {
					if (reConstructNoLayer) {
						reConstructNoLayer.setVisible(true)
					} else {
						reConstructNoLayer = wgLayers.addLayerWMS(`spta:GIS_MST_MNG_REGN_RECONSTRUCT_NOUSE`, 'reConstructNo', 0.7, 5, null);
					}
				} else {
					reConstructNoLayer.setVisible(false)
				}
			} else if (targetId === 'st-reconstruct-switch') {
				const stReConstructNoLayer = WGMap.getLayerById('stReConstructNo')
				if (event.target.checked) {
					if (stReConstructNoLayer) {
						stReConstructNoLayer.setVisible(true)
					} else {
						stReConstructNoLayer = wgLayers.addLayerWMS(`spta:GIS_MST_MNG_REGN_STRECONSTRUCT_NOUSE`, 'stReConstructNo', 0.7, 5, null);
					}
				} else {
					stReConstructNoLayer.setVisible(false)
				}
			} else if (targetId === 'area-etc-switch') {
				const areaEtcNoLayer = WGMap.getLayerById('areaEtcNo')
				if (event.target.checked) {
					if (areaEtcNoLayer) {
						areaEtcNoLayer.setVisible(true)
					} else {
						areaEtcNoLayer = wgLayers.addLayerWMS(`spta:GIS_MST_MNG_REGN_ETC_NOUSE`, 'areaEtcNo', 0.7, 5, null);
					}
				} else {
					areaEtcNoLayer.setVisible(false)
				}
			}
		}

		const reVisibleAreaLayer = () => {
			if (WGMap.getLayerById('wms-15')) {
				layerStore.visible[15] = false
				wms.setVisible('spta', 15, false)
				layerStore.visible[15] = true
				wms.setVisible('spta', 15, true)
			}

			if (WGMap.getLayerById('wms-16')) {
				layerStore.visible[16] = false
				wms.setVisible('spta', 16, false)
				layerStore.visible[16] = true
				wms.setVisible('spta', 16, true)
			}
		}

		const isAdditionalStat = () => {
			isAdditional.value = true
		}

		const closeAdditionPopup = () => {
			console.log('close')
			isAdditional.value = false
		}
		return {
			onGroupGeometryClick,
			onAccordionClick,
			onAccordionClick2,
			onTreeActive,
			onSearchNameClick,
			closeDetailPopup,
			closePopup,
			onExcelDownloadClick,
			onShpDownloadClick,
			selectClickedGroup,
			onAreaCheck,
			onDeleteCheck,
			onBizExcelDownloadClick,
			onShpDownloadLayerClick,
			isAdditionalStat,
			closeAdditionPopup,
			isSearch,
			isUserArray,
			officialArea,
			sggCodeList,
			sggList,
			areaArr,
			sggNameArr,
			userCreateArea,
			menuStore,
			inputSearchValue,
			searchSggList,
			searchUserArea,
			groupObject,
			clickedGroupCd,
			clickedGroupNm,
			isPopupShow,
			isDetailPopupShow,
			isSysinfoShow,
			businessNm,
			sdwCheck,
			stRebuiltCheck,
			pbRebuiltCheck,
			reConstructCheck,
			stReConstructCheck,
			areaEtcCheck,
			topLayer,
			isLoading,
			loadingText,
			lon,
			lat,
			sdwLayerCheck,
			infoSysLayerCheck,
			stRebuiltLayerCheck,
			pbRebuiltLayerCheck,
			reConstructLayerCheck,
			stReconstructLayerCheck,
			areaEtcLayerCheck,
			sdwMenuCheck,
			layerCheckArr,
			checkboxStates,
			isAdditional,
		}
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}
li {
	cursor: pointer;
}
span:hover {
	text-decoration: underline;
}
.addition {
	margin-top: 10px;
	padding: 10px 35px;
	border-radius: 10px;
	font-size: 1.125rem;
	background-color: #1778cc;
	border-color: #606060;
}
/* a.test:hover {
   text-decoration: underline; // 언더라인(아래줄) 스타일 부여
} */
</style>
