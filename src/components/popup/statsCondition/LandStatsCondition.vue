<template>
	<div class="stat-condition">
		<h2 class="blind">통계조건 패널</h2>
		<a :class="['btn-fold', { 'active': !isFold }]" title="통계조건 펼치기" @click="setFold(false)">
			<span>통계 조건</span>
		</a>
		<div v-show="!isFold" class="content">
			<div class="head">
				<h3>통계 조건</h3>
				<a class="btn-close" @click="setFold(true)"><span>닫기</span></a>
			</div>
			<div class="body">
				<ul v-if="activeLayerGbn === 'land'">
					<li>
						<label>통계년월</label>
						<div class="form-group">
							<input type="month" class="form-control" v-model="params[activeLayerGbn].statYmTmp" />
						</div>
					</li>
					<li>
						<label>변동률 유형</label>
						<div class="form-group">
							<select class="form-control" v-model="params[activeLayerGbn].dimensionId" @change="onTypeChange($event)">
								<option v-for="option in options[activeLayerGbn].type" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li v-if="step1">
						<label>용도지역</label>
						<div class="form-group">
							<select class="form-control" v-model="params[activeLayerGbn].dimensionCd">
								<option v-for="option in options[activeLayerGbn].giyuk" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li v-if="step2">
						<label>이용상황</label>
						<div class="form-group">
							<select class="form-control" v-model="params[activeLayerGbn].dimensionCd">
								<option v-for="option in options[activeLayerGbn].youngdo" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
				</ul>

				<ul v-if="activeLayerGbn === 'building'">
					<li>
						<label>통계년월</label>
						<div class="form-group">
							<input type="month" class="form-control" v-model="params[activeLayerGbn].statYmTmp" />
						</div>
					</li>
					<li>
						<label>통계 유형</label>
						<div class="form-group">
							<select class="form-control" v-model="params[activeLayerGbn].type">
								<option v-for="option in options[activeLayerGbn].type" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li>
						<label v-if="params[activeLayerGbn].type === '1'">건축물 유형</label>
						<div class="form-group" v-if="params[activeLayerGbn].type === '1'">
							<select class="form-control" v-model="params[activeLayerGbn].dealObj">
								<option
									v-for="option in options[activeLayerGbn].buildingType"
									:key="option.value"
									:value="option.value"
								>
									{{ option.text }}
								</option>
							</select>
						</div>
						<label v-if="params[activeLayerGbn].type === '2'">토지 유형</label>
						<div class="form-group" v-if="params[activeLayerGbn].type === '2'">
							<select class="form-control" v-model="params[activeLayerGbn].dealObj">
								<option v-for="option in options[activeLayerGbn].landType" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li v-if="dealObjGroup !== 'one'">
						<label>변동률 유형</label>
						<div class="form-group" v-if="dealObjGroup === 'four'">
							<select class="form-control" v-model="params[activeLayerGbn].dimensionId">
								<option
									v-for="option in options[activeLayerGbn].buildingdimensionIdFour"
									:key="option.value"
									:value="option.value"
								>
									{{ option.text }}
								</option>
							</select>
						</div>
						<div class="form-group" v-if="dealObjGroup === 'three'">
							<select class="form-control" v-model="params[activeLayerGbn].dimensionId">
								<option
									v-for="option in options[activeLayerGbn].buildingdimensionIdThree"
									:key="option.value"
									:value="option.value"
								>
									{{ option.text }}
								</option>
							</select>
						</div>
						<div class="form-group" v-if="dealObjGroup === 'two'">
							<select class="form-control" v-model="params[activeLayerGbn].dimensionId">
								<option
									v-for="option in options[activeLayerGbn].buildingdimensionIdTwo"
									:key="option.value"
									:value="option.value"
								>
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li v-if="dimensionIdGroup !== 'all'">
						<label>용도 유형</label>
						<div class="form-group" v-if="dimensionIdGroup === 'buldUse'">
							<select class="form-control" v-model="params[activeLayerGbn].dimensionCd">
								<option v-for="option in options[activeLayerGbn].buldUse" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
						<div class="form-group" v-if="dimensionIdGroup === 'jimok'">
							<select class="form-control" v-model="params[activeLayerGbn].dimensionCd">
								<option v-for="option in options[activeLayerGbn].jimok" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
						<div class="form-group" v-if="dimensionIdGroup === 'giyuk'">
							<select class="form-control" v-model="params[activeLayerGbn].dimensionCd">
								<option v-for="option in options[activeLayerGbn].giyuk" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<!--<li v-if="is2">
						<label>이용상황</label>
						<div class="form-group">
							<select class="form-control" v-model="params[activeLayerGbn].dimensionCd">
								<option v-for="option in options[activeLayerGbn].youngdo" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li> -->
				</ul>

				<div class="action-btn-group">
					<div class="center">
						<button type="button" class="btn btn-dark w-sm" @click="onReset">
							<i class="ico ico-reset"></i>초기화
						</button>
						<button
							type="button"
							class="btn btn-primary w-sm"
							@click="
								() => {
									BtnClick()
									onSearch()
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
</template>

<script>
import { onMounted, ref, reactive, watch, computed } from 'vue'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'

export default {
	props: {
		latestStatYm: {
			type: String,
			default: '',
		},
		latestStatWk: {
			type: String,
			default: '',
		},
		activeLayer: {
			type: String,
			default: '',
		},
	},
	emits: ['search'],
	setup(props, { emit }) {
		const step1 = ref(false)
		const step2 = ref(false)

		let isFold = ref(false)

		let activeLayerGbn = computed(() => {
			if (props.activeLayer.startsWith('land')) {
				return 'land'
			} else {
				return 'building'
			}
		})

		let options = reactive({
			// 토지동향 - 지가변동률
			land: {
				type: [
					{ value: 'MEAN', text: '서울시 유형전체 평균변동률' },
					{ value: 'GIYUK', text: '용도지역' },
					{ value: 'YOUNGDO', text: '이용상황' },
				],
				giyuk: [
					{ value: 'GIYUK10', text: '주거' },
					{ value: 'GIYUK20', text: '상업' },
					{ value: 'GIYUK30', text: '공업' },
					{ value: 'GIYUK40', text: '녹지' },
					{ value: 'GIYUK62', text: '보전관리' },
					{ value: 'GIYUK63', text: '생산관리' },
					{ value: 'GIYUK64', text: '계획관리' },
					{ value: 'GIYUK61,GIYUK71,GIYUK81', text: '기타' },
				],
				youngdo: [
					{ value: 'YOUNGDO500', text: '전' },
					{ value: 'YOUNGDO600', text: '답' },
					{ value: 'YOUNGDO100', text: '대-주거용' },
					{ value: 'YOUNGDO200', text: '대-상업용' },
					{ value: 'YOUNGDO700', text: '임야' },
					{ value: 'YOUNGDO400', text: '공장' },
					{ value: 'YOUNGDO990', text: '기타' },
				],
			},
			building: {
				type: [
					{ value: '1', text: '건축물' },
					{ value: '2', text: '토지' },
				],
				buildingType: [
					{ value: '03', text: '건축물거래' },
					{ value: '04', text: '주택거래' },
					{ value: '06', text: '주택매매' },
					{ value: '05', text: '아파트거래' },
					{ value: '07', text: '아파트매매' },
				],
				landType: [
					{ value: '01', text: '토지거래' },
					{ value: '02', text: '순수토지' },
					{ value: '08', text: '토지매매' },
				],
				buildingdimensionIdFour: [
					{ value: 'ALL', text: '전체' },
					{ value: 'BULD_USE', text: '건물용도별' },
					{ value: 'GIYUK', text: '용도별' },
					{ value: 'JIMOK', text: '지목별' },
				],
				buildingdimensionIdThree: [
					{ value: 'ALL', text: '전체' },
					{ value: 'GIYUK', text: '용도별' },
					{ value: 'JIMOK', text: '지목별' },
				],
				buildingdimensionIdTwo: [
					{ value: 'ALL', text: '전체' },
					{ value: 'BULD_USE', text: '건물용도별' },
				],
				buldUse: [
					{ value: 'ALL', text: '합계' },
					{ value: 'BULDUSE11', text: '단독주택' },
					{ value: 'BULDUSE12', text: '다가구주택' },
					{ value: 'BULDUSE13', text: '다세대주택' },
					{ value: 'BULDUSE14', text: '연립주택' },
					{ value: 'BULDUSE15', text: '아파트' },
					{ value: 'BULDUSE20', text: '상업업무용' },
					{ value: 'BULDUSE21', text: '상업업무용오피스' },
					{ value: 'BULDUSE22', text: '상업업무용그외' },
					{ value: 'BULDUSE30', text: '공업용' },
					{ value: 'LIVESUM', text: '주거용소계' },
				],
				giyuk: [
					{ value: 'ALL', text: '합계' },
					{ value: 'GIYUK10', text: '주거지역' },
					{ value: 'GIYUK20', text: '상업지역' },
					{ value: 'GIYUK30', text: '공업지역' },
					{ value: 'GIYUK40', text: '녹지지역' },
					{ value: 'GIYUK61', text: '관리지역' },
					{ value: 'GIYUK62', text: '보전지역' },
					{ value: 'GIYUK63', text: '생산지역' },
					{ value: 'GIYUK64', text: '계획지역' },
					{ value: 'GIYUK71', text: '농림지역' },
					{ value: 'GIYUK81', text: '자연보전지역' },
				],
				jimok: [
					{ value: 'ALL', text: '합계' },
					{ value: 'YOUNGDO100', text: '주거용-대' },
					{ value: 'YOUNGDO200', text: '상업용-대' },
					{ value: 'YOUNGDO400', text: '공장용지' },
					{ value: 'YOUNGDO500', text: '전' },
					{ value: 'YOUNGDO600', text: '답' },
					{ value: 'YOUNGDO700', text: '임야' },
					{ value: 'YOUNGDO990', text: '기타' },
				],
			},
		})

		let params = reactive({
			land: {
				statYmTmp: props.latestStatYm,
				statYm: computed(() => params.land.statYmTmp.replace('-', '')),
				levelNo: '',
				dimensionCd: 'MEAN',
				dimensionId: 'MEAN',
			},
			building: {
				statYmTmp: props.latestStatYm,
				statYm: computed(() => params.building.statYmTmp.replace('-', '')),
				levelNo: '',
				type: '1',
				dealObj: '03',
				dimensionId: 'ALL',
				dimensionCd: 'ALL',
			},
		})

		// onMounted(() => {
		// 	onSearch()
		// 	WGMap.getView().setZoom(12)
		// 	WGMap.getView().setCenter([14132881.28821598, 4518955.77949531])
		// })

		let dealObjGroup = computed(() => {
			if (params['building'].dealObj === '01' || params['building'].dealObj === '03') {
				return 'four'
			} else if (params['building'].dealObj === '08' || params['building'].dealObj === '02') {
				return 'three'
			} else if (params['building'].dealObj === '04' || params['building'].dealObj === '06') {
				return 'two'
			} else {
				return 'one'
			}
		})

		let dimensionIdGroup = computed(() => {
			if (params['building'].dimensionId === 'BULD_USE') {
				return 'buldUse'
			} else if (params['building'].dimensionId === 'GIYUK') {
				return 'giyuk'
			} else if (params['building'].dimensionId === 'JIMOK') {
				return 'jimok'
			} else {
				return 'all'
			}
		})

		watch(
			() => props.latestStatYm,
			(statYm) => {
				params['land'].statYmTmp = statYm
				params['building'].statYmTmp = statYm
			}
		)

		watch(
			() => params['building'].type,
			(type) => {
				if (type === '1') {
					params['building'].dealObj = '03'
				} else {
					params['building'].dealObj = '01'
				}
			}
		)

		watch(
			() => params['land'].dimensionId,
			(dimensionId) => {
				if (dimensionId === 'GIYUK') {
					params['land'].dimensionCd = 'GIYUK10'
				} else if (dimensionId === 'YOUNGDO') {
					params['land'].dimensionCd = 'YOUNGDO500'
				} else {
					params['land'].dimensionCd = 'MEAN'
				}
			}
		)

		watch(
			() => params['building'].dimensionId,
			(dimensionId) => {
				params['building'].dimensionCd = 'ALL'
			}
		)

		watch(
			() => params['building'].dealObj,
			(dealObj) => {
				params['building'].dimensionId = 'ALL'
			}
		)

		const onReset = () => {
			Object.assign(
				params,
				reactive({
					land: {
						statYmTmp: props.latestStatYm,
						statYm: computed(() => params.land.statYmTmp.replace('-', '')),
						levelNo: '',
						dimensionCd: 'MEAN',
						dimensionId: 'MEAN',
					},
					building: {
						statYmTmp: props.latestStatYm,
						statYm: computed(() => params.building.statYmTmp.replace('-', '')),
						levelNo: '',
						type: '1',
						dealObj: '03',
						dimensionId: 'ALL',
						dimensionCd: 'ALL',
					},
				})
			)
			onTypeChange({ target: { value: 'MEAN' } })
			onSearch()
			console.log('onreset', params)
		}

		const onSearch = () => {
			emit('search', params[activeLayerGbn.value])
		}

		const log = useLog()

		const BtnClick = () => {
			if (props.activeLayer == 'landPriceRate') {
				CommonUtil.log(log.TARGET.LAND_LANDPRICERATE_SEARCH, log.ACTION.CLICK, null)
			}
			if (props.activeLayer == 'buildingDealIndex') {
				CommonUtil.log(log.TARGET.LAND_BUILDINGDEALINDEX_SEARCH, log.ACTION.CLICK, null)
			}
		}

		const onTypeChange = (event) => {
			if (event.target.value === 'MEAN') {
				step1.value = false
				step2.value = false
			} else if (event.target.value === 'GIYUK') {
				step1.value = true
				step2.value = false
			} else if (event.target.value === 'YOUNGDO') {
				step1.value = false
				step2.value = true
			}
		}

		const setFold = (bool) => {
			isFold.value = bool
		}

		return {
			step1,
			step2,
			isFold,
			activeLayerGbn,
			options,
			params,
			onReset,
			onSearch,
			setFold,
			onTypeChange,
			dealObjGroup,
			dimensionIdGroup,
			BtnClick,
		}
	},
}
</script>

<style scoped>
.stat-condition .content {
	display: block;
}
a {
	cursor: pointer;
}
</style>
