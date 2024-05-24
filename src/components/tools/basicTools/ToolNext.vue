<template>
	<li>
		<a @click="moveNext()">다음</a>
	</li>
</template>

<script>
import { useToolStore } from '@/stores/tool'

export default {
	props: {
		activeName: {
			type: String,
			default: '',
		},
	},
	emits: ['change-name'],
	setup(props, { emit }) {
		const toolStore = useToolStore()
		const moveNext = () => {
			if (toolStore.activeName != 'next') {
				// emit('change-name', 'next')
				toolStore.activeName = 'next'
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
			}
			history.forward()
		}
		return { props, moveNext }
	},
}
</script>

<style lang="scss" scoped></style>
