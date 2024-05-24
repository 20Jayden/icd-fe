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
						<label
							>읍면동단위
							<!--<em>(중복 가능)</em>-->
						</label>
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
							<!--<em>(중복 가능)</em>-->
						</label>
						<div class="form-group">
							<div class="btn-group">
								<!-- <select class="form-control" v-model="input.objFinGbn">
									<option value="">전체</option>
									<option value="2">건물</option>
									<option value="1">토지</option>
								</select> -->
								<button
									type="button"
									:class="['btn', 'btn-dark', { active: input.objFinGbn === '2' }]"
									@click="() => (input.objFinGbn = '2')"
								>
									건물
								</button>
								<button
									type="button"
									:class="['btn', 'btn-dark', { active: input.objFinGbn === '1' }]"
									@click="() => (input.objFinGbn = '1')"
								>
									토지
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
						<label>거래금액</label>
						<!-- <div class="form-group date">
							<select class="form-control" v-model="input.startObjAmt">
								<option value="">0원</option>
								<option v-for="(item, index) in options.objAmt" :key="index" :value="item.value">
									{{ item.text }}
								</option>
							</select>
							<div class="hyphen">~</div>
							<select class="form-control" v-model="input.endObjAmt">
								<option v-for="(item, index) in options.objAmt" :key="index" :value="item.value">
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
												left: (input.startObjAmt / objAmtMaxValue) * 100 + '%',
												right: 100 - (input.endObjAmt / objAmtMaxValue) * 100 + '%',
											}"
										></div>
										<!-- 동그라미 -->
										<span thumb v-bind:style="{ left: (input.startObjAmt / objAmtMaxValue) * 100 + '%' }"></span>
										<span thumb v-bind:style="{ left: (input.endObjAmt / objAmtMaxValue) * 100 + '%' }"></span>
										<!-- 텍스트 -->
										<div sign v-bind:style="{ left: (input.startObjAmt / objAmtMaxValue) * 100 - 6 + '%' }">
											<span id="value">{{ options.objAmt[input.startObjAmt].text }}</span>
										</div>
										<div sign v-bind:style="{ left: (input.endObjAmt / objAmtMaxValue) * 100 + 6 + '%' }">
											<span id="value">{{ options.objAmt[input.endObjAmt].text }}</span>
										</div>
									</div>
									<input type="range" :min="objAmtMinValue" :max="objAmtMaxValue" v-model="input.startObjAmt" />
									<input type="range" :min="objAmtMinValue" :max="objAmtMaxValue" v-model="input.endObjAmt" />
								</div>
								<ul class="range-text">
									<li>최소</li>
									<li>1억5000</li>
									<li>3억5000</li>
									<li>최대</li>
								</ul>
							</div>
						</div>
					</li>
					<template v-if="input.objFinGbn === '2'">
						<li>
							<label>준공년도</label>
							<div class="form-group">
								<select class="form-control" v-model="input.bldgYearGbn">
									<option v-for="(item, i) in options.bldgYearGbn" :key="i" :value="item.value">{{ item.text }}</option>
								</select>
							</div>
						</li>
						<li v-if="input.dataGbn === 'kab'">
							<label>건물주용도</label>
							<div class="form-group">
								<select class="form-control" v-model="input.bldgUseGbn">
									<option value="">전체</option>
									<option v-for="(item, i) in options.bldgUseGbn.kab" :key="i" :value="item.value">
										{{ item.text }}
									</option>
								</select>
							</div>
						</li>
						<li v-else>
							<label>건물용도</label>
							<div class="form-group">
								<select class="form-control" v-model="input.bldgUseGbn">
									<option value="">전체</option>
									<option v-for="(item, i) in options.bldgUseGbn.plcy" :key="i" :value="item.value">
										{{ item.text }}
									</option>
								</select>
							</div>
						</li>
					</template>
					<template v-else>
						<li>
							<label>용도지역</label>
							<div class="form-group">
								<select class="form-control" v-model="input.useRegnCd">
									<option value="">전체</option>
									<option v-for="(item, i) in options.useRegnCd" :key="i" :value="item.value">{{ item.text }}</option>
								</select>
							</div>
						</li>
					</template>
					<li v-if="input.dataGbn === 'plcy'">
						<label>조회유형</label>
						<div class="form-group">
							<select class="form-control" v-model="input.ymGbn">
								<option v-for="(item, i) in options.ymGbn" :key="i" :value="item.value">{{ item.text }}</option>
							</select>
						</div>
					</li>
					<li v-if="input.dataGbn === 'kab'">
						<label>거래유형</label>
						<div class="form-group">
							<!-- 자치구RTMS 거래유형 조건 삭제
							<select class="form-control" v-model="input.dealGbn" style="height: 43px" multiple>
								<option v-for="(item, i) in options.dealGbn[input.dataGbn]" :key="i" :value="item.value">
									{{ item.text }}
								</option>
							</select>
							-->
							<select class="form-control" v-model="input.dealGbn">
								<option v-for="(item, i) in options.dealGbn['kab']" :key="i" :value="item.value">
									{{ item.text }}
								</option>
							</select>
						</div>
					</li>
					<li>
						<label>담당자확인</label>
						<div class="form-group">
							<select class="form-control" v-model="input.commentGbn">
								<option v-for="(item, i) in options.commentGbn" :key="i" :value="item.value">{{ item.text }}</option>
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
import { rtmsMonitoring as monitoringApi } from '@/api/monitor'
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
			objFinGbn: '2', // 물건구분 1:토지, 2:건물
			dongGbn: 'bdong', // 동구분 hdong: 행정동, bdong: 법정동
			startYm: '', // 기간 시작년월
			endYm: '', // 기간종료년월
			startObjAmt: 0, // 거래금액 시작
			endObjAmt: 21, // 거래금액 종료
			bldgYearGbn: '', // 준공년도
			bldgUseGbn: '', // 건물 용도/주용도 (실거래공개:주용도, 자치구실거래:용도)
			useRegnCd: '', // 용도지역
			ymGbn: '1', // 조회유형 1:계약일기준, 2:신고일기준
			commentGbn: '', // 담당자확인 '':전체, 1:거래확인완료, 2:미확인
			dealGbn: '', // 거래유형 001매매 990분양권...
		})

		let searchPayload = reactive({
			dataGbn: computed(() => input.dataGbn),
			dongGbn: computed(() => input.dongGbn),
			objFinGbn: computed(() => input.objFinGbn),
			startYm: computed(() => (dayjs(input.startYm).isValid() ? dayjs(input.startYm).format('YYYYMM') : '')),
			endYm: computed(() => (dayjs(input.endYm).isValid() ? dayjs(input.endYm).format('YYYYMM') : '')),
			startObjAmt: computed(() => options.objAmt[input.startObjAmt].value),
			endObjAmt: computed(() => options.objAmt[input.endObjAmt].value),
			bldgYearGbn: computed(() => (input.objFinGbn === '2' ? input.bldgYearGbn : '')),
			bldgUseGbn: computed(() => (input.objFinGbn === '2' ? input.bldgUseGbn : '')),
			useRegnCd: computed(() => (input.objFinGbn === '1' ? input.useRegnCd : '')),
			ymGbn: computed(() => (input.dataGbn === 'plcy' ? input.ymGbn : '')),
			commentGbn: computed(() => input.commentGbn),
			dealGbn: computed(() => input.dealGbn),
		})

		let options = reactive({
			objAmt: [
				{ value: '', text: '최소' },
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
			bldgYearGbn: [
				{ value: '', text: '전체' },
				{ value: '1', text: '10년미만' },
				{ value: '2', text: '10년~20년 미만' },
				{ value: '3', text: '20년~30년 미만' },
				{ value: '4', text: '30년 이상' },
			],
			bldgUseGbn: {
				kab: [], // 건물주용도
				plcy: [], // 건물용도
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

		const objAmtMinValue = ref(0) // 매매/보증금 최소값
		const objAmtMaxValue = ref(options.objAmt.length - 1) // 매매/보증금 최대값

		onMounted(async () => {
			await userStore.getLoginUser
			const { data: plcyCode } = await optionsApi.getRtmsCodeOptions('BLDG_USE_CD') // (자치구실거래) 건물용도 옵션 조회
			options.bldgUseGbn.plcy = plcyCode
			const { data: kabCode } = await optionsApi.getKabBldgMuseOptions() // (실거래공개) 건물 주용도코드
			options.bldgUseGbn.kab = kabCode
			const { data: useRegnCd } = await optionsApi.getRtmsCodeOptions('USE_REGN_CD') // 용도지역 옵션조회
			options.useRegnCd = useRegnCd

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
		}

		const BtnClick = () => {
			//로그테이블 실거래 조회버튼
			CommonUtil.log(log.TARGET.MONITORINGRTMSSEARCH, log.ACTION.CLICK, null)
		}

		const setFold = (bool) => {
			isFold.value = bool
		}

		const clear = () => {
			const from = dayjs().subtract(6, 'month')
			const to = dayjs()
			input.startYm = dayjs(from).format('YYYY-MM')
			input.endYm = dayjs(to).format('YYYY-MM')
			input.dataGbn = 'kab'
			input.objFinGbn = '2'
			input.dongGbn = 'bdong'
			input.startObjAmt = 0
			input.endObjAmt = 21
			input.bldgYearGbn = ''
			input.bldgUseGbn = ''
			input.useRegnCd = ''
			input.ymGbn = '1'
			input.commentGbn = ''
			input.dealGbn = ''
			onSearch()
		}
		return {
			input,
			isFold,
			options,
			userStore,
			objAmtMinValue,
			objAmtMaxValue,
			setFold,
			onSearch,
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
