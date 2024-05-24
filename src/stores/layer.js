import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import layerApi from '@/api/layer'

export const useLayerStore = defineStore('layer', () => {
	// 전체 레이어 list
	const layerList = ref([])
	const isBuildingLayer = ref(false)
	const isLandLayer = ref(false)

	// 레이어 check 관리 list
	const layerVisivility = ref([])

	// 행정경계/구역 레이어리스트
	const basicBoundaryAreaLayerList = ref([])
	// 건물/토지 레이어리스트
	const terrainBuildingLayerList = ref([])
	// 구역 레이어리스트
	const areaLayerList = ref([])
	// 용도지역지구 레이어리스트
	const zonningDistrictLayerList = ref([])
	// 부동산 레이어리스트
	const propertyLayerList = ref([])
	// 기타 레이어리스트
	const etcLayerList = ref([])

	// 사용자 레이어
	const userLayerList = ref([])

	// 모니터링 읍면동 레이어 bjdong: 법정동, hjdong: 행정동
	const monitoringUmdLayer = ref('bdong')

	async function listLayer() {
		const { status, data } = await layerApi.listLayer()
		layerList.value = data
		basicBoundaryAreaLayerList.value = layerList.value.filter((layer) => layer.layerTypeCode === 'AA001')
		terrainBuildingLayerList.value = layerList.value.filter((layer) => layer.layerTypeCode === 'AA002')
		areaLayerList.value = layerList.value.filter((layer) => layer.layerTypeCode === 'AA003')
		propertyLayerList.value = layerList.value.filter((layer) => layer.layerTypeCode === 'AA004')
		etcLayerList.value = layerList.value.filter((layer) => layer.layerTypeCode === 'AA005')
		zonningDistrictLayerList.value = layerList.value.filter((layer) => layer.layerTypeCode === 'AA006')

		// layerList.value.forEach((layer) => {
		// 	const obj = {}
		// 	obj.isChecked = false

		// 	//yjh
		// 	visible.value[layer.layerSequence] = obj.isChecked
		// })
	}

	const getAllLayer = computed(() => layerList.value)

	const getLayerVisivility = computed(() => layerVisivility.value)

	const visible = ref({})

	// visible 레이어 id 배열   ex) [1,4]
	const visibleLayerIds = computed(() => Object.keys(visible.value).filter((seq) => visible.value[seq]))

	// visible 레이어 object array [{layerSeq:1, ...}, {layerSeq:4 ...}]
	const visibleLayers = computed(() => {
		const ids = [...visibleLayerIds.value]
		return layerList.value.filter((layer) => ids.includes(layer.layerSequence.toString()))
	})

	// visible 레이어 모두 끄기
	const setInvisibleAllLayers = () => Object.keys(visible.value).filter((seq) => (visible.value[seq] = false))

	const setUserLayers = (userLayers) => {
		userLayerList.value = userLayers
	}

	const getActiveUserLayers = computed(() => userLayerList.value.filter((ul) => ul.visible))

	const setUmdLayer = (umdGbn) => {
		monitoringUmdLayer.value = umdGbn
	}

	return {
		visible,
		visibleLayers,
		getLayerVisivility,
		visibleLayerIds,
		layerList,
		isBuildingLayer,
		isLandLayer,
		basicBoundaryAreaLayerList,
		terrainBuildingLayerList,
		areaLayerList,
		propertyLayerList,
		etcLayerList,
		zonningDistrictLayerList,
		monitoringUmdLayer,
		getAllLayer,
		userLayerList,
		getActiveUserLayers,
		setUserLayers,
		setUmdLayer,
		listLayer,
		setInvisibleAllLayers,
	}
})
