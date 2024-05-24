<template>
	<li>
		<a @click="movePrev()">이전</a>
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
		const movePrev = () => {
			if (toolStore.activeName != 'prev') {
				// emit('change-name', 'prev')
				toolStore.activeName = 'prev'
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
			}
			history.go(-1)
		}
		return { props, movePrev }
	},
}
</script>

<style lang="scss" scoped></style>
