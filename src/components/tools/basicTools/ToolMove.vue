<template>
	<li :class="{ active: false }"><a @click="emitChangeActiveName()">이동</a></li>
	<Teleport to="#popupContainer"> <PopMove v-if="isVisible" @move-pop="popVisible" /> </Teleport>
</template>

<script>
import { useToolStore } from '@/stores/tool'
import PopMove from '@/views/popup/toolbar/PopMove.vue'
import { ref } from 'vue'

export default {
	components: {
		PopMove,
	},
	props: {
		active: {
			type: Boolean,
			default: true,
		},
		activeName: {
			type: String,
			default: '',
		},
	},
	emits: ['change-name'],
	setup(props, { emit }) {
		const isVisible = ref(false)
		const toolStore = useToolStore()

		const popVisible = () => {
			isVisible.value = false
		}
		const emitChangeActiveName = () => {
			isVisible.value = !isVisible.value
			// emit('change-name', '')
			toolStore.activeName = ''
		}
		return { emitChangeActiveName, popVisible, isVisible }
	},
}
</script>

<style scoped></style>
