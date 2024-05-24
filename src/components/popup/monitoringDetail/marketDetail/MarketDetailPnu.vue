<template>
	<div class="large-tit text-center">{{ detailInfo[0]?.titleName || '(물건명 없음)' }}</div>
	<div class="property-info">
		<div class="left">
			<span class="badge badge-outline-primary">{{ detailInfo[0]?.realEstateTypeName || '-' }}</span>
			<!-- <span class="badge badge-outline-secondary">재건축</span>
                        <span class="badge badge-outline-info">오피스텔</span>
                        <span class="badge badge-outline-success">재개발</span>
                        <span class="badge badge-outline-danger">아파트분양권</span>
                        <span class="badge badge-outline-warning">오피스텔분양권</span> -->
			{{ detailInfo[0]?.totalHouseHoldCount || 0 }}세대 / 총 {{ detailInfo[0]?.totalDongCount || 0 }}동 /
			{{ detailInfo[0]?.minArea || 0 }}㎡ ~ {{ detailInfo[0]?.maxArea || 0 }}㎡
		</div>
		<div class="right">준공 {{ dayjs(detailInfo[0]?.completionYearMonth).format('YYYY.MM') }}</div>
	</div>
	<table class="table data-table">
		<caption>
			실매물 상세 정보이며 거래구분, 최소/최대금액, 매물건수를 제공합니다.
		</caption>
		<colgroup>
			<col style="width: 120px" />
			<col style="width: 250px" />
			<col style="width: 120px" />
		</colgroup>
		<thead>
			<tr>
				<th scope="col">거래구분</th>
				<th scope="col">최소/최대금액</th>
				<th scope="col">매물건수</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in detailInfo" :key="item.estateType">
				<th v-if="item.estateType === 'DEAL'" scope="row">매매</th>
				<th v-if="item.estateType === 'LEASE'" scope="row">전세</th>
				<th v-if="item.estateType === 'RENT'" scope="row">월세</th>
				<td>{{ numberToKorean(item.minPrice * 10000) }} ~ {{ numberToKorean(item.maxPrice * 10000) }}</td>
				<td>{{ item.totalCount.toLocaleString() || 0 }}</td>
			</tr>
		</tbody>
	</table>
	<div class="text-center h5 mb-20">{{ detailInfo.address }}</div>
</template>

<script>
import dayjs from 'dayjs'
import { watch, onMounted } from 'vue'
import { useUtil } from '@/composition/util'
export default {
	props: {
		basicInfo: {
			type: Object,
			default: () => {},
		},
		detailInfo: {
			type: Object,
			default: () => {},
		},
	},
	setup(props) {
		watch(
			() => props.detailInfo,
			() => {
				console.log('props.detail', props.detailInfo)
			}
		)

		onMounted(() => {
			console.log('props.detail', props.detailInfo)
		})
		const { numberToKorean } = useUtil()

		return { dayjs, numberToKorean }
	},
}
</script>

<style lang="scss" scoped></style>
