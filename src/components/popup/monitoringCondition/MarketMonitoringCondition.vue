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
						<label>매물유형</label>
						<div class="form-group">
							<select class="form-control" v-model="input.estateGbn">
								<option v-for="(item, index) in options.estateGbn" :key="index" :value="item.value">
									{{ item.text }}
								</option>
							</select>
						</div>
					</li>
					<li>
						<label>건물유형</label>
						<div class="form-group">
							<select class="form-control" v-model="input.bldgUseGbn">
								<option v-for="(item, index) in options.bldgUseGbn" :key="index" :value="item.value">
									{{ item.text }}
								</option>
							</select>
						</div>
					</li>
					<li class="date-list">
						<label>준공월 기간 유형</label>
						<div class="form-group date">
							<input type="month" class="form-control" v-model="input.startYm" />
							<div class="hyphen">~</div>
							<input type="month" class="form-control" v-model="input.endYm" />
						</div>
					</li>
					<li class="range-list">
						<label>매매/보증금 금액</label>
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
									<input
										type="range"
										:min="rentFeeMinValue"
										:max="rentFeeMaxValue"
										v-model="input.startRentFee"
										@input="updateRentFeeRange"
									/>
									<input
										type="range"
										:min="rentFeeMinValue"
										:max="rentFeeMaxValue"
										v-model="input.endRentFee"
										@input="updateRentFeeRange"
									/>
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
					<li class="date-list">
						<label>통계 기간 유형</label>
						<div class="form-group date">
							<input type="date" class="form-control" v-model="input.startStatYmd" />
							<div class="hyphen">~</div>
							<input type="date" class="form-control" v-model="input.endStatYmd" />
						</div>
					</li>
				</ul>
				<div class="action-btn-group">
					<div class="center">
						<button type="button" class="btn btn-dark w-sm" @click="clear"><i class="ico ico-reset"></i>초기화</button>
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
import { rtmsMonitoring as monitoringApi } from '@/api/monitor'
import logTableAPI from '@/api/logTable'
import { useUserStore } from '@/stores/user'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'

