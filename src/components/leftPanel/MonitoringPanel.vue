<template>
	<div class="content show">
		<div class="head">
			<h3>모니터링</h3>
		</div>

		<div class="body slim-scroll">
			<ul v-if="isMonitorVisible" class="house-trend mb-30">
				<li v-for="(m, i) in monitoringList" :key="i">
					<div class="custom-control">
						<input type="checkbox" :id="m.id" :checked="m.isActive" @change="onMonitoringCheckChange" />
						<label :for="m.id">{{ m.text }} 모니터링 현황</label>
					</div>
				</li>
			</ul>

			<RtmsMonitoringList v-if="activeMonitoring?.id === 'rtms'" ref="rtmsList" />
			<AptMonitoringList v-if="activeMonitoring?.id === 'apt'" />
			<RentMonitoringList v-if="activeMonitoring?.id === 'rent'" />
			<MarketMonitoringList v-if="activeMonitoring?.id === 'market'" />
		</div>
	</div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import RtmsMonitoringList from './monitoringList/RtmsMonitoringList.vue'
import AptMonitoringList from './monitoringList/AptMonitoringList.vue'
import RentMonitoringList from './monitoringList/RentMonitoringList.vue'
import MarketMonitoringList from './monitoringList/MarketMonitoringList.vue'
import { useUserStore } from '@/stores/user'
import { layerAuth as layerAuthApi } from '@/api/settings'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import { useToolStore } from '@/stores/tool'
import { useLayerStore } from '@/stores/layer'
import { useViewStore } from '@/stores/view'

