<template>
	<li>
		<a>그리기</a>
		<ol>
			<!-- TODO: basicTools처럼 각 버튼 컴포넌트로 분리해서 개발할것. -->
			<DrawStyle :active="false" :activeName="activeName" @change-name="onActiveNameChange" />
			<DrawPoint :active="false" :activeName="activeName" @change-name="onActiveNameChange" />
			<DrawLine :active="false" :activeName="activeName" @change-name="onActiveNameChange" />
			<DrawRect :active="false" :activeName="activeName" @change-name="onActiveNameChange" />
			<DrawPolygon :active="false" :activeName="activeName" @change-name="onActiveNameChange" />
			<DrawCircle :active="false" :activeName="activeName" @change-name="onActiveNameChange" />
			<DrawPen :active="false" :activeName="activeName" @change-name="onActiveNameChange" />
			<DrawText :active="false" :activeName="activeName" @change-name="onActiveNameChange" />
			<DrawImport :active="false" :activeName="activeName" @change-name="onActiveNameChange" />
			<DrawExport :active="false" :activeName="activeName" @change-name="onActiveNameChange" />
			<li><a class="delete" @click="showClearDrawConfirm">전체삭제</a></li>
			<DrawPin :active="false" />
			<!-- <li><a>이미지</a></li> -->
		</ol>
	</li>
</template>

<script>
// basic
import { ref, onMounted } from 'vue'
// component
import DrawStyle from './DrawStyle.vue'
import DrawPoint from './DrawPoint.vue'
import DrawLine from './DrawLine.vue'
import DrawRect from './DrawRect.vue'
import DrawPolygon from './DrawPolygon.vue'
import DrawCircle from './DrawCircle.vue'
import DrawPen from './DrawPen.vue'
import DrawText from './DrawText.vue'
import DrawExport from './DrawExport.vue'
import DrawImport from './DrawImport.vue'
import DrawPin from './DrawPin.vue'
// composition
import { draw as drawStyle } from '@/composition/drawStyle'
import { useModalStore } from '@/stores/modal'
import { useToolStore } from '@/stores/tool'

export default {
	components: {
		DrawStyle,
		DrawPoint,
		DrawLine,
		DrawRect,
		DrawPolygon,
		DrawCircle,
		DrawPen,
		DrawText,
		DrawExport,
		DrawImport,
		DrawPin,
	},
	setup(props) {
		let drawInteraction

		const activeName = ref('')
		const modalStore = useModalStore()
		const toolStore = useToolStore()

		onMounted(() => {
			const drawLayer = new wg.layer.Vector({
				id: 'drawLayer',
				source: new wg.source.Vector({ wrapX: false }),
				style: drawStyle,
				visible: true,
				zIndex: 2,
			})

			WGMap.addLayer(drawLayer)
		})

		const onActiveNameChange = (name) => {
			activeName.value = name
		}

		// 전체 삭제
		const clearDrawSource = () => {
			let drawLayer = WGMap.getLayerById('drawLayer')
			let drawSource = drawLayer.getSource()

			console.log('delete')
			if (drawInteraction) {
				drawInteraction.inactive()
			}
			drawInteraction = undefined

			drawSource.clear()
			// removeOverlay(WGMap.getOverlayById('drawTextOverlay'))
			// 전체 삭제 시 그리기 도구 초기화
			toolStore.activeName = ''
		}

		const showClearDrawConfirm = () => {
			modalStore.showConfirm('입력한 내용을 삭제하시겠습니까?', clearDrawSource)
		}

		// 오버레이 삭제
		// const removeOverlay = () => {
		// 	WGMap.getOverlays().clear()
		// }

		return { activeName, onActiveNameChange, clearDrawSource, showClearDrawConfirm }
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}
</style>
