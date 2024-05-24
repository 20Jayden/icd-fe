<template>
	<div id="spinner"></div>
</template>

<script>
export default {
	setup() {
		return {}
	},
}
</script>

<style scoped>
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
#spinner {
	animation: spin 1s linear infinite;
}
#spinner {
	margin: 0 auto;
	width: 25px;
	height: 25px;
	border: 2px solid rgba(163, 151, 198, 0.2);
	border-top: 2px solid rgba(163, 151, 198, 1);
	border-radius: 50%;
}
</style>
