<template>
	<li :class="{ 'active': active }">
		<a @click="$emit('onActiveChange', 'deal')"><span>부동산 거래정보</span></a>
		<div class="tab-pane">
			<div class="search-condition">
				<ul style="margin-bottom: 0px">
					<li>
						<label class="label"><span>자료유형</span></label>
						<div class="form-group">
							<select class="form-control" v-model="input.dataType" @change="onDataTypeChange">
								<option value="">선택</option>
								<option v-for="option in options.dataType" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li>
						<div class="flex">
							<div class="label"><span>시군구</span></div>
							<div class="form-group">
								<template v-if="input.dataType !== 'plcy'">
									<select class="form-control" v-model="input.sggCd" @change="onSggChange">
										<option value="">선택</option>
										<option v-for="option in options.sgg" :key="option.value" :value="option.value">
											{{ option.text }}
										</option>
									</select>
								</template>
								<template v-if="input.dataType === 'plcy'">
									<select class="form-control" v-model="input.sggCd" @change="onSggChange">
										<option v-if="userStore.loginUser.ogdpCd === '11000'" value="">선택</option>
										<option v-for="option in options.rtmsSgg" :key="option.value" :value="option.value">
											{{ option.text }}
										</option>
									</select>
								</template>
							</div>
						</div>
						<div class="flex">
							<div class="label"><span>읍면동</span></div>
							<div class="form-group">
								<select class="form-control" v-model="input.umdCd">
									<option value="">선택</option>
									<option v-for="option in options.umd" :key="option.value" :value="option.value">
										{{ option.text }}
									</option>
								</select>
							</div>
						</div>
					</li>
					<li>
						<div class="custom-control custom-switch">
							<input type="checkbox" class="custom-control-input" id="switch1" v-model="checked.objFinGbn" />
							<label class="label custom-control-label" for="switch1"><span>물건구분</span></label>
						</div>
						<div class="form-group">
							<select class="form-control" v-model="input.objFinGbn">
								<option value="">선택</option>
								<option v-for="option in options.objFinGbn" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li>
						<div class="custom-control custom-switch">
							<input type="checkbox" class="custom-control-input" id="switch2" v-model="checked.dealGbn" />
							<label class="label custom-control-label" for="switch2"><span>거래구분</span></label>
						</div>
						<div class="form-group">
							<select class="form-control" v-model="input.dealGbn">
								<option value="">선택</option>
								<option v-for="option in options.dealGbn" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li>
						<div class="custom-control custom-switch">
							<input type="checkbox" class="custom-control-input" id="switch3" v-model="checked.dealYmd" />
							<label class="label custom-control-label" for="switch3"><span>거래기간</span></label>
						</div>
						<div class="form-group">
							<input type="date" class="form-control mb-10" v-model="input.strDealYmd" />
							<input type="date" class="form-control" v-model="input.endDealYmd" />
						</div>
					</li>
					<li>
						<div class="custom-control custom-switch">
							<input type="checkbox" class="custom-control-input" id="switch4" v-model="checked.useRegnCd" />
							<label class="label custom-control-label" for="switch4"><span>용도지역</span></label>
						</div>
						<div class="form-group">
							<select class="form-control" v-model="input.useRegnCd">
								<option value="">선택</option>
								<option v-for="option in options.useRegnCd" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li>
						<template v-if="input.dataType !== 'plcy'">
							<div class="custom-control custom-switch">
								<input type="checkbox" class="custom-control-input" id="switch5" v-model="checked.bldgUseCd" />
								<label class="label custom-control-label" for="switch5"><span>건물주용도</span></label>
							</div>
							<div class="form-group">
								<select class="form-control" v-model="input.bldgUseCd">
									<option value="">선택</option>
									<option v-for="option in options.bldgMuseCd" :key="option.value" :value="option.value">
										{{ option.text }}
									</option>
								</select>
							</div>
						</template>
						<template v-else>
							<div class="custom-control custom-switch">
								<input type="checkbox" class="custom-control-input" id="switch5" v-model="checked.bldgUseCd" />
								<label class="label custom-control-label" for="switch5"><span>건물용도</span></label>
							</div>
							<div class="form-group">
								<select class="form-control" v-model="input.bldgUseCd">
									<option value="">선택</option>
									<option v-for="option in options.bldgUseCd" :key="option.value" :value="option.value">
										{{ option.text }}
									</option>
								</select>
							</div>
						</template>
					</li>
					<li>
						<div class="search-form">
							<div class="keyword">
								<input v-model="input.bldgNm" type="text" class="form-control" placeholder="건물명을 입력하세요" />
								<!-- <button type="button" class="btn btn-search"></button> -->
							</div>
						</div>
					</li>
				</ul>
				<div class="action-btn-group">
					<div class="center">
						<button type="button" class="btn btn-dark w-sm" @click="clear()">
							<i class="ico ico-reset"></i>초기화
						</button>
						<button type="button" class="btn btn-primary w-sm" @click="onSearchClick(1)">
							<i class="ico ico-search"></i>검색
						</button>
					</div>
				</div>
			</div>
			<div class="result-list">
				<div v-if="list.length === 0" class="none"><span>결과가 없습니다.</span></div>
				<ul v-else>
					<li v-for="(item, index) in list" :key="index">
						<div class="info">
							<strong class="name">{{ item.objTitle }}</strong>
							<span class="type">{{ item.useNm }}</span>
							<span class="addr">{{ item.addr }}</span>
						</div>
						<button type="button" class="btn btn-marker" @click="onLocationClick(item)"></button>
					</li>
				</ul>
			</div>
			<Pagination
				:currPage="pagination.page"
				:countPerPage="pagination.size"
				:unitPage="pagination.unitPage"
				:totalCount="pagination.totalCount"
				@movePage="onSearchClick"
			/>
		</div>
	</li>
	<Loading v-if="isLoading" :title="loadingText.title" :subTitle="loadingText.subTitle" />
