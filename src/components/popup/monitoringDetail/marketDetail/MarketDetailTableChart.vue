<template>
	<div class="tab-pane">
		<div class="scroll-tbody">
			<table class="table data-table color-blue mb-0">
				<caption></caption>
				<colgroup>
					<col style="width: 100px" />
					<col style="width: 100px" />
					<col style="width: 100px" />
					<col style="width: 100px" />
				</colgroup>
				<thead>
					<tr>
						<th scope="col">일자</th>
						<th scope="col">매매</th>
						<th scope="col">전세</th>
						<th scope="col">월세</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in tableList" :key="index">
						<th scope="row">{{ item.date }}</th>
						<td>{{ item.deal === undefined ? '-' : item?.deal || 0 }}</td>
						<td>{{ item.lease === undefined ? '-' : item?.lease || 0 }}</td>
						<td>{{ item.rent === undefined ? '-' : item?.rent || (keyword === 'mPrice' ? '-' : 0) }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useUtil } from '@/composition/util'

export default {
	props: {
		params: {
			type: Object,
			default: () => {},
		},
		list: {
			type: Array,
			default: () => [],
		},
		keyword: {
			type: String,
			default: '',
		},
	},
	setup(props) {
		const { numberToKorean } = useUtil()

		let tableList = ref([])

		watch(
			() => props.list,
			() => {
				drawTable(props.keyword)
			}
		)

		watch(
			() => props.keyword,
			() => {
				drawTable(props.keyword)
			}
		)

		const drawTable = (keyword) => {
			if (keyword === 'eCount') {
				tableList.value = props.list.map((d) => ({
					date: d.createdDt,
					deal: d.dealCount,
					lease: d.leaseCount,
					rent: d.rentCount,
				}))
				console.log(tableList.value)
			} else if (keyword === 'ePrice') {
				tableList.value = props.list.map((d) => ({
					date: d.createdDt,
					deal:
						d.minDealPrice === undefined
							? undefined
							: numberToKorean(d.minDealPrice * 10000) + ' ~ ' + numberToKorean(d.maxDealPrice * 10000),
					lease:
						d.minLeasePrice === undefined
							? undefined
							: numberToKorean(d.minLeasePrice * 10000) + ' ~ ' + numberToKorean(d.maxLeasePrice * 10000),
					rent:
						d.minRentPrice === undefined
							? undefined
							: numberToKorean(d.minRentPrice * 10000) + ' ~ ' + numberToKorean(d.maxRentPrice * 10000),
				}))
				console.log(tableList.value)
			} else if (keyword === 'mPrice') {
				tableList.value = props.list.map((d) => ({
					date: d.createdDt,
					deal: d.medianDealUnitPrice === undefined ? undefined : numberToKorean(d.medianDealUnitPrice * 10000) || 0,
					lease: d.medianLeaseUnitPrice === undefined ? undefined : numberToKorean(d.medianLeaseUnitPrice * 10000) || 0,
				}))
				console.log(tableList.value)
			}
		}

		onMounted(() => {
			drawTable(props.keyword)
		})

		return { tableList }
	},
}
</script>

<style scoped></style>
