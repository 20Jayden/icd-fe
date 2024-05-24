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
				<!-- 가격 변동률,지수 조회조건 -->
				<ul v-if="activeLayerGbn === 'price'">
					<li>
						<label>통계년월</label>
						<div class="form-group">
							<input type="month" class="form-control" v-model="params[activeLayerGbn].statYmTmp" />
						</div>
					</li>
					<li>
						<label>주택유형</label>
						<div class="form-group">
							<select class="form-control" v-model="params[activeLayerGbn].aptType">
								<option v-for="option in options[activeLayerGbn].aptType" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li>
						<label>거래유형</label>
						<div class="form-group">
							<select class="form-control" v-model="params[activeLayerGbn].trGbn">
								<option v-for="option in options[activeLayerGbn].trGbn" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
				</ul>
				<!-- 실거래 가격 변동률,지수 조회조건 -->
				<ul v-if="activeLayerGbn === 'rtms'">
					<li>
						<label>통계년월</label>
						<div class="form-group">
							<input type="month" class="form-control" v-model="params[activeLayerGbn].statYmTmp" />
						</div>
					</li>
					<li>
						<label>주택유형</label>
						<div class="form-group">
							<select class="form-control" v-model="params[activeLayerGbn].aptType">
								<option v-for="option in options[activeLayerGbn].aptType" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li>
						<label>면적유형</label>
						<div class="form-group">
							<select class="form-control" v-model="params[activeLayerGbn].sizeGbn">
								<option v-for="option in options[activeLayerGbn].sizeGbn" :key="option.value" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<li>
						<label>거래유형</label>
						<div class="form-group">
							<select class="form-control" v-model="params[activeLayerGbn].contractType">
								<option
									v-for="option in options[activeLayerGbn].contractType"
									:key="option.value"
									:value="option.value"
								>
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
				</ul>
				<!-- 아파트 재건축 변동률,지수 조회조건 -->
				<ul v-if="activeLayerGbn === 'aptr'">
					<li>
						<label>통계주</label>
						<div class="form-group">
							<input type="week" class="form-control" v-model="params.aptr.statWkTmp" />
						</div>
					</li>
					<template v-if="activeLayer === 'aptPriceRate'">
						<li v-if="params.aptr.aptrGbn === 'A'">
							<label>비교시점</label>
							<div class="form-group">
								<input type="week" class="form-control" v-model="params.aptr.statCmpWkTmp" />
							</div>
						</li>
						<li>
							<label>주택유형</label>
							<div class="form-group">
								<select
									class="form-control"
									v-model="params.aptr.aptrGbn"
									@change="() => (params.aptr.statCmpWkTmp = '')"
								>
									<option v-for="option in options.aptr.aptrGbn" :key="option.value" :value="option.value">
										{{ option.text }}
									</option>
								</select>
							</div>
						</li>
						<li v-if="params.aptr.aptrGbn === 'A'">
							<label>거래유형</label>
							<div class="form-group">
								<select class="form-control" v-model="params.aptr.contractType">
									<option v-for="option in options.aptr.contractType" :key="option.value" :value="option.value">
										{{ option.text }}
									</option>
								</select>
							</div>
						</li>
					</template>
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
		let isFold = ref(false)

		let activeLayerGbn = computed(() => {
			if (props.activeLayer.startsWith('price')) {
				return 'price'
			} else if (props.activeLayer.startsWith('rtms')) {
				return 'rtms'
			} else {
				return 'aptr'
			}
		})

		let options = reactive({
			// 가격 지수변동 레이어
			price: {
				// 주택유형
				aptType: [
					{ value: '0', text: '종합' },
					{ value: '1', text: '아파트' },
					{ value: '3', text: '연립/다세대' },
					{ value: '7', text: '단독/다가구' },
				],
				// 거래유형
				trGbn: [
					{ value: 'S', text: '매매' },
					{ value: 'D', text: '전세' },
					{ value: 'R', text: '월세' },
					{ value: 'T', text: '전월세통합' },
					{ value: 'R1', text: '월세통합' },
					{ value: 'R3', text: '준월세' },
					{ value: 'R4', text: '준전세' },
				],
			},
			// 실거래 레이어
			rtms: {
				// 주택유형
				aptType: [
					// { value: '0', text: '종합' },
					{ value: '1', text: '아파트' },
					// { value: '3', text: '연립/다세대' },
				],
				// 면적유형
				sizeGbn: [
					{ value: '0', text: '전체' },
					{ value: '1', text: '초소형' },
					{ value: '2', text: '소형' },
					{ value: '3', text: '중소형' },
					{ value: '4', text: '중대형' },
					{ value: '5', text: '대형' },
				],
				contractType: [
					{ value: 'S', text: '매매' },
					{ value: 'D', text: '전세' },
				],
			},
			//아파트 재건축 레이어
			aptr: {
				aptrGbn: [
					{ value: 'A', text: '아파트' },
					{ value: 'R', text: '재건축' },
					{ value: 'G', text: '일반아파트' },
				],
				contractType: [
					{ value: 'S', text: '매매' },
					{ value: 'D', text: '전세' },
				],
			},
		})

		let params = reactive({
			price: {
				statYmTmp: props.latestStatYm,
				statYm: computed(() => params.price.statYmTmp.replace('-', '')),
				aptType: '0', // 주택유형: 종합
				trGbn: 'S', // 거래유형: 매매
				levelNo: '', // 대권역/권역/자치구
			},
			rtms: {
				statYmTmp: props.latestStatYm,
				statYm: computed(() => params.rtms.statYmTmp.replace('-', '')),
				aptType: '1', // 주택유형: 아파트 ---> 기존에는 종합이였다가 데이터 표출로 인하여 임시 수정
				levelNo: '', // 대권역/권역/자치구
				sizeGbn: '0', // (실거래) 면적유형: 전체
				contractType: 'S', // (실거래) 거래유형: 매매
			},
			aptr: {
				statWkTmp: props.latestStatWk,
				statWk: computed(() => params.aptr.statWkTmp.replace('-', '')),
				statCmpWkTmp: '',
				statCmpWk: computed(() => params.aptr.statCmpWkTmp.replace('-', '')),
				aptrGbn: 'A', // A:아파트, R:재건축, G:일반아파트
				contractType: 'S', // S:매매, D:전세
			},
		})

		// onMounted(() => {
		// 	onSearch()
		// 	WGMap.getView().setZoom(12)
		// 	WGMap.getView().setCenter([14132881.28821598, 4518955.77949531])
		// })

		watch(
			() => props.latestStatYm,
			(statYm) => {
				params['price'].statYmTmp = statYm
				params['rtms'].statYmTmp = statYm
			}
		)

		watch(
			() => props.latestStatWk,
			(statWk) => {
				params['aptr'].statWkTmp = statWk
			}
		)

		// watch(
		// 	() => props.activeLayer,
		// 	() => {
		// 		emit('search', params)
		// 	}
		// )

		const onReset = () => {
			Object.assign(
				params,
				reactive({
					price: {
						statYmTmp: props.latestStatYm,
						statYm: computed(() => params.price.statYmTmp.replace('-', '')),
						aptType: '0', // 주택유형: 종합
						trGbn: 'S', // 거래유형: 매매
						levelNo: '', // 대권역/권역/자치구
					},
					rtms: {
						statYmTmp: props.latestStatYm,
						statYm: computed(() => params.rtms.statYmTmp.replace('-', '')),
						aptType: '0', // 주택유형: 종합
						levelNo: '', // 대권역/권역/자치구
						sizeGbn: '0', // (실거래) 면적유형: 전체
						contractType: 'S', // (실거래) 거래유형: 매매
					},
					aptr: {
						statWkTmp: props.latestStatWk,
						statWk: computed(() => params.aptr.statWkTmp.replace('-', '')),
						statCmpWkTmp: '',
						statCmpWk: computed(() => params.aptr.statCmpWkTmp.replace('-', '')),
						aptrGbn: 'A',
						contractType: 'S',
					},
				})
			)
			onSearch()
			console.log('onreset', params)
		}

		const log = useLog()

		const BtnClick = async () => {
			//로그테아블(주택동향 조회버튼)
			if (props.activeLayer == 'priceRate') {
				await CommonUtil.log(log.TARGET.HOUSE_PRICERATE_SEARCH, log.ACTION.CLICK, null)
				console.log('1 검색')
			}
			if (props.activeLayer == 'priceIndex') {
				await CommonUtil.log(log.TARGET.HOUSE_PRICEINDEX_SEARCH, log.ACTION.CLICK, null)
				console.log('2 검색')
			}
			if (props.activeLayer == 'rtmsPriceRate') {
				await CommonUtil.log(log.TARGET.HOUSE_RTMSPRICERATEBYBUILD_SEARCH, log.ACTION.CLICK, null)
				console.log('3 검색')
			}
			if (props.activeLayer == 'rtmsPriceIndex') {
				await CommonUtil.log(log.TARGET.HOUSE_RTMSPRICEINDEX_SEARCH, log.ACTION.CLICK, null)
				console.log('4 검색')
			}
			if (props.activeLayer == 'aptPriceRate') {
				await CommonUtil.log(log.TARGET.HOUSE_APTPRICERATE_SEARCH, log.ACTION.CLICK, null)
				console.log('5 검색')
			}
			if (props.activeLayer == 'rebuildAptPriceRate') {
				await CommonUtil.log(log.TARGET.HOUSE_REBUILDAPTPRICERATE_SEARCH, log.ACTION.CLICK, null)
				console.log('6 검색')
			}
		}

		const onSearch = () => {
			emit('search', params[activeLayerGbn.value])
		}

		const setFold = (bool) => {
			isFold.value = bool
		}

		return {
			activeLayerGbn,
			options,
			params,
			isFold,
			onReset,
			onSearch,
			setFold,
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
