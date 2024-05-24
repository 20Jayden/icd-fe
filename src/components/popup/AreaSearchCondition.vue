<template>
	<div class="stat-condition">
		<h2 class="blind">검색조건 패널</h2>
		<a class="btn-fold active" title="검색조건 펼치기"><span>검색 조건</span></a>
		<div class="content" style="display: block">
			<div class="head">
				<h3>통계 조건</h3>
				<a class="btn-close"><span>닫기</span></a>
			</div>
			<div class="body">
				<ul>
					<li>
						<label>통계년월</label>
						<div class="form-group date">
							<input type="month" class="form-control" v-model="params.standardDateTmp" />
						</div>
					</li>
					<li>
						<label style="font-size: 0.9rem">자료유형</label>
						<div class="form-group">
							<div class="btn-group">
								<button
									type="button"
									class="btn btn-dark"
									:class="{ active: params.dataOption === 'kab' }"
									@click="onClickOptionChange('kab')"
								>
									실거래공개
								</button>
								<button
									type="button"
									class="btn btn-dark"
									v-if="menuStore.rtmsTab === 'RTMS' || userStore.loginUser.auth === 'A'"
									:class="{ active: params.dataOption === 'rtms' }"
									@click="onClickOptionChange('rtms')"
								>
									자치구RTMS
								</button>
							</div>
						</div>
					</li>
					<li>
						<label>통계유형</label>
						<div class="form-group">
							<div class="btn-group">
								<button
									type="button"
									class="btn btn-dark"
									:class="{ active: params.statType === 'price' }"
									@click="onClickTypeChange('price')"
								>
									평균가격
								</button>
								<button
									type="button"
									class="btn btn-dark"
									:class="{ active: params.statType === 'area' }"
									@click="onClickTypeChange('area')"
								>
									1㎡가격
								</button>
								<button
									type="button"
									class="btn btn-dark"
									:class="{ active: params.statType === 'volume' }"
									@click="onClickTypeChange('volume')"
								>
									거래량
								</button>
							</div>
						</div>
					</li>
					<li>
						<label>통계지도표시</label>
						<div class="form-group">
							<div class="custom-control custom-switch ml-15 mb-5">
								<input type="checkbox" class="custom-control-input" id="switch2" v-model="isStatVisible" />
								<label class="label custom-control-label" for="switch2"></label>
							</div>
						</div>
					</li>
					<li>
						<label>그룹명표시</label>
						<div class="form-group">
							<div class="custom-control custom-switch ml-15 mb-5">
								<input type="checkbox" class="custom-control-input" id="switch3" v-model="isGroupName" />
								<label class="label custom-control-label" for="switch3"></label>
							</div>
						</div>
					</li>
				</ul>
				<div class="action-btn-group">
					<div class="center">
						<button type="button" class="btn btn-dark w-sm" @click="onClickReset()">
							<i class="ico ico-reset"></i>초기화
						</button>
						<button
							type="button"
							class="btn btn-primary w-sm"
							@click="
								() => {
									BtnClick()
									onClickSearchArea()
								}
							"
						>
							<i class="ico ico-search"></i>조회
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Loading v-if="isLoading" :title="loadingText.title" :subTitle="loadingText.subTitle" />
</template>

<script>
import { onMounted, ref, reactive, watch, onUnmounted, computed } from 'vue'
import areaApi from '@/api/area'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { useAreaStore } from '@/stores/area'
import Loading from '@/components/Loading.vue'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import { useUserStore } from '@/stores/user'
import { useMenuStore } from '@/stores/menu'

