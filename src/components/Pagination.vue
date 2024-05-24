<template>
	<div v-if="isActive" class="pagination">
		<ul>
			<li class="first"><a title="첫페이지로" @click="movePage(1)"></a></li>
			<li class="prev"><a title="이전페이지로" @click="movePage(currPage - 1)"></a></li>
			<li
				v-for="page in pageList"
				:key="page"
				class="page-number"
				:class="{ active: page === currPage }"
			>
				<a @click="movePage(page)">
					<span> {{ page }}</span>
				</a>
			</li>
			<li class="next"><a title="다음페이지로" @click="movePage(currPage + 1)"></a></li>
			<li class="last"><a title="끝페이지로" @click="movePage(pageCount)"></a></li>
		</ul>
	</div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
export default {
	props: {
		/**
		 * 현재 페이지
		 */
		currPage: {
			type: Number,
			default: 1,
		},
		/**
		 * 한 페이지당 레코드 수
		 */
		countPerPage: {
			type: Number,
			default: 10,
		},
		/**
		 * 숫자로 표현될 페이지 수 ex) unitPage=3 : << < 1 2 3 > >>
		 */
		unitPage: {
			type: Number,
			default: 10,
		},
		/**
		 * 전체 레코드 수
		 */
		totalCount: {
			type: Number,
			default: 0,
		},
		scrollTop: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['movePage'],
	setup(props, { emit }) {
		// 마운트 됐을때 ui생성
		onMounted(() => initUI())
		// totalCount가 변경됐을때 ui생성
		watch(
			() => props.totalCount,
			() => initUI()
		)
		// currPage가 변경됐을때 ui생성
		watch(
			() => props.currPage,
			() => initUI()
		)

		let isActive = computed(() => props.totalCount > 0)
		let pageList = ref([])
		let pageCount = ref(0)

		let startPageIndex = 0,
			endPageIndex = 0

		const initUI = () => {
			pageCount.value = Math.ceil(props.totalCount / props.countPerPage)
			startPageIndex = (Math.ceil(props.currPage / props.unitPage) - 1) * props.unitPage + 1
			endPageIndex =
				startPageIndex + props.unitPage > pageCount.value
					? pageCount.value
					: startPageIndex + props.unitPage - 1
			let list = []
			for (let index = startPageIndex; index <= endPageIndex; index++) {
				list.push(index)
			}
			pageList.value = list
		}

		const movePage = (pageNum) => {
			if (pageNum <= 0) {
				pageNum = 1
			}
			if (pageNum > pageCount.value) {
				pageNum = pageCount.value
			}
			emit('movePage', pageNum)
		}

		return {
			initUI,
			movePage,
			isActive,
			pageList,
			pageCount,
		}
	},
}
</script>

<style scoped>
.pagination ul li a {
	padding: 0 5px;
}
a {
	cursor: pointer;
}
</style>
