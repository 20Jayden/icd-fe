<template>
	<div class="map-wrap">
		<Header />
		<Map />
		<Tools />
		<Left />
		<!-- <Setting v-if="menuStore.lnbActive === 'setting'" />
		<ConfirmUserInfo v-if="menuStore.lnbActive === 'confirmUserInfo'" /> -->
		<!-- <StatsBoard /> -->
		<!-- <Bottom /> -->
		<Overlay />
		<!-- <Zoombar /> -->
		<!-- 공지사항 -->
		<Teleport to="#popupContainer">
			<NoticePopup v-for="(notice, index) in noticeList" :key="index" :data="notice" />
		</Teleport>
	</div>
</template>

<script>
import Header from '@/components/layout/main/Header.vue'
import Bottom from '@/components/layout/main/Bottom.vue'
import Left from '@/components/layout/main/Left.vue'
import Tools from '@/components/tools/Tools.vue'
import Map from '@/components/Map.vue'
// import ChangeLayerOrder from '@/components/ChangeLayerOrder.vue'
import MonitorPopup from '@/components/popup/MonitorPopup.vue'
// import StatsBoard from '@/components/popup/StatsBoard.vue'
import Overlay from '@/components/Overlay.vue'
import { useMenuStore } from '@/stores/menu.js'
import Zoombar from '@/components/Zoombar.vue'
import NoticePopup from '@/components/popup/NoticePopup.vue'
// import noticeApi from '@/api/notice'
import { ref, onMounted } from 'vue'

export default {
	components: {
		Header,
		Bottom,
		Left,
		Tools,
		Map,
		// StatsBoard,
		Overlay,
		Zoombar,
	},
	setup() {
		const menuStore = useMenuStore()
		const noticeList = ref([])

		onMounted(() => {
			// getNoticeList()
		})

		// const getNoticeList = async () => {
		// 	const { data, status } = await noticeApi.noticeList()
		// 	// console.log('Notice $$', data)
		// 	noticeList.value = data
		// }

		return {
			menuStore,
			noticeList,
		}
	},
}
</script>

<style lang="scss" scoped></style>
