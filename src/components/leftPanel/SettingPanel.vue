<template>
	<div class="setting-panel show">
		<div class="left-menu">
			<div class="head">
				<strong>설정</strong>
				<a class="btn-close" @click="onSettingCloseClick"><span>닫기</span></a>
			</div>
			<ul class="menu">
				<li :class="{ 'active': menuStore.settingActive === 'manageUser' }" @click="onSettingMenuClick('manageUser')">
					<a>사용자 관리</a>
				</li>
				<li :class="{ 'active': menuStore.settingActive === 'manageGroup' }" @click="onSettingMenuClick('manageGroup')">
					<a>권한 그룹 관리</a>
				</li>
				<li :class="{ 'active': menuStore.settingActive === 'manageLayer' }" @click="onSettingMenuClick('manageLayer')">
					<a>레이어 권한 그룹 관리</a>
				</li>
				<li :class="{ 'active': menuStore.settingActive === 'manageLog' }" @click="onSettingMenuClick('manageLog')">
					<a>로그 현황</a>
				</li>
				<li :class="{ 'active': menuStore.settingActive === 'manageColor' }" @click="onSettingMenuClick('manageColor')">
					<a>범례 색상 설정</a>
				</li>
			</ul>
		</div>
		<ManageUser v-if="menuStore.settingActive === 'manageUser'" />
		<ManageGroup v-if="menuStore.settingActive === 'manageGroup'" />
		<ManageLayer v-if="menuStore.settingActive === 'manageLayer'" />
		<ManageLog v-if="menuStore.settingActive === 'manageLog'" />
		<ManageColor v-if="menuStore.settingActive === 'manageColor'" />
		<AddUser v-if="menuStore.settingActive === 'addUser'" />
	</div>
</template>

<script>
import { ref } from 'vue'
import ManageUser from '@/components/setting/ManageUser.vue'
import ManageGroup from '@/components/setting/ManageGroup.vue'
import ManageLayer from '@/components/setting/ManageLayer.vue'
import ManageLog from '@/components/setting/ManageLog.vue'
import ManageColor from '@/components/setting/ManageColor.vue'
import AddUser from '@/components/setting/AddUser.vue'
import { useMenuStore } from '@/stores/menu'
export default {
	components: {
		ManageUser,
		ManageGroup,
		ManageLayer,
		ManageLog,
		ManageColor,
		AddUser,
	},
	setup() {
		const menuStore = useMenuStore()
		const isSettingClose = ref(false)

		const onSettingMenuClick = (menu) => {
			menuStore.setSettingActive(menu)
		}
		const onSettingCloseClick = () => {
			isSettingClose
		}
		return {
			menuStore,
			onSettingMenuClick,
		}
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}
</style>
