<template>
	<div
		id="selectionPopup1"
		class="layer-popup random-extra"
		:class="{ 'show': toolStore.activeName === 'areaSelection' }"
		style="top: 40%; left: 40%; z-index: 5"
	>
		<div class="head">
			<div class="tit">임의영역 추출</div>
			<a href="#" class="btn-close" @click="onClosePopupClick"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<ol>
				<li>
					<div class="tit">선택 영역 공간정보 추출</div>
					<button type="button" class="btn btn-primary" @click="columnInfo">칼럼 정보 다운로드(.xlsx)</button>
				</li>
			</ol>
			<ol v-if="layers.length == 0" class="none" style="font-weight: bold">
				<span>활성화된 레이어가 없습니다</span>
			</ol>
			<ol v-if="layers.length > 0">
				<li v-for="layer in layerListArr" :key="layer.wgMapId">
					<div class="custom-control">
						<input type="checkbox" :id="layer.wgMapId" @change="onCheckedChange(layer, $event.target.checked)" />
						<label :for="layer.wgMapId" class="icon">
							<PointLegend v-if="layer.layerVectorCode == 'AB001'" :layer="layer" />
							<PolygonLegend v-if="layer.layerVectorCode == 'AB003'" :layer="layer" />
							{{ layer.layerDescription }}
						</label>
						<span
							v-if="layerObjectCount[layer.layerSequence] != undefined && layerObjectCount[layer.layerSequence] != -1"
							style="margin-left: 2px"
						>
							({{ layerObjectCount[layer.layerSequence] }})
						</span>
						<span v-if="layerObjectCount[layer.layerSequence] == -1" style="margin-left: 2px; color: #ff0000">
							(x)
						</span>
						<span v-if="layerObjectCount[layer.layerSequence] == undefined" id="wrapper">
							<!-- <div id="spinner"></div> -->
							<Spinner style="margin-left: 3px; width: 12px; height: 12px" />
						</span>
					</div>
					<a
						href="#"
						class="btn btn-sm btn-info"
						@click="ExportCsvForLine(layer.layerWorkSpace, layer.layerId, layer.layerDescription)"
						>.CSV</a
					>
					<a
						href="#"
						class="btn btn-sm btn-success"
						@click="ExportShpForLine(layer.layerWorkSpace, layer.layerId, layer.layerDescription)"
						>.SHP</a
					>
				</li>
			</ol>
			<div class="action-btn-group">
				<div class="center">
					<button type="button" class="btn btn-primary" @click="checkCsvExport">선택 CSV 일괄 다운로드</button>
					<button type="button" class="btn btn-primary" @click="checkShpExport">선택 SHP 일괄 다운로드</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
//basic
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'

import { useModalStore } from '@/stores/modal'
//store
import { useSpaceStore } from '@/stores/space'
import { useLayerStore } from '@/stores/layer'
import { useLoadingStore } from '@/stores/loading'
import { useToolStore } from '@/stores/tool'
import { useLog } from '@/stores/log'
//component
import PointLegend from '@/components/leftPanel/legend/PointLegend.vue'
import PolygonLegend from '@/components/leftPanel/legend/PolygonLegend.vue'
import Spinner from '@/components/Spinner.vue'
import CommonUtil from '@/api/logTable'

// 지오서버 프록시
const GIS_PROXY = `/gis`

