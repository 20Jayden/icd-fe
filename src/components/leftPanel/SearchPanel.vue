<template>
	<div class="content show">
		<div class="head">
			<h3>검색</h3>
		</div>
		<div class="body slim-scroll">
			<div class="search">
				<div class="tab">
					<ul>
						<SearchAddress :active="activeTab === 'address'" @onActiveChange="onActiveChange" />
						<SearchBuilding :active="activeTab === 'building'" @onActiveChange="onActiveChange" />
						<!-- <SearchDeal :active="activeTab === 'deal'" @onActiveChange="onActiveChange" /> -->
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// basic
import { ref, onMounted } from 'vue'
// components
import SearchAddress from '@/components/leftPanel/searchTab/SearchAddress.vue'
import SearchBuilding from '@/components/leftPanel/searchTab/SearchBuilding.vue'
import SearchDeal from '@/components/leftPanel/searchTab/SearchDeal.vue'
// api
import CommonUtil from '@/api/logTable'
// store
import { useLog } from '@/stores/log'
import { useMenuStore } from '@/stores/menu'

export default {
	components: {
		SearchAddress,
		SearchBuilding,
		SearchDeal,
	},
	setup() {
		let activeTab = ref('address')
		const log = useLog()
		const menuStore = useMenuStore()

		onMounted(() => {})

		const onActiveChange = (name) => {
			//검색 탭 클릭
			activeTab.value = name

			if (name === 'address') {
				CommonUtil.log(log.TARGET.SEARCHADDRESS, log.ACTION.CLICK, null)
			}
			if (name === 'building') {
				CommonUtil.log(log.TARGET.SEARCHBUILDING, log.ACTION.CLICK, null)
			}
			if (name === 'deal') {
				CommonUtil.log(log.TARGET.SEARCHDEAL, log.ACTION.CLICK, null)
			}
		}

		return {
			activeTab,
			onActiveChange,
			menuStore,
		}
	},
}
</script>

<style lang="scss" scoped></style>
