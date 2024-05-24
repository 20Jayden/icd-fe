<template>
	<div class="stat-condition">
		<h2 class="blind">통계조건 패널</h2>
		<a :class="['btn-fold', { 'active': !isFold }]" title="통계조건 펼치기" @click="setFold(false)">
			<span>통계 조건</span>
		</a>
		<div v-show="!isFold" class="content">
			<div class="head">
				<h3>통계 조건</h3>
				<a href="#" class="btn-close" @click="setFold(true)"><span>닫기</span></a>
			</div>
			<div class="body">
				<!-- 법원경매정보 검색조건 -->
				<ul v-if="activeLayer === 'lawAuction'">
					<li>
						<label>통계년월</label>
						<div class="form-group">
							<input type="month" class="form-control" v-model="params.law.statYmTmp" />
						</div>
					</li>
					<li>
						<label>분석 유형</label>
						<div class="form-group">
							<select class="form-control" v-model="params.law.valueGbn">
								<option v-for="(option, idx) in options.law.valueGbn" :key="idx" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
				</ul>
				<!-- 실거래부동산동향 검색조건 -->
				<ul v-else>
					<li>
						<label>자료 유형</label>
						<div class="form-group">
							<select class="form-control" v-model="params.rtms.dataGbn" @change="() => (params.rtms.statYmGbn = '1')">
								<option value="kab">실거래공개</option>
								<!-- <option v-if="userStore.loginUser.taskTkcgCd !== 'AC100'" value="plcy">자치구RTMS</option> -->
								<option v-if="menuStore.rtmsTab === 'RTMS' || userStore.loginUser.auth === 'A'" value="plcy">
									<!-- <option v-if="menuStore.rtmsTab === 'RTMS'"> -->
									자치구RTMS
								</option>
							</select>
						</div>
					</li>
					<li v-if="activeLayer !== 'rtmsTypeRate'">
						<label>물건 구분</label>
						<div class="form-group">
							<div class="btn-group">
								<button
									type="button"
									:class="['btn', 'btn-dark', { active: params.rtms.objFinGbn === '2' }]"
									@click="() => (params.rtms.objFinGbn = '2')"
								>
									건물
								</button>
								<button
									type="button"
									:class="['btn', 'btn-dark', { active: params.rtms.objFinGbn === '1' }]"
									@click="() => (params.rtms.objFinGbn = '1')"
								>
									토지
								</button>
							</div>
						</div>
					</li>
					<li>
						<label>조회 유형</label>
						<div class="form-group">
							<select class="form-control" v-model="params.rtms.statYmGbn">
								<option value="1">계약일 기준</option>
								<option value="2" v-if="params.rtms.dataGbn === 'plcy'">신고일 기준</option>
							</select>
						</div>
					</li>
					<li v-if="activeLayer !== 'rtmsTypeRate'">
						<label>통계년월</label>
						<div class="form-group">
							<input type="month" class="form-control" v-model="params.rtms.statYmTmp" />
						</div>
					</li>
					<li style="margin-bottom: 5%" v-if="activeLayer === 'rtmsTypeRate'">
						<label>기간 유형</label>
					</li>
					<div class="form-group" v-if="activeLayer === 'rtmsTypeRate'">
						<div style="display: flex; align-items: center; margin-bottom: 5%">
							<input
								type="radio"
								class="form-check-input"
								id="radioOption1"
								v-model="params.rtms.statType"
								:value="'1'"
								@change="changeButton($event)"
							/>
							<label style="white-space: nowrap; margin-right: 15px; padding: 1%; margin-top: 5px; color: #6f6f6f"
								>월 단위</label
							>
							<input type="month" class="form-control" v-model="params.rtms.statYmTmp" />
						</div>
						<div style="display: flex; align-items: center; margin-bottom: 12%">
							<input
								type="radio"
								class="form-check-input"
								id="radioOption2"
								v-model="params.rtms.statType"
								:value="'2'"
								@change="changeButton($event)"
							/>
							<label style="white-space: nowrap; margin-right: 15px; padding: 1%; margin-top: 5px; color: #6f6f6f"
								>주 단위</label
							>
							<input type="week" class="form-control" v-model="params.rtms.statWkTmp" />
						</div>
					</div>
					<li v-if="activeLayer === 'rtmsPriceRate'">
						<label>가격유형</label>
						<div class="form-group">
							<select class="form-control" v-model="params.rtms.valueGbn">
								<option v-for="(option, idx) in options.rtms.valueGbn" :key="idx" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</li>
					<!-- 건물 조회조건 -->
					<template v-if="params.rtms.objFinGbn === '2'">
						<li>
							<label>거래유형</label>
							<div class="form-group">
								<select class="form-control" v-model="params.rtms.trGbn">
									<option v-for="(option, idx) in options.rtms.trGbn" :key="idx" :value="option.value">
										{{ option.text }}
									</option>
								</select>
							</div>
						</li>
						<li>
							<label v-if="activeLayer !== 'rtmsTypeRate'">주택유형</label>
							<label v-if="activeLayer === 'rtmsTypeRate'">건물유형</label>
							<div class="form-group">
								<select class="form-control" v-model="params.rtms.houseGbn">
									<option v-for="(option, idx) in options.rtms.houseGbn" :key="idx" :value="option.value">
										{{ option.text }}
									</option>
								</select>
							</div>
						</li>
						<li v-if="activeLayer !== 'rtmsTypeRate'">
							<label>면적 유형</label>
							<div class="form-group">
								<select class="form-control" v-model="params.rtms.areaGbn">
									<option v-for="(option, idx) in options.rtms.areaGbn" :key="idx" :value="option.value">
										{{ option.text }}
									</option>
								</select>
							</div>
						</li>
						<li v-if="activeLayer !== 'rtmsTypeRate'">
							<label>준공년도 유형</label>
							<div class="form-group">
								<select class="form-control" v-model="params.rtms.bldgYearGbn">
									<option v-for="(option, idx) in options.rtms.bldgYearGbn" :key="idx" :value="option.value">
										{{ option.text }}
									</option>
								</select>
							</div>
						</li>
					</template>
					<!-- 토지 조회조건 -->
					<template v-else>
						<li>
							<label>용도지역</label>
							<div class="form-group">
								<select class="form-control" v-model="params.rtms.useGbn">
									<option v-for="(option, idx) in options.rtms.useGbn" :key="idx" :value="option.value">
										{{ option.text }}
									</option>
								</select>
							</div>
						</li>
						<li>
							<label>지목구분</label>
							<div class="form-group">
								<select class="form-control" v-model="params.rtms.jimokGbn">
									<option v-for="(option, idx) in options.rtms.jimokGbn" :key="idx" :value="option.value">
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
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'
import { useMenuStore } from '@/stores/menu'
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
			if (props.activeLayer === 'lawAuction') {
				return 'law'
			} else {
				return 'rtms'
			}
		})
		const modalStore = useModalStore()
		const userStore = useUserStore()
		const menuStore = useMenuStore()

		onMounted(() => {
			console.log('rtms', menuStore.rtmsTab)
		})
		const initParams = {
			rtms: {
				statYmTmp: props.latestStatYm, // 통계년월
				statWkTmp: props.latestStatWk, // 통계 주
				dataGbn: 'kab', // 자료구분
				objFinGbn: '2', // 물건구분 1:토지, 2:건물
				statYmGbn: '1', // 조회유형 1:계약일기준, 2:신고일기준
				trGbn: 'S', // 거래유형 매매
				houseGbn: '0', // 주택유형 종합
				valueGbn: '1', // 평균가격
				areaGbn: '0', // 면적구분
				bldgYearGbn: '0', // 준공년도
				useGbn: '0',
				jimokGbn: '0',
				pBjdCd: '',
				statType: '1',
			},
			law: {
				statYmTmp: props.latestStatYm, // 통계년월
				valueGbn: '1', // 경매건수
			},
		}

		let options = reactive({
			// 실거래 부동산 동향
			rtms: {
				trGbn: [
					{ value: 'S', text: '매매' },
					{ value: 'D', text: '전세' },
					{ value: 'R', text: '월세' },
					{ value: 'R1', text: '월세통합' },
					{ value: 'R3', text: '준월세' },
					{ value: 'R4', text: '준전세' },
				],
				houseGbn: [
					{ value: '0', text: '종합' },
					{ value: '1', text: '아파트' },
					{ value: '3', text: '연립/다세대' },
					{ value: '7', text: '단독/다가구' },
					{ value: '8', text: '오피스텔' },
					{ value: '9', text: '기타' },
				],
				valueGbn: [
					{ value: '1', text: '평균가격' },
					{ value: '2', text: '평균단위면적가격(㎡)' },
				],
				areaGbn: [
					{ value: '0', text: '전체' },
					{ value: '1', text: '소형' },
					{ value: '2', text: '중형' },
					{ value: '3', text: '대형' },
				],
				bldgYearGbn: [
					{ value: '0', text: '전체' },
					{ value: '1', text: '10년미만' },
					{ value: '2', text: '10년~20년 미만' },
					{ value: '3', text: '20년~30년 미만' },
					{ value: '4', text: '30년 이상' },
				],
				useGbn: [
					{ value: '0', text: '전체' },
					{ value: '1', text: '주거' },
					{ value: '2', text: '상업' },
					{ value: '3', text: '공업' },
					{ value: '4', text: '녹지' },
					{ value: '8', text: '기타' },
				],
				jimokGbn: [
					{ value: '0', text: '전체' },
					{ value: '1', text: '전' },
					{ value: '2', text: '답' },
					{ value: '3', text: '대' },
					{ value: '5', text: '임야' },
					{ value: '6', text: '공장' },
					{ value: '8', text: '도로' },
					{ value: '7', text: '기타' },
				],
				statType: [
					{ value: '1', text: '월 단위' },
					{ value: '2', text: '주 단위' },
				],
			},
			// 법원 경매 정보
			law: {
				valueGbn: [
					{ value: '1', text: '경매건수' },
					{ value: '2', text: '매각건수' },
					{ value: '3', text: '매각가율' },
				],
			},
		})

		// Shallow Copy
		let params = reactive({
			rtms: { ...initParams.rtms },
			law: { ...initParams.law },
		})

		onMounted(() => {
			console.log('props Ym', props.latestStatYm)
			console.log('props week', props.latestStatWk)
			// onSearch()
		})

		// 라디오 버튼을 통해 date확인
		// const changeButton = (event) => {
		// 	console.log('옵션 ', event.target.value)
		// 	console.log('기간유형 데이터 확인', params.rtms.statType)
		// 	console.log('주 단위', params.rtms.statWkTmp)
		// 	console.log('대체..?', params.rtms.statWkTmp.replace('-', ''))
		// }
		const changeButton = (event) => {
			console.log('옵션 ', event.target.value)
			console.log('기간유형 데이터 확인', params.rtms.statType)
			console.log('주 단위', params.rtms.statWkTmp)
		}

		watch(
			() => props.latestStatYm,
			(statYm) => {
				console.log('날짜변경', statYm)
				params.rtms.statYmTmp = statYm
			}
		)

		watch(
			() => props.latestStatWk,
			(statWk) => {
				params.rtms.statWkTmp = statWk
				console.log('주차변경', statWk)
			}
		)

		//통계 조건에서 DB 기준 최신 날짜 보다 앞서는 날짜를 선택하는 경우를 watch
		watch(
			() => params.law.statYmTmp,
			(statYmTmp) => {
				const selectedYmNum = Number(statYmTmp.replace('-', ''))
				const latestStatYmNum = Number(props.latestStatYm.replace('-', ''))
				const yearStr = props.latestStatYm.substring(0, 4)
				let montStr
				if (props.latestStatYm[5] === '0') {
					montStr = props.latestStatYm.substring(6)
				} else {
					montStr = props.latestStatYm.substring(5)
				}

				if (selectedYmNum > latestStatYmNum) {
					modalStore.showAlert('법원 경매 현황 통계 최근 데이터 기준 월은 ' + yearStr + '년 ' + montStr + '월 입니다.')
					params.law.statYmTmp = props.latestStatYm
					return
				}
			}
		)
		const onReset = () => {
			// Shallow Copy
			// Object.assign(params, {
			// 	rtms: { ...initParams.rtms },
			// 	law: { ...initParams.law },
			// })
			// Object.assign(params, {... initParams })
			Object.assign(
				params,
				reactive({
					rtms: {
						statYmTmp: props.latestStatYm, // 통계년월
						statWkTmp: props.latestStatWk, // 통계 주
						dataGbn: 'kab', // 자료구분
						objFinGbn: '2', // 물건구분 1:토지, 2:건물
						statYmGbn: '1', // 조회유형 1:계약일기준, 2:신고일기준
						trGbn: 'S', // 거래유형 매매
						houseGbn: '0', // 주택유형 종합
						valueGbn: '1', // 평균가격
						areaGbn: '0', // 면적구분
						bldgYearGbn: '0', // 준공년도
						useGbn: '0',
						jimokGbn: '0',
						pBjdCd: '',
						statType: '1',
						statWk: computed(() => params.rtms.statWkTmp.replace('-', '')),
					},
					law: {
						statYmTmp: props.latestStatYm, // 통계년월
						valueGbn: '1', // 경매건수
					},
				})
			)
			onSearch()
		}

		const onSearch = () => {
			emit('search', params[activeLayerGbn.value])
		}

		const log = useLog()

		const BtnClick = () => {
			//로그테이블 실거래 부동산 조회버튼
			if (props.activeLayer == 'rtmsPriceRate') {
				CommonUtil.log(log.TARGET.RTMS_RTMSPRICERATE_SEARCH, log.ACTION.CLICK, null)
			}
			if (props.activeLayer == 'rtmsTradeRate') {
				CommonUtil.log(log.TARGET.RTMS_RTMSTRADERATE_SEARCH, log.ACTION.CLICK, null)
			}
			if (props.activeLayer == 'lawAuction') {
				CommonUtil.log(log.TARGET.RTMS_LAWACTION_SEARCH, log.ACTION.CLICK, null)
			}
		}

		const setFold = (bool) => {
			isFold.value = bool
		}

		return {
			options,
			params,
			isFold,
			activeLayerGbn,
			userStore,
			setFold,
			onReset,
			onSearch,
			BtnClick,
			menuStore,
			changeButton,
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
