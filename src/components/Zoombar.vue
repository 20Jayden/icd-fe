<template>
	<div class="zoombar">
		<a href="#" class="plus" @click="onZoomInClick"></a>
		<div class="num">{{ viewStore.zoom }}</div>
		<div class="unit">
			{{ viewStore.getLevel.text }}
		</div>
		<a href="#" class="minus" @click="onZoomOutClick"></a>
	</div>
</template>

<script>
import { useViewStore } from '@/stores/view'
import { useToolStore } from '@/stores/tool'

export default {
	setup() {
		const viewStore = useViewStore()
		const toolStore = useToolStore()

		// Zoombar 컴포넌트 수정
		const onZoomInClick = () => {
			WGMap.getView().setZoom(WGMap.getView().getZoom() + 1)
			viewStore.zoom = WGMap.getView().getZoom()
		}

		const onZoomOutClick = () => {
			WGMap.getView().setZoom(WGMap.getView().getZoom() - 1)
			viewStore.zoom = WGMap.getView().getZoom()
		}

		return { viewStore, onZoomInClick, onZoomOutClick, toolStore }
	},
}
</script>

<style scoped></style>
