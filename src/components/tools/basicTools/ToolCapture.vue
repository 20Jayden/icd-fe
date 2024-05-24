<template>
	<li>
		<a @click="onClickScreenshot()">캡쳐</a>
	</li>
	<Teleport to="#popupContainer">
		<PopCapture v-if="popupStore.screenshotLegendVisible" />
	</Teleport>
</template>

<script>
import PopCapture from '@/views/popup/toolbar/PopCapture.vue'
import { usePopupStore } from '@/stores/popup'
import { useToolStore } from '@/stores/tool'

export default {
	components: {
		PopCapture,
	},
	props: {
		activeName: {
			type: String,
			default: '',
		},
	},
	emits: ['change-name'],
	setup(props, { emit }) {
		const popupStore = usePopupStore()
		const toolStore = useToolStore()

		const onClickScreenshot = () => {
			if (toolStore.activeName != 'screenshot') {
				// emit('change-name', 'screenshot')
				toolStore.activeName = 'screenshot'
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
			}
			popupStore.setPopupState({
				screenshotLegendVisible: true,
			})
			console.log(popupStore.setPopupState)
		}
		return { onClickScreenshot, popupStore }
	},
}
</script>

<style></style>
