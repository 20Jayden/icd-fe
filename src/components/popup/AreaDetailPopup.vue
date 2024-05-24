<template>
	<div
		id="areaGroupPopup4"
		class="layer-popup"
		:class="{ show: isDetailPopupShow }"
		style="top: 100px; left: 50%; width: 800px; z-index: 6"
	>
		<div class="head">
			<div class="tit">허가구역현황(부동산종합공부) 지적추출</div>
			<a class="btn-close" @click="closePoupClick"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<Spinner
				v-if="isLoading"
				style="align-items: center; width: 100px; height: 100px; margin-top: 300px; margin-bottom: 300px"
			/>
			<template v-if="!isLoading">
				<!-- <div class="groupName">{{ groupDetailArr[0].mngGrpNm }}</div> -->
				<div class="tab">
					<ul>
						<li :class="{ active: statTab }" @click="onTabClick($event)">
							<div class="tab-pane">
								<ul>
									<li>
										<div class="tit" style="margin-top: -45px">지적리스트</div>
										<div class="land-list">
											<table class="table data-table hover mb-0">
												<caption>
													지적리스트 정보이며 PNU, 지번, 지목, 면적, 소유자구분코드 정보를 제공합니다.
												</caption>
												<colgroup>
													<col style="width: 300px" />
													<col style="width: 300px" />
													<col style="width: 100px" />
													<col style="width: 100px" />
													<col style="width: 300px" />
												</colgroup>
												<thead>
													<tr>
														<th scope="col">PNU</th>
														<th scope="col">지번</th>
														<th scope="col">지목</th>
														<th scope="col">면적</th>
														<th scope="col">소유자구분</th>
														<th scope="col">공유인수</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="cada in cadaList" :key="cada.pnu" @click="onAreaTrClick($event, cada.pnu)">
														<th scope="row">{{ cada.pnu }}</th>
														<td class="text-left">{{ cada.jibun }}</td>
														<td>{{ cada.jimokNm }}</td>
														<td>{{ cada.space }}</td>
														<td>{{ cada.ownGbnNm }}</td>
														<td>{{ cada.ownPrsnNm }}</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div class="action-btn-group mt-20" style="margin-bottom: 10px">
											<div class="right">
												<button
													type="button"
													class="btn btn-primary"
													@click="onExcelDownClick(areaStore.areaLon, areaStore.areaLat)"
												>
													엑셀 다운로드
												</button>
											</div>
										</div>
									</li>
									<Pagination
										:currPage="pagination.page"
										:countPerPage="pagination.size"
										:unitPage="pagination.unitPage"
										:totalCount="pagination.totalCount"
										v-show="isDetailPopupShow"
										@movePage="getcadaList"
									/>
								</ul>
							</div>
						</li>
					</ul>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import { onMounted, ref, watch, reactive, computed } from 'vue'
import { useAreaStore } from '@/stores/area'
import areaApi from '@/api/area'
import { monitorBottom as BottomListApi } from '@/api/monitor'
import Pagination from '@/components/Pagination.vue'
import Spinner from '@/components/Spinner.vue'
import wgTools from '@/composition/wgTools'

export default {
	components: {
		Pagination,
		Spinner,
	},
	props: {
		isDetailPopupShow: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['closeDetailPopup'],
	setup(props, { emit }) {
		onMounted(async () => {
			await getcadaList()
			$('#areaGroupPopup4').draggable({
				containment: 'body',
				scroll: false,
				handle: '.head',
			})
		})

		const isLoading = ref(false)

		const areaStore = useAreaStore()
		const statTab = ref(true)
		const groupTab = ref(false)
		const cadaList = ref([])

		// 페이징 정보
		let pagination = reactive({
			page: 1,
			size: 20,
			unitPage: 20,
			totalCount: 0,
		})

		watch(
			() => areaStore.areaLon,
			() => {
				getcadaList()
			}
		)

		const closePoupClick = () => {
			const areaFeatureLayer = WGMap.getLayerById('areaFeatureLayer')

			if (areaFeatureLayer) {
				const layerSource = areaFeatureLayer.getSource()
				if (layerSource) {
					layerSource.clear()
				} else {
					// console.error('getSource() does not exist for areaFeatureLayer')
				}
			} else {
				// console.error('areaFeatureLayer does not exist')
			}
			emit('closeDetailPopup')
		}
		const onTabClick = (event) => {
			if (event.target.id === 'statTab') {
				statTab.value = true
				groupTab.value = false
			} else if (event.target.id === 'groupTab') {
				statTab.value = false
				groupTab.value = true
			}
		}

		const getcadaList = async (pageNum = 1) => {
			isLoading.value = true
			pagination.totalCount = 0
			pagination.page = pageNum
			const { data } = await areaApi.getCadaFeatureInfo(areaStore.areaLon, areaStore.areaLat, pagination)
			pagination = reactive(Object.assign(pagination, data.pagination))
			cadaList.value = data.contents
			isLoading.value = false
		}

		const onAreaTrClick = async (event, pnu) => {
			const activeTr = document.querySelectorAll('tr.active')

			for (let i = 0; i < activeTr.length; i++) {
				activeTr[i].classList.remove('active')
			}
			event.target.parentElement.classList.add('active')

			const { data } = await BottomListApi.getGeometryByPnu(pnu)
			let coordiToGeometry
			if (data.geometry.type == 'Polygon') {
				coordiToGeometry = new wg.geom.Polygon(data.geometry.coordinates)
			} else if (data.geometry.type == 'MultiPolygon') {
				coordiToGeometry = new wg.geom.MultiPolygon(data.geometry.coordinates)
			}
			const geometry = data.geometry

			let feature = new wg.format.GeoJSON().readFeature(geometry)
			//WGMap.getView().fit(coordiToGeometry, WGMap.getSize())
			wgTools.fitAnim(coordiToGeometry)
			const areaFeatureLayer = WGMap.getLayerById('areaFeatureLayer')
			if (areaFeatureLayer) {
				areaFeatureLayer.getSource().clear()
				areaFeatureLayer.getSource().addFeature(feature)
			} else {
				const source = new wg.source.Vector()
				const layer = new wg.layer.Vector({
					id: 'areaFeatureLayer',
					source: source,
					style: new wg.style.Style({
						fill: new wg.style.Fill({
							color: 'rgba(0, 255, 0, 0.8)',
						}),
						stroke: new wg.style.Stroke({
							color: 'rgba(255, 0, 0, 1)',
							width: 3,
						}),
					}),
					visible: true,
					zIndex: 15,
				})
				source.addFeature(feature)

				WGMap.addLayer(layer)
			}
		}

		const onExcelDownClick = async (lon, lat) => {
			const { data } = await areaApi.cadaDetailExcel(lon, lat)

			const url = window.URL.createObjectURL(data)
			var link = document.createElement('a')

			link.href = url
			link.download = '지적도추출.xlsx'
			link.click()
		}

		return {
			onTabClick,
			closePoupClick,
			onAreaTrClick,
			onExcelDownClick,
			getcadaList,
			cadaList,
			isLoading,
			statTab,
			groupTab,
			pagination,
			areaStore,
		}
	},
}
</script>

<style scoped>
.layer-popup .body {
	height: 720px;
	/* min-width: 850px; */
}
a {
	cursor: pointer;
}
.average-price {
	height: 200px;
}

.land-list {
	height: auto;
	max-height: 700px;
}

.head {
	cursor: move;
}
.groupName {
	margin-bottom: 15px;
	text-align: center;
	font-size: 20px;
}
</style>
