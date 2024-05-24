<template>
	<li :class="{ active: fullScreenYn }">
		<a @click="fullScreen()">전체화면<br />보기</a>
	</li>
</template>

<script>
export default {
	props: {
		fullScreenYn: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['changeState'],
	setup(props, { emit }) {
		const fullScreen = () => {
			emit('changeState', true)
			document.addEventListener('fullscreenchange', fullscreenchange)

			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen()
			} else {
				if (document.exitFullscreen) {
					emit('changeState', false)
					document.exitFullscreen()
				}
			}
		}
		const fullscreenchange = (event) => {
			if (!document.fullscreenElement) {
				document.removeEventListener('fullscreenchange', fullscreenchange)
				emit('changeState', false)
			}
		}
		return { fullScreen }
	},
}
</script>

<style></style>
