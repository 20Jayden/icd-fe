<template>
	<div class="stat-condition">
		<h2 class="blind">검색조건 패널</h2>
		<a :class="['btn-fold', { 'active': !isFold }]" title="검색조건 펼치기" @click="setFold(false)">
			<span>검색 조건</span>
		</a>
		<div v-show="!isFold" class="content">
			<div class="head">
				<h3>검색 조건</h3>
				<a href="#" class="btn-close" @click="setFold(true)"><span>닫기</span></a>
			</div>
			<div class="body">
				<ul>
					<li>
						<label>자료유형</label>
						<div class="form-group">
							<div class="btn-group">
								<button
									type="button"
									:class="['btn', 'btn-dark', { active: input.dataGbn === 'kab' }]"
									@click="() => (input.dataGbn = 'kab')"
								>
									실거래공개
								</button>
								<button
									v-if="menuStore.rtmsTab === 'RTMS' || userStore.loginUser.auth === 'A'"
									type="button"
									:class="['btn', 'btn-dark', { active: input.dataGbn === 'plcy' }]"
									@click="() => (input.dataGbn = 'plcy')"
								>
									자치구RTMS
								</button>
							</div>
						</div>
					</li>
					<li v-if="input.dataGbn === 'plcy'">
						<label>읍면동단위</label>
						<div class="form-group">
							<div class="btn-group">
								<button
									type="button"
									:class="['btn', 'btn-dark', { active: input.dongGbn === 'bdong' }]"
									@click="() => (input.dongGbn = 'bdong')"
								>
									법정동
								</button>
								<button
									type="button"
									:class="['btn', 'btn-dark', { active: input.dongGbn === 'hdong' }]"
									@click="() => (input.dongGbn = 'hdong')"
								>
									행정동
								</button>
							</div>
						</div>
					</li>
					<li>
						<label
							>분석 유형
							<em>(중복 가능)</em>
						</label>
						<div class="form-group">
							<div class="btn-group">
								<button
									type="button"
									:class="['btn', 'btn-dark', { active: input.rentGbn.includes('1') }]"
									@click="onRentGbnClick('1')"
								>
									전세
								</button>
								<button
									type="button"
									:class="['btn', 'btn-dark', { active: input.rentGbn.includes('2') }]"
									@click="onRentGbnClick('2')"
								>
									월세
								</button>
							</div>
						</div>
					</li>
					<li class="date-list">
						<label>기간유형</label>
						<div class="form-group date">
							<input type="month" class="form-control" v-model="input.startYm" />
							<div class="hyphen">~</div>
							<input type="month" class="form-control" v-model="input.endYm" />
						</div>
					</li>
					<li class="range-list">
						<label>보증금</label>
						<!-- <div class="form-group date">
							<select class="form-control" v-model="input.startRentGtn">
								<option value="">0원</option>
								<option v-for="(item, index) in options.rentGtn" :key="index" :value="item.value">
									{{ item.text }}
								</option>
							</select>
							<div class="hyphen">~</div>
							<select class="form-control" v-model="input.endRentGtn">
								<option v-for="(item, index) in options.rentGtn" :key="index" :value="item.value">
									{{ item.text }}
								</option>
								<option value="">최대</option>
							</select>
						</div> -->
						<div class="form-group">
							<div class="range-group">
								<div slider id="slider-distance">
									<div>
										<div inverse-left v-bind:style="{ width: 100 + '%' }"></div>
										<div inverse-right v-bind:style="{ width: 100 + '%' }"></div>
										<!-- 파란색 -->
										<div
											range
											v-bind:style="{
												left: (input.startRentGtn / rentGtnMaxValue) * 100 + '%',
												right: 100 - (input.endRentGtn / rentGtnMaxValue) * 100 + '%',
											}"
										></div>
										<!-- 동그라미 -->
										<span thumb v-bind:style="{ left: (input.startRentGtn / rentGtnMaxValue) * 100 + '%' }"></span>
										<span thumb v-bind:style="{ left: (input.endRentGtn / rentGtnMaxValue) * 100 + '%' }"></span>
										<!-- 텍스트 -->
										<!-- <div
											sign
											v-bind:style="{
												marginLeft:
													((input.startRentGtn / rentGtnMaxValue) * 100 + (input.endRentGtn / rentGtnMaxValue) * 100) /
														2 -
													17 +
													'%',
											}"
										>
											<span id="value"
												>{{ options.rentGtn[input.startRentGtn].text }} ~
												{{ options.rentGtn[input.endRentGtn].text }}</span
											>
										</div> -->
										<div sign v-bind:style="{ left: (input.startRentGtn / rentGtnMaxValue) * 100 - 6 + '%' }">
											<span id="value">{{ options.rentGtn[input.startRentGtn].text }}</span>
										</div>
										<div sign v-bind:style="[{ left: (input.endRentGtn / rentGtnMaxValue) * 100 + 6 + '%' }]">
											<span id="value">{{ options.rentGtn[input.endRentGtn].text }}</span>
										</div>
									</div>
									<input
										type="range"
										:min="rentGtnMinValue"
										:max="rentGtnMaxValue"
										v-model="input.startRentGtn"
										@input="updateRentGtnRange"
									/>
									<input
										type="range"
										:min="rentGtnMinValue"
										:max="rentGtnMaxValue"
										v-model="input.endRentGtn"
										@input="updateRentGtnRange"
									/>
								</div>
								<ul class="range-text">
									<li>최소</li>
									<li>7천만</li>
									<li>2억5000</li>
									<li>최대</li>
								</ul>
							</div>
						</div>
					</li>
					<li class="range-list">
						<label>월세</label>
						<!-- <div class="form-group date">
							<select class="form-control" v-model="input.startRentFee">
								<option value="">0원</option>
								<option v-for="(item, index) in options.rentFee" :key="index" :value="item.value">
									{{ item.text }}
								</option>
							</select>
							<div class="hyphen">~</div>
							<select class="form-control" v-model="input.endRentFee">
								<option v-for="(item, index) in options.rentFee" :key="index" :value="item.value">
									{{ item.text }}
								</option>
								<option value="">최대</option>
							</select>
						</div> -->
						<div class="form-group">
							<div class="range-group">
								<div slider id="slider-distance">
									<div>
										<div inverse-left v-bind:style="{ width: 100 + '%' }"></div>
										<div inverse-right v-bind:style="{ width: 100 + '%' }"></div>
										<!-- 파란색 -->
										<div
											range
											v-bind:style="{
												left: (input.startRentFee / rentFeeMaxValue) * 100 + '%',
												right: 100 - (input.endRentFee / rentFeeMaxValue) * 100 + '%',
											}"
										></div>
										<!-- 동그라미 -->
										<span thumb v-bind:style="{ left: (input.startRentFee / rentFeeMaxValue) * 100 + '%' }"></span>
										<span thumb v-bind:style="{ left: (input.endRentFee / rentFeeMaxValue) * 100 + '%' }"></span>
										<!-- 텍스트 -->
										<div sign v-bind:style="{ left: (input.startRentFee / rentFeeMaxValue) * 100 - 6 + '%' }">
											<span id="value">{{ options.rentFee[input.startRentFee].text }}</span>
										</div>
										<div sign v-bind:style="{ left: (input.endRentFee / rentFeeMaxValue) * 100 + 6 + '%' }">
											<span id="value">{{ options.rentFee[input.endRentFee].text }}</span>
										</div>
									</div>
									<input type="range" :min="rentFeeMinValue" :max="rentFeeMaxValue" v-model="input.startRentFee" />
									<input type="range" :min="rentFeeMinValue" :max="rentFeeMaxValue" v-model="input.endRentFee" />
								</div>
								<ul class="range-text">
									<li>최소</li>
									<li>40만</li>
									<li>150만</li>
									<li>최대</li>
								</ul>
							</div>
						</div>
					</li>
					<li>
						<label>주택유형</label>
						<div class="form-group">
							<select class="form-control" v-model="input.bldgMuseCd">
								<option value="">전체</option>
								<template v-if="input.dataGbn === 'kab'">
									<option v-for="(item, i) in options.bldgMuseCd.kab" :key="i" :value="item.value">
										{{ item.text }}
									</option>
								</template>
								<template v-else>
									<option v-for="(item, i) in options.bldgMuseCd.plcy" :key="i" :value="item.value">
										{{ item.text }}
									</option>
								</template>
							</select>
						</div>
					</li>
				</ul>
				<div class="action-btn-group">
					<div class="center">
						<button type="button" class="btn btn-dark w-sm" @click="clear()">
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
import dayjs from 'dayjs'
import optionsApi from '@/api/options'
import { rentMonitoring as monitoringApi } from '@/api/monitor'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import { useUserStore } from '@/stores/user'
import { useToolStore } from '@/stores/tool'
import { useMenuStore } from '@/stores/menu'

