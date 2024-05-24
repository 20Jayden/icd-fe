<template>
	<div class="side-panel">
		<h2 class="blind">좌측 패널</h2>
		<Lnb />

		<SearchPanel />
		<!--<HousePanel /> -->
		<a href="#" class="btn-fold active" title="접기"></a>
	</div>
</template>

<script>
import Lnb from '@/components/Lnb.vue'
import SearchPanel from '@/components/leftPanel/SearchPanel.vue'
// import HousePanel from '@/components/leftPanel/HousePanel.vue'

export default {
	components: {
		Lnb,
		SearchPanel,
		// HousePanel,
	},
	setup() {
		return {}
	},
}
</script>

<style lang="scss" scoped></style>
