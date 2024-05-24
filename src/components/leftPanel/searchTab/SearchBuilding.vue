<template>
	<li :class="{ 'active': active }">
		<a @click="$emit('onActiveChange', 'building')"><span>건물명</span></a>
		<div class="tab-pane">
			<div class="guide-ment"><strong>건물명</strong>으로 검색</div>
			<div class="search-form">
				<div class="keyword">
					<input
						v-model="searchText"
						type="text"
						class="form-control"
						placeholder="검색어(건물명)를 입력하세요"
						@keyup.enter="onSearchClick"
					/>
					<button type="button" class="btn btn-search" @click="onSearchClick"></button>
				</div>
				<!-- <button type="button" class="btn btn-marker"></button> -->
			</div>
			<Spinner v-if="isLoading" style="margin-top: 100%" />
			<div class="result-list">
				<div v-if="searchResult.length === 0" class="none"><span>결과가 없습니다.</span></div>
				<ul v-else>
					<li v-for="(data, index) in searchResult" :key="index" @click="onSearchResultClick(data)">
						<div class="info">
							<strong class="name">{{ data.place_name }}</strong>
							<!-- <span class="type">{{ data.category_name }}</span> -->
							<span class="type">{{ getLastCategory(data.category_name) }}</span>
							<span class="addr">{{ data.address_name }}</span>
						</div>
						<button type="button" class="btn btn-marker"></button>
					</li>
				</ul>
			</div>
			<Pagination
				:currPage="pagination.currPage"
				:countPerPage="pagination.countPerPage"
				:unitPage="pagination.unitPage"
				:totalCount="pagination.totalCount"
				@movePage="movePage"
			/>
		</div>
	</li>
</template>

<script>
// basic
import { ref } from 'vue'
// api
import { $kakao } from '@/api/api.config'
// components
import Pagination from '@/components/Pagination.vue'
import Spinner from '@/components/Spinner.vue'
// stores
import { useOverlayStore } from '@/stores/overlay'
import { useModalStore } from '@/stores/modal'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import axios from 'axios'

export default {
	props: {
		active: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		Pagination,
		Spinner,
	},
	emits: ['onActiveChange'],
	setup() {
		const overlayStore = useOverlayStore()
		const modalStore = useModalStore()
		const log = useLog()

		// 검색어
		let searchText = ref('')
		// 검색결과
		let searchResult = ref([])
		// 로딩
		let isLoading = ref(false)

		// 페이징
		let pagination = ref({
			currPage: 1,
			countPerPage: 10,
			unitPage: 5,
			totalCount: 0,
		})

		// 페이징 초기화
		const resetPagination = () => {
			pagination.value = {
				currPage: 1,
				countPerPage: 10,
				unitPage: 5,
				totalCount: 0,
			}
		}

		// 페이지 이동
		const movePage = (pageNum) => {
			pagination.value.currPage = pageNum
			search()
		}

		// 검색버튼 클릭 or Enter
		const onSearchClick = () => {
			resetPagination() // 페이지 초기화
			search()
		}

		// 검색
		const search = async () => {
			if (searchText.value === '') {
				modalStore.showAlert('검색어를 입력해주세요.')
				return
			}
			isLoading.value = true

			const { currPage, countPerPage } = pagination.value
			pagination.value.totalCount = 0 // 전체 검색 개수 초기화

			const res = await $kakao.get('/v2/local/search/keyword.json', {
				params: {
					page: currPage || 1,
					size: countPerPage,
					sort: 'accuracy',
					query: searchText.value + '서울',
				},
			})
			console.log('kakao', res)

			const { documents, meta, status } = res.data
			isLoading.value = false
			searchResult.value = documents
			pagination.value.totalCount = meta.pageable_count
			//로그테이블(검색-건물명 조회)

			if (res.status === 200) {
				CommonUtil.log(log.TARGET.BUILDING, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.BUILDING, log.ACTION.FAIL, null)
			}
		}

		const getParamString = (params) => {
			return Object.keys(params)
				.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
				.join('&')
		}

		// 검색 결과 선택
		const onSearchResultClick = async (item) => {
			// 오버레이 정보 입력
			overlayStore.mergeState({
				type: '1',
				title: item.place_name,
				category: item.category_name,
				addr: item.address_name,
				lon: item.x,
				lat: item.y,
				isShow: true,
				pnu: '',
				geometries: [],
			})
			let coordinate = wg.proj.fromLonLat([item.x, item.y])

			const params = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: 'spta:GIS_LP_PA_CBND',
				outputformat: 'application/json',
				format_options: 'CHARSET:EUC-KR',
				cql_filter: `contains(SHAPE,Point(${coordinate[0]} ${coordinate[1]}))`,
			}

			const geometryObjectInfo = await axios.get('/gis/wfs?' + getParamString(params))
			const SELECTED_LAYER = 'searchGeometry'

			WGMap.removeLayer(WGMap.getLayerById(SELECTED_LAYER))
			const source = new wg.source.Vector()
			const layer = new wg.layer.Vector({
				id: SELECTED_LAYER,
				source: source,
				style: new wg.style.Style({
					fill: new wg.style.Fill({
						color: 'rgba(255, 255, 0, 0.5)',
						opacity: 0.5,
					}),
					stroke: new wg.style.Stroke({
						color: '#ff0',
						width: 2,
					}),
				}),
				visible: true,
				zIndex: 4,
			})

			geometryObjectInfo.data.features.forEach((d) => {
				let feature = new wg.format.GeoJSON().readFeature(d.geometry)
				source.addFeature(feature)
			})

			WGMap.addLayer(layer)
		}

		// 마지막 카테고리만 표출
		const getLastCategory = (categoryName) => {
			if (categoryName) {
				const parts = categoryName.split('>')
				return parts[parts.length - 1]
			}
			return ''
		}

		return {
			searchText,
			isLoading,
			searchResult,
			pagination,
			movePage,
			onSearchClick,
			onSearchResultClick,
			getLastCategory,
		}
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}

.search .result-list .none {
	margin-top: 250px;
	padding: 10rem 0;
	color: #bbbbbb;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 370px;
}
</style>