export default {
	components: {
		Loading,
	},
	emits: ['searchChart', 'showPopUp'],
	setup(props, { emit }) {
		let isLoading = ref(false)

		let loadingText = {
			title: '잠시만 기다려주세요.',
			subTitle: '',
		}
		onMounted(() => {
			addEventHandler()
			onClickSearchArea()
		})

		onUnmounted(() => {
			removeStat()
		})
		const addEventHandler = () => {
			// 레이어팝업
			$('.stat-condition .btn-close').on('click', function () {
				$('.stat-condition .content').hide()
				$('.stat-condition .btn-fold').removeClass('active')
			})
			$('.stat-condition .btn-fold').on('click', function () {
				$('.stat-condition .content').show()
				$('.stat-condition .btn-fold').addClass('active')
			})
		}
		const areaStore = useAreaStore()
		const userStore = useUserStore()
		const menuStore = useMenuStore()
		const searchData = ref([])
		let selectedLayer = null
		let params = reactive({
			standardDateTmp: dayjs().format('YYYY-MM'),
			standardDate: '',
			dataOption: 'kab',
			statType: 'price',
		})

		let isStatVisible = ref(false)
		let isGroupName = ref(false)

		// center 레이어에 대한 소스
		let centSource = null
		// center 레이어
		let centLayer = null

		watch(
			() => isStatVisible.value,
			(statVisible) => {
				if (statVisible) {
					areaStore.setIsChartVisible(statVisible)
					removeStat()
					drawStat()
				} else {
					removeStat()
					areaStore.setIsChartVisible(statVisible)
					WGMap.removeLayer(selectedLayer)
				}
			}
		)

		watch(
			() => isGroupName.value,
			async (isGroupName) => {
				function getText(feature) {
					let text = feature.get('MNG_GRP_NM')
					if (text) {
						return text
					} else {
						return ''
					}
				}

				function textStyle(feature) {
					let style = new wg.style.Style({
						text: new wg.style.Text({
							text: getText(feature),
							font: '12px Arial',
							fill: new wg.style.Fill({
								color: 'black',
							}),
							stroke: new wg.style.Stroke({
								color: 'white',
								width: 2,
							}),
						}),
					})

					return style
				}
				const gropuNameLayer = WGMap.getLayerById('centerGroupName')
				if (isGroupName) {
					if (gropuNameLayer) {
						gropuNameLayer.setVisible(true)
					} else {
						centSource = new wg.source.Vector({
							name: 'cent',
							format: new wg.format.GeoJSON(),
							url: () => {
								return (
									'/gis/wfs' +
									'?service=WFS&' +
									'version=1.1.0&request=GetFeature&typename=spta:GIS_PERM_CENT_GROUPNAME&' +
									'outputFormat=application/json'
								)
							},
						})

						// 토지동향 레이어
						centLayer = await new wg.layer.Vector({
							id: 'centerGroupName',
							source: centSource,
							style: textStyle,
							opacity: 1,
							visible: true,
							zIndex: 11,
						})
						WGMap.addLayer(centLayer)
					}
				} else {
					if (gropuNameLayer) {
						gropuNameLayer.setVisible(false)
					}
				}
			}
		)

		watch(
			() => params.standardDateTmp,
			() => {
				areaStore.setGroupStandMonth(params.standardDateTmp)
			}
		)
		watch(
			() => params.dataOption,
			() => {
				areaStore.setDataOption(params.dataOption)
			}
		)
		watch(
			() => searchData.value,
			() => {
				if (isStatVisible.value) {
					removeStat()
					drawStat()
				}
			}
		)
		const onClickTypeChange = (type) => {
			params.statType = type
		}

		const onClickOptionChange = (option) => {
			params.dataOption = option
		}

		// 초기화
		const onClickReset = () => {
			params.standardDate = dayjs().format('YYYY-MM')
			params.dataOption = 'kab'
			params.statType = 'price'
			params.isStatVisible = false
		}

		// 허가구역 통계 조회
		const onClickSearchArea = async () => {
			isLoading.value = true
			params.standardDate = params.standardDateTmp.replace('-', '')
			const { data } = await areaApi.getAreaSearch(params)
			searchData.value = data
			areaStore.setSearchResult(data)
			areaStore.setStandMonth(params.standardDateTmp)
			areaStore.setStatType(params.statType)
			isLoading.value = false
			//emit('searchChart')
			// CommonUtil.log(log.TARGET.AREASEARCH, log.ACTION.CLICK)
		}

		const selectClickedGroup = async (mngGrpCd) => {
			emit('showPopUp', mngGrpCd)
			/* isOverlayClicked.value = true

			const { data } = await areaApi.getGeometryListByGroupCd(mngGrpCd)
			const geometry = data.map((item) => item.geometry)
			const areaGroupLayer = WGMap.getLayerById('areaGroup')
			if (!areaGroupLayer) {
				const source = new wg.source.Vector()
				selectedLayer = new wg.layer.Vector({
					id: 'areaGroup',
					source: source,
					style: new wg.style.Style({
						fill: new wg.style.Fill({
							color: 'rgba(255, 255, 0)',
							//opacity: 0.5,
						}),
						stroke: new wg.style.Stroke({
							color: '#ff0',
							width: 10,
						}),
					}),
					visible: true,
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
			} */
		}

		const removeStat = () => {
			let count = 10
			while (count > 0) {
				const overlayArray = WGMap.getOverlays().getArray()
				for (let i = 0; i < overlayArray.length; i++) {
					if (overlayArray[i].id && !overlayArray[i].id.indexOf('stat')) {
						WGMap.removeOverlay(overlayArray[i])
					}
				}
				count--
			}
		}
		// 통계지도 Overlay controll
		const drawStat = () => {
			let monthArr = new Array(12)
			let overlayArray = []
			monthArr[11] = params.standardDateTmp.replace('-', '')
			const timeStandard = dayjs(params.standardDateTmp)
			for (let k = 1; k < 12; k++) {
				let prevDate = timeStandard.subtract(k, 'month')
				if (k == 11) {
					monthArr[0] = prevDate.format('YYYYMM')
				} else {
					monthArr[k] = ''
				}
			}
			for (let i = 0; i < searchData.value.length; i++) {
				const dataArray = [
					searchData.value[i].m1,
					searchData.value[i].m2,
					searchData.value[i].m3,
					searchData.value[i].m4,
					searchData.value[i].m5,
					searchData.value[i].m6,
					searchData.value[i].m7,
					searchData.value[i].m8,
					searchData.value[i].m9,
					searchData.value[i].m10,
					searchData.value[i].m11,
					searchData.value[i].m12,
				]
				const firstData = dataArray[0]
				const lastData = dataArray[11]
				let subTextContent = ''
				if (params.statType === 'price') {
					subTextContent = '평균가격'
				} else if (params.statType === 'area') {
					subTextContent = '1㎡가격'
				} else if (params.statType === 'volume') {
					subTextContent = '거래량'
				}
				const option = {
					xAxis: {
						type: 'category',
						name: searchData.value[i].mngGrpNm,
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
					/* ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] */
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
				element.id = 'areaChart-' + i
				element.style.width = '200px'
				element.style.height = '100px'
				element.onclick = function () {
					selectClickedGroup(searchData.value[i].mngGrpCd)
				}
				//element.style.backgroundColor = 'white'

				const [lon, lat] = wg.proj.transform(
					[searchData.value[i].lon, searchData.value[i].lat],
					'EPSG:5186',
					'EPSG:3857'
				)

				const overlay = new wg.Overlay({
					id: 'stat' + searchData.value[i].mngGrpCd,
					element: element,
					positioning: 'center-center',
					offset: [0, 60],
					stopEvent: false,
					position: [lon, lat],
				})

				overlayArray.push(overlay)
				WGMap.addOverlay(overlay)
				const chart = echarts.init(element)
				chart.setOption(option)
			}

			WGMap.on('change:size', function () {
				let mapSize = map.getSize()
				for (let i = 0; i < overlayArray.length; i++) {
					const overlayElement = overlayArray[i].getElement()
					const overlayWidth = overlayElement.offsetWidth
					var overlayHeight = overlayElement.offsetHeight

					overlayElement.style.width = mapSize[0] * 0.2 + 'px'
					overlayElement.style.height = (overlayWidth / overlayHeight) * overlayElement.style.width

					overlayArray[i].updateSize()
				}
			})
		}

		const log = useLog()

		const BtnClick = () => {
			CommonUtil.log(log.TARGET.AREASEARCH, log.ACTION.CLICK, null)
		}
		return {
			isStatVisible,
			searchData,
			onClickTypeChange,
			onClickOptionChange,
			onClickSearchArea,
			onClickReset,
			params,
			isGroupName,
			isLoading,
			loadingText,
			BtnClick,
			userStore,
			menuStore,
		}
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}
</style>
