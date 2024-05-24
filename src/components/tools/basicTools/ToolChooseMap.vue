<template>
	<li class="map-choice"><a>지도선택</a></li>
</template>

<script>
export default {
	props: {
		active: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		return {}
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}
</style>
