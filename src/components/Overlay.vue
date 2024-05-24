<template>
	<div v-show="overlayStore.isShow" ref="markerDiv" class="marker-balloon">
		<div class="location-pop">
			<a href="#" class="btn-close" onclick="removeOverlay()"> <span>닫기</span></a>
			<ul>
				<li class="name">{{ overlayStore.title }}</li>
				<li class="type">{{ getLastCategory(overlayStore.category) }}</li>
			</ul>
			<div class="addr">{{ overlayStore.addr }}</div>
		</div>
	</div>
</template>

<script>
import { useOverlayStore } from '@/stores/overlay'
import { ref, watch, onMounted } from 'vue'
export default {
	setup() {
		const overlayStore = useOverlayStore()
		const markerDiv = ref(null)

		let overlay

		// let isDetailShow = ref(false)

		watch(
			() => overlayStore.isShow,
			(isShow) => {
				if (isShow) {
					setTimeout(() => {
						createOverlay()
					}, 0)
				} else {
					removeOverlay()
				}
			}
		)

		onMounted(() => {
			window.removeOverlay = function () {
				overlayStore.isShow = false
			}
		})

		const createOverlay = () => {
			const template = document.createElement('div')
			template.classList.add('marker_object')
			const clone = markerDiv.value.cloneNode(true)
			clone.style.display = 'block'
			template.innerHTML = clone.outerHTML
			overlay = new wg.Overlay({
				element: template,
				positioning: 'center-center',
				offset: [-45, 230],
			})

			let coordinate = wg.proj.fromLonLat([overlayStore.lon, overlayStore.lat])

			overlay.setPosition(coordinate)
			WGMap.addOverlay(overlay)
			WGMap.getView().setCenter(coordinate)
			WGMap.getView().setZoom(18)
		}

		const removeOverlay = () => {
			// WGMap.getOverlays().clear()
			WGMap.removeOverlay(overlay)

			// 닫기 버튼 클릭 시 검색으로 인하여 포출된 레이어 제거
			WGMap.removeLayer(WGMap.getLayerById('searchGeometry'))
		}

		const getLastCategory = (categoryName) => {
			if (categoryName) {
				const parts = categoryName.split(' > ')
				return parts[parts.length - 1]
			}
			return ''
		}

		return { markerDiv, overlayStore, getLastCategory }
	},
}
</script>

<style scoped>
.map .marker-balloon {
	display: none;
}

/* .marker-balloon .wrap:after {
	margin-left: -8px;
	bottom: -17px;
} */
</style>