export default {
	emits: ['search'],
	setup(props, { emit }) {
		const MONITORING_MAP_CENTER = [14132881.28821598, 4518955.77949531]
		const MONITORING_MAP_ZOOM = 12

		const userStore = useUserStore()
		const log = useLog()

		let isFold = ref(false)

		let input = reactive({
			startYm: '', // 기간 시작년월
			endYm: '', // 기간종료년월
			startRentGtn: 0, // 매매/보증금 금액 시작
			endRentGtn: 29, // 매매/보증금 금액 종료
			startRentFee: 0, // 월세 금액 시작
			endRentFee: 18, // 월세 금액 종료
			bldgUseGbn: '', // 건물 용도/주용도 (실거래공개:주용도, 자치구실거래:용도)
			ymGbn: '1', // 조회유형 1:계약일기준, 2:신고일기준
			commentGbn: '', // 담당자확인 '':전체, 1:거래확인완료, 2:미확인
			estateGbn: '', // 거래유형 001매매 990분양권...
			startStatYmd: '',
			endStatYmd: '',
		})

		let searchPayload = reactive({
			estateGbn: computed(() => input.estateGbn),
			bldgUseGbn: computed(() => input.bldgUseGbn),
			startYm: computed(() => (dayjs(input.startYm).isValid() ? dayjs(input.startYm).format('YYYYMM') : '')),
			endYm: computed(() => (dayjs(input.endYm).isValid() ? dayjs(input.endYm).format('YYYYMM') : '')),
			startRentGtn: computed(() => options.rentGtn[input.startRentGtn].value),
			endRentGtn: computed(() => options.rentGtn[input.endRentGtn].value),
			startRentFee: computed(() => options.rentFee[input.startRentFee].value),
			endRentFee: computed(() => options.rentFee[input.endRentFee].value),
			startStatYmd: computed(() =>
				dayjs(input.startStatYmd).isValid() ? dayjs(input.startStatYmd).format('YYYYMMDD') : ''
			),
			endStatYmd: computed(() => (dayjs(input.endStatYmd).isValid() ? dayjs(input.endStatYmd).format('YYYYMMDD') : '')),
		})

		let options = reactive({
			// 매매 / 보증금 금액
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
			// 월세
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
			bldgUseGbn: [
				{ value: '', text: '전체' },
				{ value: 'PRE', text: '분양' },
				{ value: 'JGB', text: '재개발' },
				{ value: 'APT', text: '아파트' },
				{ value: 'ABYG', text: '아파트분양권' },
				{ value: 'JGC', text: '재건축' },
				{ value: 'OBYG', text: '오피스텔분양권' },
				{ value: 'OPST', text: '오피스텔' },
			],
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
			estateGbn: [
				{ value: '', text: '전체' },
				{ value: 'deal', text: '매매' },
				{ value: 'lease', text: '전세' },
				{ value: 'rent', text: '월세' },
			],
		})

		const rentGtnMinValue = ref(0) // 매매/보증금 최소값
		const rentGtnMaxValue = ref(options.rentGtn.length - 1) // 매매/보증금 최대값
		const rentFeeMinValue = ref(0) // 월세 최소값
		const rentFeeMaxValue = ref(options.rentFee.length - 1) // 월세 최대값

		onMounted(async () => {
			await userStore.getLoginUser
			const { data: plcyCode } = await optionsApi.getRtmsCodeOptions('BLDG_USE_CD') // (자치구실거래) 건물용도 옵션 조회
			options.bldgUseGbn.plcy = plcyCode
			const { data: kabCode } = await optionsApi.getKabBldgMuseOptions() // (실거래공개) 건물 주용도코드
			options.bldgUseGbn.kab = kabCode
			const { data: useRegnCd } = await optionsApi.getRtmsCodeOptions('USE_REGN_CD') // 용도지역 옵션조회
			options.useRegnCd = useRegnCd

			const to = dayjs().subtract(1, 'month')
			const from = dayjs('1950-01')
			input.startYm = dayjs(from).format('YYYY-MM')
			input.endYm = dayjs(to).format('YYYY-MM')
			input.startStatYmd = dayjs(dayjs().subtract(1, 'month')).format('YYYY-MM-DD')
			input.endStatYmd = dayjs(dayjs().subtract(0, 'month')).format('YYYY-MM-DD')

			WGMap.getView().setZoom(MONITORING_MAP_ZOOM)
			WGMap.getView().setCenter(MONITORING_MAP_CENTER)
			// console.log('input.startYm', from)
			// console.log('input.startYm', to)
			onSearch()
		})

		const onSearch = () => {
			emit('search', 1, searchPayload)
			//로그테이블(실거래 모니터링 조회)
			logTableAPI.insertMonitoringSearch
		}

		const setFold = (bool) => {
			isFold.value = bool
		}

		const updateRentGtnRange = () => {
			console.log('input.startRentGtn', options.rentGtn[input.startRentGtn].value)
			console.log('input.endRentGtn', options.rentGtn[input.endRentGtn].value)
		}

		const updateRentFeeRange = () => {
			console.log('input.startRentFee', options.rentFee[input.startRentFee].value)
			console.log('input.endRentFee', options.rentFee[input.endRentFee].value)
		}
		//로그
		const BtnClick = () => {
			CommonUtil.log(log.TARGET.MONITORINGMARKETSEARCH, log.ACTION.CLICK, null)
		}

		const clear = () => {
			const to = dayjs().subtract(1, 'month')
			const from = dayjs('1950-01')
			input.startYm = dayjs(from).format('YYYY-MM')
			input.endYm = dayjs(to).format('YYYY-MM')
			input.startStatYmd = dayjs(dayjs().subtract(1, 'month')).format('YYYY-MM-DD')
			input.endStatYmd = dayjs(dayjs().subtract(0, 'month')).format('YYYY-MM-DD')
			input.startRentGtn = 0
			input.endRentGtn = 29
			input.startRentFee = 0
			input.endRentFee = 18
			input.bldgUseGbn = ''
			input.ymGbn = '1'
			input.commentGbn = ''
			input.estateGbn = ''
			console.log('input.startYm', from)
			console.log('input.startYm', to)
			onSearch()
		}

		return {
			userStore,
			isFold,
			setFold,
			input,
			options,
			onSearch,
			rentGtnMinValue,
			rentGtnMaxValue,
			rentFeeMinValue,
			rentFeeMaxValue,
			updateRentGtnRange,
			updateRentFeeRange,
			BtnClick,
			clear,
		}
	},
}
</script>

<style scoped>
.stat-condition .content {
	display: block;
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
