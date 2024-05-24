<template>
	<div id="areaGroupPopup3" class="layer-popup" :class="{ show: isDetailPopupShow }" style="top: 100px; left: 60%; z-index: 5">
		<div class="head">
			<div class="tit">상세정보</div>
			<a class="btn-close" @click="closePoupClick"><span>팝업창 닫기</span></a>
		</div>
		<div class="body" style="padding-top: 0px; padding-bottom: 0px">
			<div class="tab">
				<ul>
					<li :class="{ active: true }">
						<div class="tab-pane" style="
    top: 20px;
">
							<ul style="margin-bottom: 10px">
								<li>
									<div class="tit">용도별 분석</div>
									<div class="land-list">
										<table class="table data-table hover mb-0">
											<caption>
												지적리스트 정보이며 PNU, 지번, 지목, 면적, 소유자구분코드 정보를 제공합니다.
											</caption>
											<!-- <colgroup>
												<col style="width: 100px" />
												<col style="width: 300px" />
												<col style="width: 300px" />
											</colgroup> -->
											<thead>
												<tr>
													<th scope="col" style="width: 200px;">주용도</th>
													<tr>
														<th scope="col" style="width: 250px;">세부용도</th>
														<th scope="col" style="width: 28px;">합계</th>
													</tr>
												</tr>
											</thead>
											<tbody>
												<tr v-for="top in countArr" :key="top.name" style="width: 300px;">
													<th scope="row" rowspan="top.totalSum" @click="onClickTh(top.name)">{{ top.name }}</th>
													<tr v-for="sub in top.subCount" :key="sub.subName">
														<td style="width: 250px;" @click="onClickTd(top.name, sub.subName)">{{ sub.subName }}</td>
														<td style="width: 30px;">{{ sub.subCount }}</td>
													</tr>
												</tr>
											</tbody>
										</table>
									</div>
								</li>
								<hr style="margin-top:0px;">
							</ul>
							<span style="float: right; font-size: medium">총계 : {{buildingAccount}}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { onMounted, ref, watch, reactive, computed } from 'vue'
import axios from 'axios'
export default {
	props: {
		isDetailPopupShow: {
			type: Boolean,
			default: false,
		},
		countArr: {
			type: Array,
			default: () => [],
		},
		buildingAccount: {
			type: Number,
			default: 0,
		},
		polygonCoodi: {
			type: String,
			default: '',
		},
		/* buildingNameCountList: {
			type: Object,
			default: () => {},
		},

		sumAccount: {
			type: Number,
			default: 0,
		}, */
	},
	emits: ['closeDetailPopup'],
	setup(props, { emit }) {
		onMounted(async () => {
			$('#areaGroupPopup3').draggable({
				containment: 'body',
				scroll: false,
				handle: '.head',
			})

			$('#areaGroupPopup3 .land-list').slimScroll({
				height: '350px',
				railVisible: true,
				wheelStep: 50,
				allowPageScroll: false,
				disableFadeOut: false,
			})
		})

		const getParamString = (params) => {
			return Object.keys(params)
				.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
				.join('&')
		}

		const onClickTh = async (name) => {
			WGMap.removeLayer(WGMap.getLayerById('useName'))
			WGMap.removeLayer(WGMap.getLayerById('useSubName'))
			console.log('name', name)
			console.log('codi',props.polygonCoodi)
			let geometryPram = `INTERSECTS(SHAPE,POLYGON((${props.polygonCoodi})))&&MAIN_USG_NM='${name}'`
			const params = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: 'spta:AL_D198',
				outputformat: 'application/json',
				format_options: 'CHARSET:EUC-KR',
				propertyName: 'SHAPE,MAIN_USG_NM,DTL_USE_NM,PNU',
				cql_filter: geometryPram,
			}
			//isLoading.value = true
			const geometryObjectInfo = await axios.get('/gis/wfs?' + getParamString(params))

			const SELECTED_LAYER = 'useName'
			WGMap.removeLayer(WGMap.getLayerById(SELECTED_LAYER))
			const source = new wg.source.Vector()
			const layer = new wg.layer.Vector({
				id: SELECTED_LAYER,
				source: source,
				style: new wg.style.Style({
					fill: new wg.style.Fill({
						color: 'rgba(255, 0, 0, 1)',
						opacity: 0.5,
					}),
					stroke: new wg.style.Stroke({
						color: '#ff0',
						width: 2,
					}),
				}),
				visible: true,
				zIndex: 4,
			})

			geometryObjectInfo.data.features.forEach((d) => {
				let feature = new wg.format.GeoJSON().readFeature(d.geometry)
				source.addFeature(feature)
			})

			WGMap.addLayer(layer)
		}
		const onClickTd = async (name, subName) => {

			WGMap.removeLayer(WGMap.getLayerById('useName'))
			WGMap.removeLayer(WGMap.getLayerById('useSubName'))
			let geometryPram = `INTERSECTS(SHAPE,POLYGON((${props.polygonCoodi})))&&MAIN_USG_NM='${name}'&&DTL_USE_NM='${subName}'`
			const params = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: 'spta:AL_D198',
				outputformat: 'application/json',
				format_options: 'CHARSET:EUC-KR',
				propertyName: 'SHAPE,MAIN_USG_NM,DTL_USE_NM,PNU',
				cql_filter: geometryPram,
			}
			//isLoading.value = true
			const geometryObjectInfo = await axios.get('/gis/wfs?' + getParamString(params))

			const SELECTED_LAYER = 'useSubName'
			WGMap.removeLayer(WGMap.getLayerById(SELECTED_LAYER))
			const source = new wg.source.Vector()
			const layer = new wg.layer.Vector({
				id: SELECTED_LAYER,
				source: source,
				style: new wg.style.Style({
					fill: new wg.style.Fill({
						color: 'rgba(255, 0, 0, 1)',
						opacity: 0.5,
					}),
					stroke: new wg.style.Stroke({
						color: '#ff0',
						width: 2,
					}),
				}),
				visible: true,
				zIndex: 4,
			})

			geometryObjectInfo.data.features.forEach((d) => {
				let feature = new wg.format.GeoJSON().readFeature(d.geometry)
				source.addFeature(feature)
			})

			WGMap.addLayer(layer)
		}
		const closePoupClick = () => {
			emit('closeDetailPopup')
		}

		return {
			closePoupClick,
			onClickTh,
			onClickTd
		}
	},
}
</script>

<style scoped>
.layer-popup .body {
	height: 450px;
	min-width: 550px;
}
/*  */
a {
	cursor: pointer;
}
.average-price {
	height: 200px;
}

.head {
	cursor: move;
}
.groupName {
	margin-bottom: 15px;
	text-align: center;
	font-size: 20px;
}
</style>
