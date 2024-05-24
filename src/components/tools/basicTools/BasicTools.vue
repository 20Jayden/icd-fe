<template>
	<li>
		<a>도구</a>
		<ol>
			<!-- 기본 도구 컴포넌트 등록 -->
			<ToolChooseMap />
			<!-- 이전 -->
			<ToolPrev @change-name="onActiveNameChange" :activeName="activeName" />
			<!-- 다음 -->
			<ToolNext @change-name="onActiveNameChange" :activeName="activeName" />
			<!-- 이동하기 -->
			<ToolMove :active="false" @change-name="onActiveNameChange" :activeName="activeName" />
			<!-- 정보보기 -->
			<!-- <ToolFeatureInfo :active="false" @change-name="onActiveNameChange" :activeName="activeName" /> -->
			<!-- 거리재기 -->
			<ToolDistance :active="false" @change-name="onActiveNameChange" :activeName="activeName" />
			<!-- 면적재기 -->
			<ToolArea :active="false" @change-name="onActiveNameChange" :activeName="activeName" />
			<!-- 인쇄하기 -->
			<!-- <ToolPrint @change-name="onActiveNameChange" :activeName="activeName" /> -->
			<!-- 캡쳐 -->
			<!-- <ToolCapture @change-name="onActiveNameChange" :activeName="activeName" /> -->
			<!-- 전체화면 -->
			<!-- <ToolFullScreen :fullScreenYn="fullScreenYn" @changeState="onFullScreenChange" /> -->
			<!-- 정북전환 -->
			<!-- <ToolNorth /> -->
		</ol>
		<div class="map-choice-type">
			<button
				type="button"
				class="btn"
				:class="{ active: viewStore.basemap == 'smapBase' }"
				@click="() => ((viewStore.basemap = 'smapBase'), (viewStore.isHybrid = false))"
			>
				일반
			</button>
			<button
				type="button"
				class="btn"
				:class="{ active: viewStore.basemap == 'smapSatellite' }"
				@click="() => ((viewStore.basemap = 'smapSatellite'), (viewStore.isHybrid = false))"
			>
				위성
			</button>
			<button
				type="button"
				class="btn"
				:class="{ active: viewStore.basemap == 'Base' }"
				@click="() => ((viewStore.basemap = 'Base'), (viewStore.isHybrid = false))"
			>
				V-World 일반
			</button>
			<button
				type="button"
				class="btn"
				:class="{ active: viewStore.basemap == 'Satellite' }"
				@click="() => (viewStore.basemap = 'Satellite')"
			>
				V-World 위성
			</button>
			<!-- <button
				type="button"
				class="btn"
				:class="{ active: viewStore.basemap == 'Base' }"
				@click="() => ((viewStore.basemap = 'Base'), (viewStore.isHybrid = false))"
			>
				일반
			</button>
			<button
				type="button"
				class="btn"
				:class="{ active: viewStore.basemap == 'Satellite' }"
				@click="() => (viewStore.basemap = 'Satellite')"
			>
				위성
			</button>
			<button type="button" class="btn" :class="{ active: viewStore.isHybrid }" @click="onHybridClick">Hybrid</button>
			<button
				type="button"
				class="btn"
				:class="{ active: viewStore.basemap == 'smapBase' }"
				@click="() => ((viewStore.basemap = 'smapBase'), (viewStore.isHybrid = false))"
			>
				S-Map 일반
			</button>
			<button
				type="button"
				class="btn"
				:class="{ active: viewStore.basemap == 'smapSatellite' }"
				@click="() => ((viewStore.basemap = 'smapSatellite'), (viewStore.isHybrid = false))"
			>
				S-Map 위성
			</button> -->
			<button
				type="button"
				class="btn"
				:class="{ active: viewStore.isHybrid }"
				@click="onHybridClick"
			>
				Hybrid
			</button>
		</div>
	</li>
</template>

<script>
// component
import ToolChooseMap from './ToolChooseMap.vue'
import ToolPrev from './ToolPrev.vue'
import ToolNext from './ToolNext.vue'
import ToolMove from './ToolMove.vue'
import ToolFeatureInfo from './ToolFeatureInfo.vue'
import ToolDistance from './ToolDistance.vue'
import ToolArea from './ToolArea.vue'
import ToolPrint from './ToolPrint.vue'
import ToolCapture from './ToolCapture.vue'
import ToolFullScreen from './ToolFullScreen.vue'
import ToolNorth from './ToolNorth.vue'
import { useViewStore } from '@/stores/view'
import { ref, onMounted, watch } from 'vue'

export default {
	// 컴포넌트 등록
	components: {
		ToolChooseMap,
		ToolPrev,
		ToolNext,
		ToolMove,
		ToolFeatureInfo,
		ToolDistance,
		ToolArea,
		ToolPrint,
		ToolCapture,
		ToolFullScreen,
		ToolNorth,
	},
	emits: ['change-name'],
	setup(prop, { emit }) {
		onMounted(() => {
			// 도구 : 도구 > 지도선택
			$('.map-choice').on('click', function () {
				$('.map-choice-type').addClass('show')
			})
			$(document).mouseup(function (e) {
				if ($('.map-choice').has(e.target).length == 0) {
					$('.map-choice-type').removeClass('show')
				}
			})
		})

		const isTool = ref(false)
		const activeName = ref('')
		const fullScreenYn = ref(false)
		// store
		const viewStore = useViewStore()

		const onActiveNameChange = (name) => {
			activeName.value = name
		}

		watch(
			() => viewStore.isHybrid,
			(isHybrid) => {
				if (!isHybrid) {
					WGMap.getAllLayers()
						.filter((layer) => layer.get('id') === 'sateliteHybrid')[0]
						.setVisible(false)
				} else {
					WGMap.getAllLayers()
						.filter((layer) => layer.get('id') === 'sateliteHybrid')[0]
						.setVisible(true)
				}
			}
		)

		const onFullScreenChange = (yn) => {
			if (activeName.value != 'full') {
				activeName.value = 'full'
			} else {
				activeName.value = ''
			}
			fullScreenYn.value = yn
		}
		const onHybridClick = () => {
			viewStore.basemap = 'Satellite'
			viewStore.isHybrid = !viewStore.isHybrid
		}
		return {
			isTool,
			activeName,
			fullScreenYn,
			viewStore,
			onActiveNameChange,
			onFullScreenChange,
			onHybridClick,
		}
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}
.btn {
	width: 100%;
	text-wrap: nowrap;
	padding: 4px 10px;
}
</style>
