<template>
	<div id="selectionPopup2" class="layer-popup" :class="{ 'show': isActive }" style="top: 20%; left: 40%; z-index: 5">
		<!-- 임시로 위치 잡음 style은 나중에 지워주세요-->
		<div class="head">
			<div class="tit">토지/건물 추출 다운로드</div>
			<a class="btn-close" id="selectPopup" @click="onClosePopupClick"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<div class="select-ment"></div>
			<div ref="fragment" class="building-list">
				<ul>
					<li v-for="layerInfo in layerInfoArray" :key="layerInfo.layerName">
						<div class="name">
							<div>
								<label v-if="layerInfo.layerName === 'AL_11_D010'">건물</label>
								<label v-else-if="layerInfo.layerName === 'GIS_AL_11_D003'">토지/임야</label>
								<label style="margin-left: 2px"> ( {{ layerInfo.count }} )</label>
							</div>
						</div>
						<div class="button">
							<button
								type="button"
								class="btn btn-info btn-sm"
								style="margin-right: 5px"
								@click="ondownLoadCsvClick(polygonCoodi, layerInfo.layerName)"
							>
								.CSV
							</button>
							<button
								type="button"
								class="btn btn-success btn-sm"
								@click="ondownLoadShpClick(polygonCoodi, layerInfo.layerName)"
							>
								.SHP
							</button>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { onMounted, watch } from 'vue'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
export default {
	props: {
		isActive: {
			type: Boolean,
			defalut: false,
		},
		layerInfoArray: {
			type: Object,
			default: () => {
				return {
					layerName: '',
					count: '',
				}
			},
		},
		polygonCoodi: {
			type: String,
			defalut: '',
		},
	},
	emits: ['change-active'],
	setup(props, { emit }) {
		onMounted(() => {
			addEventHandler()
		})

		watch(
			() => props.isActive,
			() => {
				if (props.isActive) {
					$('#selectionPopup2').show()
				} else {
					$('#selectionPopup2').hide()
				}
			}
		)
		const log = useLog()
		const addEventHandler = () => {
			// 레이어팝업
			$('.layer-popup .btn-close').on('click', function () {
				$(this).parents().parents().removeClass('show')
			})
			// 팝업 이동
			$(function () {
				$('#selectionPopup2').draggable({ containment: 'body', scroll: false })
			})
		}

		const getParamString = (params) => {
			return Object.keys(params)
				.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
				.join('&')
		}

		// 선택된 features CSV로 export
		const ondownLoadCsvClick = async (coordi, layerName) => {
			CommonUtil.log(log.TARGET.LAND_CSV_BTN, log.ACTION.CLICK, layerName)
			let geometryPram
			if (layerName === 'AL_11_D010') {
				geometryPram = `intersects(SHAPE,POLYGON((${coordi})))`
			} else {
				geometryPram = `intersects(SHAPE,POLYGON((${coordi})))`
			}

			let layerTypeName = `spta:${layerName}`
			let propetyRes = ''
			let fileName = ''
			if (layerName === 'AL_11_D010') {
				propetyRes = 'SGG_OID,BJCD,SPAREA_SE_NM,TYPEBD,BDST_STRTS_NM'
				fileName = 'building'
			} else if (layerName === 'GIS_AL_11_D003') {
				propetyRes =
					'ADDR,SGG_CD,SGG_NM,BJD_CD,BJD_NM,MNTN_SE_CD,MNTN_SE_NM,BONBUN,BUBUN,JIMOK_CD,JIMOK_NM,OWN_GBN_CD,OWN_GBN_NM,AREA,STD_DE'
				fileName = 'land'
			}
			const params = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: layerTypeName,
				outputformat: 'csv',
				propertyName: propetyRes,
				cql_filter: geometryPram,
			}

			const csvFile = await axios.get('/gis' + '/ows?' + getParamString(params), {
				headers: { responseType: 'blob' },
			})
			if (csvFile.status === 200) {
				CommonUtil.log(log.TARGET.LAND_CSV_DOWNLOAD, log.ACTION.SUCCESS, layerName)
			} else {
				console.error('로그.Error! Status Code:', csvFile.status)
				CommonUtil.log(log.TARGET.LAND_CSV_DOWNLOAD, log.ACTION.FAIL, layerName)
			}
			const url = window.URL.createObjectURL(new Blob(['\ufeff' + csvFile.data], { type: 'text/csv;charset=utf-8;' }))
			const link = document.createElement('a')
			link.href = url

			link.setAttribute('download', fileName + '.csv')
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}

		// 선택된 features SHP로 export
		const ondownLoadShpClick = async (coordi, layerName) => {
			CommonUtil.log(log.TARGET.LAND_SHP_BTN, log.ACTION.CLICK, layerName)
			const geoserverQuery = `/gis/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&typeNames=${layerName}&outputformat=SHAPE-ZIP&format_options=CHARSET:EUC-KR&`
			console.log('geoserverQuery', geoserverQuery)
			let geometryPram
			if (layerName === 'AL_11_D010') {
				geometryPram = `cql_filter=intersects(SHAPE,POLYGON((${coordi})))`
			} else {
				geometryPram = `cql_filter=intersects(SHAPE,POLYGON((${coordi})))`
			}
			if (layerName === 'AL_11_D010') {
				console.log('선택 SHP', layerName)
			} else {
				console.log('선택 SHP', layerName)
			}
			const url = geoserverQuery + geometryPram
			const link = document.createElement('a')
			link.style.display = 'none'
			document.body.appendChild(link)
			link.setAttribute('href', encodeURI(url))
			link.setAttribute('download', layerName)

			link.click()
			document.body.removeChild(link)
			CommonUtil.log(log.TARGET.LAND_SHP_DOWNLOAD, log.ACTION.SUCCESS, layerName)
		}

		// 팝업 close
		const onClosePopupClick = () => {
			WGMap.removeLayer(WGMap.getLayerById('SELECTED_BUILDING'))
			const vectorLayer = WGMap.getLayerById('drawPolygonLayer')
			if (vectorLayer) {
				const source = vectorLayer.getSource()
				const polygonFeature = source.getFeatures()[0]
				source.removeFeature(polygonFeature)
			}
			emit('change-active', '')
		}

		return { ondownLoadCsvClick, ondownLoadShpClick, onClosePopupClick }
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
