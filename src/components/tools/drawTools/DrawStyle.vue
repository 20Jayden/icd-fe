<template>
	<li :class="{ active: toolStore.activeName === 'Style' }">
		<a @click="onActiveChange" data-toggle="modal" data-target="#drawStyle" class="open-styleedit">스타일</a>
	</li>
	<Teleport to="#popupContainer">
		<PopStyle v-if="toolStore.activeName === 'Style'" @close="closePopup" />
	</Teleport>
</template>

<script>
// basic
import { watch } from 'vue'
// store
import { useDrawStore } from '@/stores/draw'
import { useToolStore } from '@/stores/tool'
// components
import PopStyle from '@/views/popup/toolbar/PopStyle.vue'
// composition
import StyleChange from '@/composition/StyleChange'

export default {
	props: {
		active: {
			type: Boolean,
			default: false,
		},
		activeName: {
			type: String,
			default: '',
		},
	},
	emits: ['change-name'],
	components: {
		PopStyle,
	},
	setup(props, { emit }) {
		const drawStore = useDrawStore()
		const toolStore = useToolStore()

		let selectInteraction

		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName === 'Style') {
					console.log('Style 활성화')
					onChangeStyle()
				} else {
					if (selectInteraction) {
						selectInteraction.inactive()
					}
				}
			}
		)

		const onActiveChange = () => {
			if (toolStore.activeName !== 'Style') {
				// emit('change-name', 'Style')
				toolStore.activeName = 'Style'
			} else {
				toolStore.activeName = ''
				// emit('change-name', '')
			}
		}

		const onChangeStyle = () => {
			const drawLayer = WGMap.getLayerById('drawLayer')
			const drawSource = drawLayer.getSource()

			selectInteraction = new StyleChange({
				layers: [drawLayer],
				source: drawSource,
			})

			drawStore.selectInteraction = selectInteraction
			selectInteraction.active()
		}

		const closePopup = () => {
			// emit('change-name', '')
			toolStore.activeName = ''
		}

		return { closePopup, onActiveChange, toolStore }
	},
}
</script>

<style scoped></style>