</template>

<script>
// basic
import { ref, reactive, watch, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
// api
import optionsApi from '@/api/options'
import searchApi from '@/api/search'
import CommonUtil from '@/api/logTable'
// components
import Pagination from '@/components/Pagination.vue'
import Loading from '@/components/Loading.vue'

// stores
import { useOverlayStore } from '@/stores/overlay'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import { useLog } from '@/stores/log'
import { useMenuStore } from '@/stores/menu'
import axios from 'axios'
import wgTools from '@/composition/wgTools'

export default {
	components: {
		Pagination,
		Loading,
	},
	props: {
		active: {
			type: Boolean,
			default: false,
		},
		onclick: {
			type: String,
		},
	},
	emits: ['onActiveChange'],
	setup(props) {
		const overlayStore = useOverlayStore()
		const modalStore = useModalStore()
		const userStore = useUserStore()
		const menuStore = useMenuStore()
		const log = useLog()
		// 로딩중 여부
		let isLoading = ref(false)

		let loadingText = {
			title: '잠시만 기다려주세요.',
			subTitle: '',
		}

		watch(
			() => props.active,
			() => {
				if (props.active) {
					onUpdateOptions()
				}
			}
		)

		let isEctDept = ref(false) // 타부서여부
		onMounted(async () => {
			await userStore.getLoginUser
			// if (userStore.loginUser.taskTkcgCd == 'AC100') {
			// 	options.dataType = [{ value: 'kab', text: '실거래공개' }]
			// } else {
			// 	options.dataType = [
			// 		{ value: 'kab', text: '실거래공개' },
			// 		{ value: 'plcy', text: '자치구실거래' },
			// 	]
			// }

			getSGGOptions() // 시군구 옵션조회
			options.useRegnCd = await getRtmsDealOptions('USE_REGN_CD') // 용도지역 옵션조회
			options.dealGbn = await getRtmsDealOptions('DEAL_GBN') // 거래구분 옵션조회
			options.objFinGbn = await getRtmsDealOptions('OBJ_FIN_GBN') // 물건구분 옵션조회
			options.bldgUseCd = await getRtmsDealOptions('BLDG_USE_CD') // (자치구실거래) 건물용도 옵션 조회
			const { data } = await optionsApi.getKabBldgMuseOptions() // (실거래공개) 건물주용도  옵션조회
			options.bldgMuseCd = data

			// 스크롤
			$('.side-panel .body').slimScroll({
				height: 'calc(100% - 75px)',
				railVisible: true,
				wheelStep: 50,
				allowPageScroll: false,
				disableFadeOut: false,
			})
		})

		// 검색 결과
		let list = ref([])

		// 페이징 정보
		let pagination = reactive({
			page: 1,
			size: 10,
			unitPage: 5,
			totalCount: 0,
		})

		// 셀렉트 옵션 목록

		let options = reactive({
			dataType: [],
			sgg: [], // 시군구
			rtmsSgg: [], // 자치구 실거래용 시군구
			umd: [], // 읍면동
			objFinGbn: [
				{ value: '1', text: '토지' },
				{ value: '2', text: '건물' },
			], // 물건구분
			dealGbn: [
				{ value: 'RTMS', text: '매매' },
				{ value: 'RENT', text: '전월세' },
			], // 거래구분
			useRegnCd: [], // 용도지역
			bldgUseCd: [], // (자치구실거래) 건물용도
			bldgMuseCd: [], // (실거래공개) 건물주용도
		})

		// 상세검색 체크(on) 여부
		let checked = reactive({
			objFinGbn: false, // 물건구분
			dealGbn: false, // 거래구분
			dealYmd: false, // 거래일자
			useRegnCd: false, // 용도지역
			bldgUseCd: false, // 건물용도
			bldgNm: true, // 건물명
		})

		// 검색조건 입력값
		let input = reactive({
			dataType: '', // 자료유형
			sggCd: '', // 시군구
			umdCd: '', // 읍면동
			objFinGbn: '', // 물건구분
			dealGbn: '', // 거래구분
			strDealYmd: '', // 거래일자 시작일
			endDealYmd: '', // 거래일자 종료일
			useRegnCd: '', // 용도지역
			bldgUseCd: '', // 건물용도
			bldgNm: '', // 건물명
		})

		// 검색조건
		let searchPayload = reactive({
			dataType: computed(() => input.dataType),
			sggCd: computed(() => input.sggCd),
			umdCd: computed(() => input.umdCd),
			objFinGbn: computed(() => input.objFinGbn),
			dealGbn: computed(() => input.dealGbn),
			useRegnCd: computed(() => input.useRegnCd),
			bldgUseCd: computed(() => input.bldgUseCd),
			bldgNm: computed(() => input.bldgNm),
			strDealYmd: computed(() => (dayjs(input.strDealYmd).isValid() ? dayjs(input.strDealYmd).format('YYYYMMDD') : '')),
			endDealYmd: computed(() => (dayjs(input.endDealYmd).isValid() ? dayjs(input.endDealYmd).format('YYYYMMDD') : '')),
		})

		/**
		 * 시군구 옵션 목록 조회
		 */
		const getSGGOptions = async () => {
			await userStore.getLoginUser
			const { data } = await optionsApi.getSGGOptions()
			options.sgg = data
			if (userStore.loginUser.ogdpCd === '11000') {
				options.rtmsSgg = data
			} else {
				options.rtmsSgg = data.filter((sgg) => sgg.value === userStore.loginUser.ogdpCd)
				if (input.dataType === 'plcy') {
					input.sggCd = options.rtmsSgg[0].value
				}
			}
		}

		const onUpdateOptions = () => {
			if (menuStore.rtmsTab === 'RTMS' || userStore.loginUser.auth === 'A') {
				options.dataType = [
					{ value: 'kab', text: '실거래공개' },
					{ value: 'plcy', text: '자치구RTMS' },
				]
			} else {
				options.dataType = [{ value: 'kab', text: '실거래공개' }]
			}
		}

		/**
		 * 읍면동 옵션 목록 조회
		 */
		const getUMDOptions = async () => {
			if (input.sggCd) {
				const { data } = await optionsApi.getUMDOptions(input.sggCd)
				options.umd = data
			} else {
				options.umd = []
			}
		}

		/**
		 * 거래공통코드 옵션 목록 조회
		 * @param {string} code
		 */
		const getRtmsDealOptions = async (code) => {
			const { data } = await optionsApi.getRtmsCodeOptions(code)
			return data
		}

		/**
		 * 시군구 변경 이벤트 핸들러
		 */
		const onSggChange = () => {
			input.umdCd = ''
			getUMDOptions()
		}

		/**
		 * 데이터 타입 (자치구실거래, 실거래공개) 변경 이벤트 핸들러
		 */
		const onDataTypeChange = async () => {
			getSGGOptions()
			input.bldgUseCd = ''
			checked.bldgUseCd = false
		}

		const getParamString = (params) => {
			return Object.keys(params)
				.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
				.join('&')
		}

		/**
		 * 검색 버튼 클릭
		 * @param {*} pageNum
		 */
		const onSearchClick = async (pageNum = 1) => {
			const { dataType, sggCd, umdCd, ...payload } = searchPayload
			console.log('payload', payload)
			if (!dataType) {
				// TODO: layerd popup으로 변경
				modalStore.showAlert('자료유형을 선택해주세요.')
				return
			}
			isLoading.value = true
			list.value = []
			pagination.totalCount = 0
			pagination.page = pageNum

			const checkedPayload = Object.keys(payload)
				.filter((key) => checked[key]) // 상세검색 조건중 체크된 key 필터링
				.reduce((obj, key) => ((obj[key] = payload[key]), obj), {}) // 상세검색조건에서 필터링된 key를 pick한다.

			if (checked.dealYmd) {
				checkedPayload.strDealYmd = payload.strDealYmd
				checkedPayload.endDealYmd = payload.endDealYmd
			}
			console.log(checkedPayload)

			let res
			if (dataType === 'kab') {
				res = await searchApi.getKabList({ sggCd, umdCd, ...checkedPayload }, pagination)
			} else {
				res = await searchApi.getPlcyList({ sggCd, umdCd, ...checkedPayload }, pagination)
			}
			const { data, status } = res

			isLoading.value = false
			list.value = data.contents
			pagination = reactive(Object.assign(pagination, data.pagination))

			console.log(pagination)
			//로그테이블(검색-부동산거래정보 조회)
			if (status.code === 200) {
				CommonUtil.log(log.TARGET.DEAL, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.DEAL, log.ACTION.FAIL, null)
			}
		}

		/**
		 * 위치 버튼 클릭
		 */
		const onLocationClick = async ({ id, dataType }) => {
			isLoading.value = true
			console.log(id)
			let res
			if (dataType === 'kab') {
				res = await searchApi.getKabInfo(id)
			} else {
				res = await searchApi.getPlcyInfo(id)
			}
			const { location, tradeInfo } = res.data

			if (location == null || location == '') {
				modalStore.showAlert('위치 정보가 없습니다')
				isLoading.value = false
			} else {
				const [lon, lat] = wg.proj.transform([location.lon, location.lat], 'EPSG:3857', 'EPSG:4326')
				overlayStore.mergeState({
					type: '1',
					title: tradeInfo.etcAddrBldgnm,
					category: tradeInfo.bldgMuseNm,
					addr: tradeInfo.addr,
					lon: lon,
					lat: lat,
					isShow: true,
					pnu: tradeInfo.landCd,
					geometries: [], //location.geometry,
				})

				const params = {
					service: 'WFS',
					version: '1.0.0',
					request: 'GetFeature',
					typeName: 'spta:GIS_LP_PA_CBND',
					outputformat: 'application/json',
					format_options: 'CHARSET:EUC-KR',
					cql_filter: `contains(SHAPE,Point(${location.lon} ${location.lat}))`,
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
				isLoading.value = false
				WGMap.addLayer(layer)
			}

			// geometry 표시
			//removeSearchLayer()
			//createSearchLayer(data.location.geometry)
		}

		function removeSearchLayer() {
			console.log('removeGeometry2D')
			WGMap.removeLayer(WGMap.getLayerById('searchLayer'))
		}

		function createSearchLayer(geometry) {
			console.log('createPolygon')
			const source = new wg.source.Vector({
				features: new wg.format.GeoJSON().readFeatures(geometry),
			})
			const layer = new wg.layer.Vector({
				id: 'searchLayer',
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
			})
			WGMap.addLayer(layer)
			//WGMap.getView().fit(source.getExtent())
			wgTools.fitAnim(source.getExtent())
		}

		const clear = () => {
			console.log('취소!!')
			input.dataType = ''
			input.sggCd = ''
			input.umdCd = ''
			input.objFinGbn = ''
			input.dealGbn = ''
			input.strDealYmd = ''
			input.endDealYmd = ''
			input.useRegnCd = ''
			input.bldgUseCd = ''
			input.bldgNm = ''

			// Reset checked values
			checked.objFinGbn = false
			checked.dealGbn = false
			checked.dealYmd = false
			checked.useRegnCd = false
			checked.bldgUseCd = false
			checked.bldgNm = true
			list.value = []
			const SELECTED_LAYER = 'searchGeometry'
			WGMap.removeLayer(WGMap.getLayerById(SELECTED_LAYER))
			overlayStore.mergeState({
				type: '1',
				title: 'Title',
				category: 'Category',
				addr: 'Address',
				lon: '',
				lat: '',
				isShow: false,
				pnu: '',
				geometries: [],
			})
		}

		return {
			options,
			input,
			checked,
			list,
			pagination,
			isLoading,
			loadingText,
			userStore,
			onSggChange,
			onDataTypeChange,
			onSearchClick,
			onLocationClick,
			clear,
			menuStore,
			onUpdateOptions,
		}
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}
.search-form {
	width: 250px;
}

.search .result-list .none {
	margin-top: 100px;
	padding: 10rem 0;
	color: #bbbbbb;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 110px;
}
</style>
