<template>
	<div class="large-tit text-center">{{ basicInfo.bjdNm }}</div>
	<div class="property-info">
		<div class="left">
			<span class="badge badge-outline-primary">{{ level === 'sgg' ? '구' : '동' }}</span>
			<!-- <span class="badge badge-outline-secondary">재건축</span>
                        <span class="badge badge-outline-info">오피스텔</span>
                        <span class="badge badge-outline-success">재개발</span>
                        <span class="badge badge-outline-danger">아파트분양권</span>
                        <span class="badge badge-outline-warning">오피스텔분양권</span> -->
			{{ id || 0 }}건물 / {{ !isFinite(minArea) ? 0 : minArea }}㎡ ~ {{ !isFinite(maxArea) ? 0 : maxArea }}㎡
		</div>
		<div class="right">총 {{ totalCount.toLocaleString() || 0 }}건</div>
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
				<td>{{ item.totalCount.toLocaleString() }}</td>
			</tr>
			<!-- <tr v-if="detailInfo.dealCount > 0">
				<th scope="row">매매</th>
				<td>
					{{ numberToKorean(detailInfo.minDealPrice * 10000) }} ~ {{ numberToKorean(detailInfo.maxDealPrice * 10000) }}
				</td>
				<td>{{ detailInfo.dealCount }}</td>
			</tr>
			<tr v-if="detailInfo.leaseCount > 0">
				<th scope="row">전세</th>
				<td>
					{{ numberToKorean(detailInfo.minLeasePrice * 10000) }} ~
					{{ numberToKorean(detailInfo.maxLeasePrice * 10000) }}
				</td>
				<td>{{ detailInfo.leaseCount }}</td>
			</tr>
			<tr v-if="detailInfo.rentCount > 0">
				<th scope="row">월세</th>
				<td>
					{{ numberToKorean(detailInfo.minRentPrice * 10000) }} ~ {{ numberToKorean(detailInfo.maxRentPrice * 10000) }}
				</td>
				<td>{{ detailInfo.rentCount }}</td>
			</tr> -->
		</tbody>
	</table>
	<div class="text-center h5 mb-20">{{ detailInfo.address }}</div>
</template>

<script>
import { useUtil } from '@/composition/util'
import { ref, watch, onMounted } from 'vue'
export default {
	props: {
		basicInfo: {
			type: Object,
			default: () => {},
		},
		detailInfo: {
			type: Array,
			default: () => [],
		},
		level: {
			type: String,
			default: '',
		},
	},
	setup(props) {
		const id = ref(null)
		const minArea = ref(null)
		const maxArea = ref(null)
		const totalCount = ref(0)

		watch(
			() => props.detailInfo,
			() => {
				console.log('props.detail', props.detailInfo)
				onBasicInfo(props.detailInfo)
			}
		)

		onMounted(() => {
			console.log('props.detail', props.detailInfo)
			onBasicInfo(props.detailInfo)
		})

		const onBasicInfo = (detailInfo) => {
			id.value = detailInfo.reduce((accumulator, current) => accumulator + parseInt(current.id), 0)
			minArea.value = Math.min(...detailInfo.map((item) => item.minArea))
			maxArea.value = Math.max(...detailInfo.map((item) => item.maxArea))
			totalCount.value = detailInfo.reduce((accumulator, current) => accumulator + parseInt(current.totalCount), 0)
		}

		const { numberToKorean } = useUtil()

		return { numberToKorean, id, minArea, maxArea, totalCount }
	},
}
</script>

<style lang="scss" scoped></style>
