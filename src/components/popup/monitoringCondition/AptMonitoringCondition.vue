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
						<label>분석유형</label>
						<div class="form-group">
							<select class="form-control" v-model="input.analGbn">
								<option v-for="(item, i) in options.analGbn" :key="i" :value="item.value">{{ item.text }}</option>
							</select>
						</div>
					</li>
					<li>
						<label>거래신고<br />해제여부</label>
						<div class="form-group">
							<select class="form-control" v-model="input.cancelGbn">
								<option v-for="(item, i) in options.cancelGbn" :key="i" :value="item.value">{{ item.text }}</option>
							</select>
						</div>
					</li>
					<li>
						<label>기간유형</label>
						<div class="form-group date">
							<div class="hyphen">from.</div>
							<input type="date" class="form-control" v-model="input.startYmd" />
						</div>
					</li>
					<li>
						<div class="form-group date">
							<div class="hyphen" style="margin-left: 110px">to.</div>
							<div>
								<input type="date" class="form-control" v-model="input.endYmd" />
							</div>
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
					<li>
						<label>준공년도</label>
						<div class="form-group">
							<select class="form-control" v-model="input.bldgYearGbn">
								<option v-for="(item, i) in options.bldgYearGbn" :key="i" :value="item.value">{{ item.text }}</option>
							</select>
						</div>
					</li>
					<li>
						<label>면적</label>
						<div class="form-group">
							<select class="form-control" v-model="input.areaGbn">
								<option v-for="(item, i) in options.areaGbn" :key="i" :value="item.value">{{ item.text }}</option>
							</select>
						</div>
					</li>
					<li>
						<label>통계 유형</label>
						<div class="form-group">
							<div class="btn-group">
								<button
									type="button"
									:class="['btn', 'btn-dark', { active: input.statsGbn === '1' }]"
									@click="() => (input.statsGbn = '1')"
								>
									정상포함
								</button>
								<button
									type="button"
									:class="['btn', 'btn-dark', { active: input.statsGbn === '2' }]"
									@click="() => (input.statsGbn = '2')"
								>
									정상 미포함
								</button>
							</div>
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
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import { useToolStore } from '@/stores/tool'
import { useMenuStore } from '@/stores/menu'

export default {
	emits: ['search'],
	setup(props, { emit }) {
		const MONITORING_MAP_CENTER = [14132881.28821598, 4518955.77949531]
		const MONITORING_MAP_ZOOM = 12

		let isFold = ref(false)

		const toolStore = useToolStore()
		const menuStore = useMenuStore()

		let input = reactive({
			analGbn: '', // 분석유형
			cancelGbn: '', // 거래신고해제여부
			startYmd: '', // 기간 시작년월일
			endYmd: '', // 기간 종료년월일
			startObjAmt: 0, // 거래금액 시작
			endObjAmt: 21, // 거래금액 종료
			bldgYearGbn: '', // 준공년도
			areaGbn: '', // 면적구분
			statsGbn: '1', // 통계유형 (정상포함여부)
		})

		let searchPayload = reactive({
			analGbn: computed(() => input.analGbn),
			cancelGbn: computed(() => input.cancelGbn),
			startYmd: computed(() => (dayjs(input.startYmd).isValid() ? dayjs(input.startYmd).format('YYYYMMDD') : '')),
			endYmd: computed(() => (dayjs(input.endYmd).isValid() ? dayjs(input.endYm).format('YYYYMMDD') : '')),
			startObjAmt: computed(() => options.objAmt[input.startObjAmt].value),
			endObjAmt: computed(() => options.objAmt[input.endObjAmt].value),
			bldgYearGbn: computed(() => input.bldgYearGbn),
			areaGbn: computed(() => input.areaGbn),
			statsGbn: computed(() => input.statsGbn),
		})

		let options = reactive({
			analGbn: [
				{ value: '', text: '전체' },
				{ value: '1', text: '직전거래대비' },
				{ value: '2', text: '평균대비' },
				{ value: '3', text: '최고가대비' },
			],
			cancelGbn: [
				{ value: '', text: '전체' },
				{ value: '1', text: '추가입력완료' },
				{ value: '2', text: '계약해제' },
			],
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
			areaGbn: [
				{ value: '', text: '전체' },
				{ value: '1', text: '소형' },
				{ value: '2', text: '중형' },
				{ value: '3', text: '대형' },
			],
		})

		const objAmtMinValue = ref(0) // 매매/보증금 최소값
		const objAmtMaxValue = ref(options.objAmt.length - 1) // 매매/보증금 최대값

		onMounted(() => {
			const from = dayjs().subtract(6, 'month')
			const to = dayjs()
			input.startYmd = dayjs(from).format('YYYY-MM-DD')
			input.endYmd = dayjs(to).format('YYYY-MM-DD')

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
		const log = useLog()

		const onSearch = () => {
			emit('search', 1, searchPayload)
		}

		const BtnClick = () => {
			//로그테이블 아파트 모니터링 조회
			CommonUtil.log(log.TARGET.MONITORINGAPTSEARCH, log.ACTION.CLICK, null)
		}

		const setFold = (bool) => {
			isFold.value = bool
		}

		const clear = () => {
			const from = dayjs().subtract(6, 'month')
			const to = dayjs()
			input.startYmd = dayjs(from).format('YYYY-MM-DD')
			input.endYmd = dayjs(to).format('YYYY-MM-DD')
			input.analGbn = ''
			input.cancelGbn = ''
			input.startObjAmt = 0
			input.endObjAmt = 21
			input.bldgYearGbn = ''
			input.areaGbn = ''
			input.statsGbn = '1'
			onSearch()
		}

		return {
			isFold,
			input,
			options,
			objAmtMinValue,
			objAmtMaxValue,
			searchPayload,
			setFold,
			onSearch,
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
.form-group.date [type='month'] {
	width: 82px;
}
input[type='date'] {
	width: 138px !important;
}
.range-list {
	flex-wrap: wrap !important;
	margin-top: 10px;
}
.range-list > label {
	text-wrap: nowrap;
}
</style>