export default {
	components: {
		PointLegend,
		PolygonLegend,
		Spinner,
	},
	props: {
		// isActive: {
		// 	type: Boolean,
		// 	defalut: false,
		// },
		buildings: {
			type: Object,
			default: () => {
				return {
					bulManNo: '',
					beobJeongDongName: '',
					buldNm: '',
					buldNmDc: '',
					emdCd: '',
					liCd: '',
					lnbrMnnm: '',
					lnbrSlno: '',
					mntnYn: '',
					siDoName: '',
					siGunGuName: '',
					sigCd: '',
				}
			},
		},
		layers: {
			type: Object,
			default: () => {
				return {
					layerDescription: '',
					layerId: '',
					layerSequence: '',
					layerSourceCd: '',
					layerTypeCode: '',
					layerVectorCode: '',
					layerWorkSpace: '',
					modId: '',
					openYn: '',
					regDt: '',
					regId: '',
					timeYn: '',
					upperLayr: '',
					useYn: '',
				}
			},
		},
	},
	setup(props) {
		const spaceStore = useSpaceStore()
		const layerStore = useLayerStore()
		const loadingStore = useLoadingStore()
		const modalStore = useModalStore()
		const toolStore = useToolStore()
		const log = useLog()

		const layerObjectCount = ref([])
		const checkExportLayer = ref([])

		watch(
			() => layerStore.visibleLayers,
			(newValue, oldValue) => {
				if (newValue.length > oldValue.length) {
					const newLayer = newValue.filter((x) => !oldValue.includes(x))
					if (newLayer) {
						geometryUrl(newLayer[0].layerWorkSpace, newLayer[0].layerId, newLayer[0].layerSequence)
					}
				}
			}
		)

		const layerListArr = computed(() => {
			console.log('$$ props.buildings ::', props.buildings)
			console.log('$$ layerListArr ::', layerListArr)
			return props.layers.filter((layer) => layer.layerWorkSpace != null)
		})

		const closeSpaceList = () => {
			spaceStore.isSpaceSelected = false
			spaceStore.isActive = false
			// spaceStore.activeName = ''
			spaceStore.closeIs = true
			spaceStore.clear2dSelectionLayer()
		}

		let fragment = ref(null)
		onMounted(() => {
			addEventHandler()
			searchLayerObject()
		})

		const addEventHandler = () => {
			// 레이어팝업
			$('.layer-popup .btn-close').on('click', function () {
				$(this).parents().parents().removeClass('show')
			})
			// 팝업 이동
			$(function () {
				$('#selectionPopup1').draggable({ containment: 'body', scroll: false, handle: '.head' })
			})
		}

		function searchLayerObject() {
			layerStore.visibleLayers.forEach((layer) => {
				geometryUrl(layer.layerWorkSpace, layer.layerId, layer.layerSequence)
			})
		}

		const getParamString = (params) => {
			return Object.keys(params)
				.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
				.join('&')
		}

		const getCoordinateInfo = (params) => {
			let coordinateStr = ''
			params.forEach(function (coordi, index) {
				if (index == 0) {
					coordinateStr += coordi
				}
				if (index != 0 && index % 2 != 0) {
					coordinateStr += ' ' + coordi
				}

				if (index != 0 && index % 2 == 0) {
					coordinateStr += ',' + coordi
				}
			})

			return coordinateStr
		}
		async function geometryUrl(layerWorkSpace, layerId, layerSequence) {
			/* if (layerSequence == 42 || layerSequence == 43 || layerSequence == 44) {
				layerObjectCount.value[layerSequence] = -1
				return
			} */

			/* const geometryFilter =
				layerId.substr(0, 15) === 'GIS_REP_PROJECT' || layerId.substr(0, 14) === 'GIS_FLOOD_AREA'
					? 'ORA_GEOMETRY'
					: 'GEOMETRY' */
			const coordinateForUrl = getCoordinateInfo(spaceStore.polygonSpaceCoordinate.split(','))
			const geometryPram = `intersects(SHAPE,POLYGON((${coordinateForUrl})))`
			const params = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: layerWorkSpace + ':' + layerId,
				outputformat: 'application/json',
				format_options: 'CHARSET:EUC-KR',
				cql_filter: geometryPram,
			}

			const geometryObjectInfo = await axios.get('/gis/wfs?' + getParamString(params))
			if (geometryObjectInfo.data.features) {
				layerObjectCount.value[layerSequence] = geometryObjectInfo.data.features.length
			} else {
				layerObjectCount.value[layerSequence] = -1
			}
			if (geometryObjectInfo.status === 200) {
				console.log('로그.draw 성공', geometryObjectInfo.status)
				CommonUtil.log(log.TARGET.SELECT_DRAW, log.ACTION.SUCCESS, null)
			} else {
				console.error('로그.draw 실패', geometryObjectInfo.status)
				CommonUtil.log(log.TARGET.SELECT_DRAW, log.ACTION.FAIL, null)
			}
		}

		const onCheckedChange = (layer, isCheckd) => {
			if (isCheckd) {
				checkExportLayer.value.push(layer)
			} else {
				checkExportLayer.value.forEach(function (arr, index) {
					if (arr.layerSequence == layer.layerSequence) {
						checkExportLayer.value.splice(index, 1)
					}
				})
			}
		}

		// 팝업 close
		const onClosePopupClick = () => {
			spaceStore.isSpaceSelected = false
			spaceStore.isActive = false
			spaceStore.clear2dSelectionLayer()
			spaceStore.addSpaceDrawInteraction()
		}

		// .csv Button
		const ExportCsvForLine = async (layerWorkSpace, layerId, layerDescription) => {
			console.log('로그.csv 선택')
			CommonUtil.log(log.TARGET.SELECT_CSV_BTN, log.ACTION.CLICK, layerDescription)
			loadingStore.isLoading = true

			const coordinateForUrl = getCoordinateInfo(spaceStore.polygonSpaceCoordinate.split(','))
			const geometryParam = `intersects(SHAPE, POLYGON((${coordinateForUrl})))`
			const params = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: layerWorkSpace + ':' + layerId,
				outputformat: 'csv',
				cql_filter: geometryParam,
			}

			const csvFile = await axios.get(GIS_PROXY + '/ows?' + getParamString(params), {
				headers: { responseType: 'blob' },
			})
			if (csvFile.status === 200) {
				console.log('로그.csv 성공', csvFile.status)
				CommonUtil.log(log.TARGET.SELECT_CSV_DOWNLOAD, log.ACTION.SUCCESS, layerDescription)
			} else {
				console.error('로그.csv 실패', csvFile.status)
				CommonUtil.log(log.TARGET.SELECT_CSV_DOWNLOAD, log.ACTION.FAIL, layerDescription)
			}
			setTimeout(() => (loadingStore.isLoading = false), 1000)

			const url = window.URL.createObjectURL(new Blob(['\ufeff' + csvFile.data], { type: 'text/csv;charset=utf-8' }))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', layerDescription + '.csv')
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}

		// .shp Button
		const ExportShpForLine = async (layerWorkSpace, layerId, layerDescription) => {
			CommonUtil.log(log.TARGET.SELECT_SHP_BTN, log.ACTION.CLICK, layerDescription)
			loadingStore.isLoading = true
			const coordinateForUrl = getCoordinateInfo(spaceStore.polygonSpaceCoordinate.split(','))
			const geoserverQuery = `/gis/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&typeNames=${layerWorkSpace}:${layerId}&outputformat=SHAPE-ZIP&format_options=CHARSET:EUC-KR&srsName=EPSG:4326&`
			const geometryParam = `cql_filter=intersects(SHAPE,POLYGON((${coordinateForUrl})))`

			const url = geoserverQuery + geometryParam
			const link = document.createElement('a')
			link.style.display = 'none'
			document.body.appendChild(link)
			link.setAttribute('href', encodeURI(url))
			link.setAttribute('download', layerDescription)

			link.click()
			document.body.removeChild(link)
			CommonUtil.log(log.TARGET.SELECT_SHP_DOWNLOAD, log.ACTION.SUCCESS, layerDescription)
			setTimeout(() => (loadingStore.isLoading = false), 1000)
		}

		const checkCsvExport = () => {
			checkExportLayer.value.forEach((checkedLayer) => {
				ExportCsvForLine(checkedLayer.layerWorkSpace, checkedLayer.layerId, checkedLayer.layerDescription)
			})
		}

		const checkShpExport = () => {
			checkExportLayer.value.forEach((checkedLayer, index) => {
				setTimeout(() => {
					ExportShpForLine(checkedLayer.layerWorkSpace, checkedLayer.layerId, checkedLayer.layerDescription)
				}, index * 1000)
			})
		}

		// 컬럼 정보 다운로드
		const columnInfo = async () => {
			console.log('로그.칼럼정보 선택')
			CommonUtil.log(log.TARGET.SELECT_COLUMN_BTN, log.ACTION.CLICK, null)
			const response = await fetch(`/guide/column_info.xlsx`)
			const file = await response.blob()
			if (response.status === 200) {
				console.log('로그.칼럼정보 성공', response.status)
				CommonUtil.log(log.TARGET.SELECT_COLUMN_DOWNLOAD, log.ACTION.SUCCESS, null)
			} else {
				console.error('로그.칼럼정보 실패', response.status)
				CommonUtil.log(log.TARGET.SELECT_COLUMN_DOWNLOAD, log.ACTION.FAIL, null)
			}
			if (!file || file.size === 0 || file.type === 'text/html') {
				modalStore.showToast('error', `칼럼정보 다운로드에 실패하셨습니다.`)
				return
			}

			const downloadUrl = window.URL.createObjectURL(file) // 해당 file을 가리키는 url 생성

			const anchorElement = document.createElement('a')
			document.body.appendChild(anchorElement)
			anchorElement.download = `컬럼정보.xlsx` // a tag에 download 속성을 줘서 클릭할 때 다운로드가 일어날 수 있도록 하기
			anchorElement.href = downloadUrl // href에 url 달아주기

			anchorElement.click() // 코드 상으로 클릭을 해줘서 다운로드를 트리거

			document.body.removeChild(anchorElement) // cleanup - 쓰임을 다한 a 태그 삭제
			window.URL.revokeObjectURL(downloadUrl) // cleanup - 쓰임을 다한 url 객체 삭제
			modalStore.showToast('success', `칼럼정보 다운로드를 완료하셨습니다.`)
		}

		return {
			layerObjectCount,
			fragment,
			layerListArr,
			modalStore,
			toolStore,
			closeSpaceList,
			onCheckedChange,
			onClosePopupClick,
			ExportCsvForLine,
			ExportShpForLine,
			checkCsvExport,
			checkShpExport,
			columnInfo,
		}
	},
}
</script>

<style scoped>
.popup .body .bullet-tit:first-child {
	margin-top: 0.5rem;
}
.popup .body .bullet-tit:before {
	background: linear-gradient(to right, #3dabb0 0%, #4eca8f 100%);
}
.building-list ul > li {
	padding: 0.5rem 0.7rem;
	border: 1px solid #dadde5;
	border-radius: 15px;
	display: flex;
	align-items: center;
}
.building-list ul > li .name {
	margin-right: auto;
	font-size: 0.938rem;
	word-break: break-all;
}
.building-list ul > li .button {
	margin-left: auto;
	padding-left: 1rem;
}
.building-list ul > li + li {
	margin-top: 0.6rem;
}
.building-list ul > li .custom-control-label::before,
.layer-list > li .custom-control-label::after {
	top: 0.1rem;
}
.building-list ul > li .custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
	top: 5px;
}
a {
	cursor: pointer;
}

.head {
	cursor: move;
}
</style>
