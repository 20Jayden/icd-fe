<template>
	<li>
		<a @click="emitChangeActiveName">좌표이동</a>
	</li>
	<Teleport to="#popupContainer"> <PopMove /> </Teleport>
</template>

<script>
import PopMove from '@/views/popup/toolbar/PopMove.vue'
export default {
	components: {
		PopMove,
	},
	props: {
		activeName: {
			type: String,
			default: '',
		},
	},
	emits: ['change-name'],
	setup(props, { emit }) {
		const emitChangeActiveName = () => {
			// emit('change-name', '')
			toolStore.activeName = ''
		}
		return { emitChangeActiveName }
	},
}
</script>

<style scoped></style>
