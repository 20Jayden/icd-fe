<template>
	<li :class="{ active: toolStore.activeName === 'info' }"><a href="#" @click="onActiveChange">정보보기</a></li>
	<Teleport to="#popupContainer">
		<PopFeatureInfo v-if="isPopShow" :coordinate="coordinate" @close="onPopupClose" />
	</Teleport>
</template>

<script>
import { ref, watch } from 'vue'
import PopFeatureInfo from '@/components/popup/PopFeatureInfo.vue'
// store
import { useToolStore } from '@/stores/tool'
export default {
	components: {
		PopFeatureInfo,
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
		const toolStore = useToolStore()
		let isPopShow = ref(false) // 팝업표시여부
		let coordinate = ref([]) // 클릭지점 좌표
		let eventKey

		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName != 'info') {
					inactiveClick()
				}
			}
		)

		const onActiveChange = () => {
			if (toolStore.activeName != 'info') {
				// emit('change-name', 'info')
				toolStore.activeName = 'info'
				activeClick()
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
				inactiveClick()
			}
		}

		const activeClick = () => {
			eventKey = WGMap.on('click', (e) => {
				console.log('click 2d', e)
				isPopShow.value = true
				coordinate.value = e.coordinate
			})

			$('.view-map').css('cursor', 'help')
		}

		const inactiveClick = () => {
			wg.Observable.unByKey(eventKey)
			$('.view-map').css('cursor', 'default')
		}

		const onPopupClose = () => {
			isPopShow.value = false
		}

		return { props, isPopShow, coordinate, onActiveChange, onPopupClose, toolStore }
	},
}
</script>

<style lang="scss" scoped></style>