export default {
	components: {
		RtmsMonitoringList,
		AptMonitoringList,
		RentMonitoringList,
		MarketMonitoringList,
	},
	setup() {
		// let isLoading = ref(false)

		let rtmsList = ref(null)

		const monitoringList = ref([
			{ id: 'market', text: '부동산 시장', isActive: true },
			{ id: 'rtms', text: '실거래', isActive: false },
			{ id: 'apt', text: '아파트', isActive: false },
			{ id: 'rent', text: '전월세', isActive: false },
		])

		const userStore = useUserStore()
		const toolStore = useToolStore()
		const layerStore = useLayerStore()
		const viewStore = useViewStore()

		let emdLineLayer = null

		// 레벨
		let level = ref('sgg')

		const log = useLog()
		// 활성화된 모니터링(실거래/아파트/전월세/부동산시장)
		const activeMonitoring = computed(() => monitoringList.value.filter((m) => m.isActive)[0])
		const isMonitorVisible = ref(false)

		watch(
			() => layerStore.monitoringUmdLayer,
			() => {
				getEmdLayer()
			}
		)

		watch(
			() => viewStore.zoom,
			() => {
				onZoomChange()
			}
		)

		onMounted(async () => {
			removeDrawInteraction()
			await getUserLayer()
			getEmdLayer()
		})

		onUnmounted(() => {
			WGMap.removeLayer(emdLineLayer)
		})

		/**
		 * 모니터링 현황 체크 변경 이벤트 핸들러
		 * @param {*} e
		 */
		const onMonitoringCheckChange = (e) => {
			monitoringList.value.forEach((m) => {
				if (m.id === e.target.id) {
					m.isActive = e.target.checked
					if (e.target.checked == true) {
						if (m.id == 'market') {
							CommonUtil.log(log.TARGET.MARKETMONITORING, log.ACTION.CLICK, null)
						}
						if (m.id == 'rtms') {
							//로그테이블(실거래모니터링)
							CommonUtil.log(log.TARGET.RTMSMONITORING, log.ACTION.CLICK, null)
						}
						if (m.id == 'apt') {
							//로그테이블(아파트모니터링)
							CommonUtil.log(log.TARGET.APTMONITORING, log.ACTION.CLICK, null)
						}
						if (m.id == 'rent') {
							//로그테이블(전월세모니터링)
							CommonUtil.log(log.TARGET.RENTMONITORING, log.ACTION.CLICK, null)
						}
					}
				} else {
					m.isActive = false
				}
			})
			layerStore.setUmdLayer('bdong')
		}

		const removeDrawInteraction = () => {
			for (let i = 0; i < WGMap.getInteractions().getArray().length; i++) {
				if (WGMap.getInteractions().getArray()[i] instanceof wg.interaction.Draw) {
					WGMap.removeInteraction(WGMap.getInteractions().getArray()[i])
					toolStore.activeName = ''
				}
			}
		}
		const getUserLayer = async () => {
			const { data } = await layerAuthApi.getUserLayer(userStore.loginUser.id, 'MONITOR')
			let authLayerArray = []
			for (let i = 0; i < data.length; i++) {
				let inputString = data[i]
				let underscoreIndex = inputString.indexOf('_')

				if (underscoreIndex !== -1) {
					let authPrefix = inputString.substring(0, underscoreIndex)
					let authName = inputString.substring(underscoreIndex + 1)

					let authNameLowerCase = authName.toLowerCase()
					authLayerArray.push(authNameLowerCase)
				}
			}
			let monitorTempArr = []
			let aptTempArr = []
			for (let j = 0; j < monitoringList.value.length; j++) {
				for (let i = 0; i < authLayerArray.length; i++) {
					if (authLayerArray[i] === monitoringList.value[j].id.toLowerCase()) {
						monitorTempArr.push(monitoringList.value[j])
					}
				}
			}

			monitoringList.value = monitorTempArr
			let isProperty = false // 부동산 시장 모니터링이 있는지 확인
			if (monitoringList.value.length > 0) {
				monitoringList.value.forEach((monitor, index) => {
					if (monitor.id === 'market') {
						isProperty = true
					}
				})
				if (!isProperty) {
					monitoringList.value[0].isActive = true
				}
				isMonitorVisible.value = true
			}
		}

		const getEmdLayer = () => {
			if (emdLineLayer) {
				WGMap.removeLayer(emdLineLayer)
			}
			console.log(layerStore.monitoringUmdLayer)

			let _layer
			if (level.value === 'sgg') {
				_layer = 'GIS_ADM_SGG'
			} else {
				_layer = layerStore.monitoringUmdLayer === 'bdong' ? `GIS_ADM_UMD` : `GIS_G001`
			}

			const _params = {
				VERSION: '1.3.0',
				// LAYERS: layerStore.monitoringUmdLayer === 'bdong' ? `GIS_OP_Z_NGII_N3A_G0110000` : `GIS_G001`,
				LAYERS: _layer,
				TILED: true,
			}

			emdLineLayer = new wg.layer.Tile({
				id: `${layerStore.monitoringUmdLayer}-layer`,
				source: new wg.source.TileWMS({
					url: 'gis/wms',
					params: _params,
					crossOrigin: 'Anonymous',
				}),
				visible: true,
				opacity: 1,
			})

			WGMap.addLayer(emdLineLayer)
		}

		/**
		 * 줌 변경 이벤트 핸들러
		 */
		const onZoomChange = () => {
			const getLevel = (zoom) => {
				if (zoom <= 13) {
					return 'sgg'
				} else if (zoom > 13 && zoom < 16) {
					return 'umd'
				} else {
					return 'pnu'
				}
			}
			if (Number.isInteger(WGMap.getView().getZoom())) {
				const zoom = WGMap.getView().getZoom()
				console.log(zoom)
				const currentLevel = getLevel(zoom)
				if (level.value !== currentLevel) {
					level.value = currentLevel
					console.log('레벨변경 재조회' + zoom, level.value)
					getEmdLayer()
				}
			}
		}

		return {
			monitoringList,
			activeMonitoring,
			rtmsList,
			isMonitorVisible,
			onMonitoringCheckChange,
		}
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}
</style>