export default {
	emits: ['search'],
	setup(props, { emit }) {
		const MONITORING_MAP_CENTER = [14132881.28821598, 4518955.77949531]
		const MONITORING_MAP_ZOOM = 12

		const userStore = useUserStore()
		const toolStore = useToolStore()
		const menuStore = useMenuStore()
		const log = useLog()

		let isFold = ref(false)

		let input = reactive({
			dataGbn: 'kab', // 자료구분
			dongGbn: 'bdong', // 동구분 (bdong: 법정동, hdong: 행정동)
			rentGbn: ['1'],
			startRentGtn: 0, // 보증금액 시작
			endRentGtn: 29, // 보증금액 종료
			startRentFee: 0, // 임대료(월세) 시작
			endRentFee: 18, // 임대료(월세) 종료
			// bldgYearGbn: '', // 준공년도
			bldgMuseCd: '', // 건물 용도/주용도 (실거래공개:주용도, 자치구실거래:용도)
		})

		// 자료유형 변경 감지
		watch(
			() => input.dataGbn,
			(newVal, oldVal) => {
				// 주택유형 SELECT 초기화
				input.bldgMuseCd = ''

				// 전월세구분코드 Update
				if (newVal === 'plcy') {
					updateRentGbnForPlcy()
				} else if (newVal === 'kab') {
					updateRentGbnForKab()
				}

				console.log('$ input.dataGbn', input.rentGbn)
			}
		)

		let searchPayload = reactive({
			dataGbn: computed(() => input.dataGbn),
			dongGbn: computed(() => input.dongGbn),
			rentGbn: computed(() => input.rentGbn),
			startYm: computed(() => (dayjs(input.startYm).isValid() ? dayjs(input.startYm).format('YYYYMM') : '')),
			endYm: computed(() => (dayjs(input.endYm).isValid() ? dayjs(input.endYm).format('YYYYMM') : '')),
			startRentGtn: computed(() => options.rentGtn[input.startRentGtn].value),
			endRentGtn: computed(() => options.rentGtn[input.endRentGtn].value),
			startRentFee: computed(() => options.rentFee[input.startRentFee].value),
			endRentFee: computed(() => options.rentFee[input.endRentFee].value),
			// bldgYearGbn: computed(() => input.bldgYearGbn),
			bldgMuseCd: computed(() => input.bldgMuseCd),
		})

		let options = reactive({
			// 보증금 (전세)
			rentGtn: [
				{ value: '', text: '최소' },
				{ value: '50', text: '50만원' },
				{ value: '100', text: '100만원' },
				{ value: '200', text: '200만원' },
				{ value: '300', text: '300만원' },
				{ value: '500', text: '500만원' },
				{ value: '1000', text: '1000만원' },
				{ value: '2000', text: '2000만원' },
				{ value: '3000', text: '3000만원' },
				{ value: '5000', text: '5000만원' },
				{ value: '6000', text: '6000만원' },
				{ value: '7000', text: '7000만원' },
				{ value: '8000', text: '8000만원' },
				{ value: '9000', text: '9000만원' },
				{ value: '10000', text: '1억원' },
				{ value: '12000', text: '1억2000만원' },
				{ value: '15000', text: '1억5000만원' },
				{ value: '17000', text: '1억7000만원' },
				{ value: '20000', text: '2억원' },
				{ value: '25000', text: '2억5000만원' },
				{ value: '30000', text: '3억원' },
				{ value: '35000', text: '3억5000만원' },
				{ value: '40000', text: '4억원' },
				{ value: '50000', text: '5억원' },
				{ value: '70000', text: '7억원' },
				{ value: '100000', text: '10억원' },
				{ value: '120000', text: '12억원' },
				{ value: '150000', text: '15억원' },
				{ value: '200000', text: '20억원' },
				{ value: '', text: '최대' },
			],
			// 임대료 (월세)
			rentFee: [
				{ value: '', text: '최소' },
				{ value: '5', text: '5만원' },
				{ value: '10', text: '10만원' },
				{ value: '20', text: '20만원' },
				{ value: '25', text: '25만원' },
				{ value: '30', text: '30만원' },
				{ value: '35', text: '35만원' },
				{ value: '40', text: '40만원' },
				{ value: '50', text: '50만원' },
				{ value: '60', text: '60만원' },
				{ value: '70', text: '70만원' },
				{ value: '100', text: '100만원' },
				{ value: '150', text: '150만원' },
				{ value: '200', text: '200만원' },
				{ value: '250', text: '250만원' },
				{ value: '300', text: '300만원' },
				{ value: '400', text: '400만원' },
				{ value: '500', text: '500만원' },
				{ value: '', text: '최대' },
			],
			bldgYearGbn: [
				{ value: '', text: '전체' },
				{ value: '1', text: '10년미만' },
				{ value: '2', text: '10년~20년 미만' },
				{ value: '3', text: '20년~30년 미만' },
				{ value: '4', text: '30년 이상' },
			],
			bldgMuseCd: {
				kab: [
					{ value: '01001', text: '단독주택' },
					{ value: '01003', text: '다가구주택' },
					{ value: '02001', text: '아파트' },
					{ value: '02002', text: '연립주택' },
					{ value: '02003', text: '다세대주택' },
					{ value: '14202', text: '오피스텔' },
				], // 주택유형 (실거래 공개)
				plcy: [
					{ value: '1', text: '아파트' },
					{ value: '2', text: '단독' },
					{ value: '3', text: '다가구' },
					{ value: '4', text: '연립' },
					{ value: '5', text: '다세대' },
					{ value: '9', text: '기타' },
				], // 주택유형 (자치구 RMTS)
			},
			useRegnCd: [], // 용도지역코드
			ymGbn: [
				{ value: '1', text: '계약일기준' },
				{ value: '2', text: '신고일기준' },
			],
			commentGbn: [
				{ value: '', text: '전체' },
				{ value: '1', text: '거래확인완료' },
				{ value: '2', text: '미확인' },
			],
			dealGbn: {
				kab: [
					{ value: '', text: '전체' },
					{ value: '001', text: '매매' },
					{ value: '990', text: '분양권' },
				],
				plcy: [
					// { value: '', text: '전체' },
					{ value: '001', text: '매매' },
					{ value: '002', text: '판결' },
					{ value: '003', text: '교환' },
					{ value: '004', text: '증여' },
					{ value: '990', text: '분양권' },
					{ value: '995', text: '대물변재' },
					{ value: '999', text: '기타' },
				],
			},
		})

		const rentGtnMinValue = ref(0) // 매매/보증금 최소값
		const rentGtnMaxValue = ref(options.rentGtn.length - 1) // 매매/보증금 최대값
		const rentFeeMinValue = ref(0) // 월세 최소값
		const rentFeeMaxValue = ref(options.rentFee.length - 1) // 월세 최대값

		onMounted(async () => {
			await userStore.getLoginUser
			/* 주택유형코드 속도이슈 */
			// const { data: plcyCode } = await optionsApi.getRentPlcyBldgMuseOptions() // (자치구) 주택유형코드
			// options.bldgMuseCd.plcy = plcyCode
			// const { data: kabCode } = await optionsApi.getRentKabBldgMuseOptions() // (실거래공개) 주택유형코드
			// options.bldgMuseCd.kab = kabCode
			const { data: useRegnCd } = await optionsApi.getRtmsCodeOptions('USE_REGN_CD') // 용도지역 옵션조회
			options.useRegnCd = useRegnCd

			// const to = dayjs().subtract(1, 'month')
			// const from = dayjs().subtract(1, 'year')
			const from = dayjs().subtract(6, 'month')
			const to = dayjs()
			input.startYm = dayjs(from).format('YYYY-MM')
			input.endYm = dayjs(to).format('YYYY-MM')

			WGMap.getView().setZoom(MONITORING_MAP_ZOOM)
			WGMap.getView().setCenter(MONITORING_MAP_CENTER)
			onSearch()
		})

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
					menuStore.setClickActive(true)
					clearSummaryOverlay()
				}

				if (
					name !== 'area' &&
					name !== 'distance' &&
					name !== 'areaSelection' &&
					name !== 'landBuilding' &&
					name !== 'areaAnalysis' &&
					name !== 'propertyAnalysis' &&
					name !== 'Style' &&
					name !== 'Point' &&
					name !== 'LineString' &&
					name !== 'rectangle' &&
					name !== 'Polygon' &&
					name !== 'circle' &&
					name !== 'freehand' &&
					name !== 'Text' &&
					name === '' &&
					menuStore.clickActive
				) {
					menuStore.setClickActive(false)
					onSearch()
				}
			}
		)

		const clearSummaryOverlay = () => {
			WGMap.getOverlays()
				.getArray()
				.filter((o) => o.options.type === 'monitoring-summary')
				.forEach((o) => WGMap.removeOverlay(o))
		}
		const onSearch = () => {
			emit('search', 1, searchPayload)
			// CommonUtil.log(log.TARGET.MONITORINGRENTSEARCH, log.ACTION.CLICK)
		}

		const setFold = (bool) => {
			isFold.value = bool
		}

		/**
		 * 전월세구분 버튼 클릭
		 * @param {*} value
		 */
		const onRentGbnClick = (value) => {
			if (value === '2') {
				switch (input.dataGbn) {
					case 'plcy':
						toggleRentGbnValue('2')
						break
					case 'kab':
						toggleRentGbnValues(['2', '3', '4'])
						break
				}
			} else {
				toggleRentGbnValue('1')
			}
		}

		/**
		 * (실거래) 전월세 구분 Update
		 */
		const updateRentGbnForKab = () => {
			if (input.rentGbn.includes('2')) {
				;['2', '3', '4'].forEach((value) => {
					if (!input.rentGbn.includes(value)) {
						input.rentGbn.push(value)
					}
				})
			}
		}

		/**
		 * (자치구RTMS) 전월세 구분 Update
		 */
		const updateRentGbnForPlcy = () => {
			if (input.rentGbn.includes('2')) {
				input.rentGbn = input.rentGbn.filter((value) => ['1', '2'].includes(value))
			}
		}

		/**
		 * (실거래) 월세 구분코드 (2,3,4) Toggle
		 * @param {*} values
		 */
		const toggleRentGbnValues = (values) => values.forEach(toggleRentGbnValue)

		/**
		 * 월세 구분코드 단일 Toggle
		 * @param {*} value
		 */
		const toggleRentGbnValue = (value) => {
			const index = input.rentGbn.indexOf(value)
			index !== -1 ? input.rentGbn.splice(index, 1) : input.rentGbn.push(value)
		}

		const BtnClick = () => {
			//로그테이블 전월세 조회 버튼
			CommonUtil.log(log.TARGET.MONITORINGMARKETSEARCH, log.ACTION.CLICK, null)
		}

		const clear = () => {
			const from = dayjs().subtract(6, 'month')
			const to = dayjs()
			input.startYm = dayjs(from).format('YYYY-MM')
			input.endYm = dayjs(to).format('YYYY-MM')
			input.dataGbn = 'kab'
			input.dongGbn = 'bdong'
			input.rentGbn = ['1']
			input.startRentGtn = 0
			input.endRentGtn = 29
			input.startRentFee = 0
			input.endRentFee = 18
			input.bldgMuseCd = ''
			onSearch()
		}

		return {
			userStore,
			isFold,
			setFold,
			input,
			options,
			rentGtnMinValue,
			rentGtnMaxValue,
			rentFeeMinValue,
			rentFeeMaxValue,
			onSearch,
			onRentGbnClick,
			BtnClick,
			clear,
			menuStore,
		}
	},
}
</script>

<style scoped>
.stat-condition .content {
	display: block;
}
.form-group.date [type='month'] {
	width: 82px;
}

/* 기간유형 스타일 수정 */
li:has(div.date) {
	flex-wrap: wrap !important;
}
.date-list > label {
	text-wrap: nowrap;
}
.date {
	margin-top: 10px;
}
.date > input {
	width: 50% !important;
	align-items: center;
}

/* Range 스타일 수정 */
.range-list {
	flex-wrap: wrap !important;
	margin-top: 10px;
}
.range-list > label {
	text-wrap: nowrap;
}
</style>
