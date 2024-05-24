<template>
	<li>
		<a @click="showPrintPopup">인쇄</a>
	</li>
	<Teleport to="#popupContainer">
		<PopPrint v-if="popupStore.printPopupVisible" />
	</Teleport>
</template>

<script>
import PopPrint from '@/views/popup/toolbar/PopPrint.vue'
import { usePopupStore } from '@/stores/popup'
import { useToolStore } from '@/stores/tool'

export default {
	components: {
		PopPrint,
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
		const showPrintPopup = () => {
			if (toolStore.activeName != 'print') {
				// emit('change-name', 'print')
				toolStore.activeName = 'print'
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
			}
			popupStore.setPopupState({
				printPopupVisible: true,
			})
			console.log(popupStore.setPopupState)
		}

		return { popupStore, showPrintPopup }
	},
}
</script>

<style></style>
