<template>
	<div
		id="areaGroupPopup2"
		class="layer-popup"
		:class="{ show: isDetailPopupShow }"
		style="top: 100px; left: 60%; z-index: 5"
	>
		<div class="head">
			<div class="tit">상세정보</div>
			<a class="btn-close" @click="closePoupClick"><span>팝업창 닫기</span></a>
		</div>
		<template v-if="countArray.length == 0">
			<div class="body" style="padding-top: 0px; padding-bottom: 0px; height: 160px">
				<!-- <div class="groupName">{{ groupDetailArr[0].mngGrpNm }}</div> -->
				<div class="tab">
					<ul>
						<li :class="{ active: true }">
							<div class="tab-pane" style="top: 20px">
								<ul style="margin-bottom: 10px">
									<li>
										<div class="tit">공동주택 분석</div>
										<div class="land-list">
											<table class="table data-table hover mb-0">
												<colgroup>
													<col style="width: 300px" />
													<col style="width: 300px" />
												</colgroup>
											</table>
										</div>
									</li>
								</ul>
								<span style="float: right; font-size: medium">총계 : {{ buildingAccount }}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</template>
		<template v-if="countArray.length == 1">
			<div class="body" style="padding-top: 0px; padding-bottom: 0px; height: 160px">
				<!-- <div class="groupName">{{ groupDetailArr[0].mngGrpNm }}</div> -->
				<div class="tab">
					<ul>
						<li :class="{ active: true }">
							<div class="tab-pane" style="top: 20px">
								<ul style="margin-bottom: 10px">
									<li>
										<div class="tit">
											공동주택 분석
											<span style="float: right; font-size: medium; margin-left: 110px; padding-top: 5px"
												>공동주택호수 : 총 {{ sumAccount }} 세대</span
											>
										</div>
										<div class="land-list">
											<table class="table data-table hover mb-0">
												<caption>
													지적리스트 정보이며 PNU, 지번, 지목, 면적, 소유자구분코드 정보를 제공합니다.
												</caption>
												<colgroup>
													<col style="width: 300px" />
													<col style="width: 300px" />
													<col style="width: 300px" />
												</colgroup>
												<thead>
													<tr>
														<th scope="col">공동주택 구분</th>
														<th scope="col">세대수</th>
														<th scope="col">합계</th>
													</tr>
												</thead>
												<tbody>
													<tr
														v-for="building in countArray"
														:key="building.pnu"
														:id="building.pnu"
														@click="onClickTrBuilding($event)"
													>
														<th scope="row">{{ building.name }}</th>
														<td>{{ building.aptCpx }}</td>
														<td>{{ building.count }}</td>
													</tr>
												</tbody>
											</table>
										</div>
									</li>
								</ul>
								<span style="float: right; font-size: medium">총계 : {{ buildingAccount }}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</template>
		<template v-if="countArray.length == 2">
			<div class="body" style="padding-top: 0px; padding-bottom: 0px; height: 190px">
				<!-- <div class="groupName">{{ groupDetailArr[0].mngGrpNm }}</div> -->
				<div class="tab">
					<ul>
						<li :class="{ active: true }">
							<div class="tab-pane" style="top: 20px">
								<ul style="margin-bottom: 10px">
									<li>
										<div class="tit">
											공동주택 분석
											<span style="float: right; font-size: medium; margin-left: 110px; padding-top: 5px"
												>공동주택호수 : 총 {{ sumAccount }} 세대</span
											>
										</div>
										<div class="land-list">
											<table class="table data-table hover mb-0">
												<caption>
													지적리스트 정보이며 PNU, 지번, 지목, 면적, 소유자구분코드 정보를 제공합니다.
												</caption>
												<colgroup>
													<col style="width: 300px" />
													<col style="width: 300px" />
													<col style="width: 300px" />
												</colgroup>
												<thead>
													<tr>
														<th scope="col">공동주택 구분</th>
														<th scope="col">세대수</th>
														<th scope="col">합계</th>
													</tr>
												</thead>
												<tbody>
													<tr
														v-for="building in countArray"
														:key="building.pnu"
														:id="building.pnu"
														@click="onClickTrBuilding($event)"
													>
														<th scope="row">{{ building.name }}</th>
														<td>{{ building.aptCpx }}</td>
														<td>{{ building.count }}</td>
													</tr>
												</tbody>
											</table>
										</div>
									</li>
								</ul>
								<span style="float: right; font-size: medium">총계 : {{ buildingAccount }}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</template>
		<template v-if="countArray.length == 3">
			<div class="body" style="padding-top: 0px; padding-bottom: 0px; height: 220px">
				<!-- <div class="groupName">{{ groupDetailArr[0].mngGrpNm }}</div> -->
				<div class="tab">
					<ul>
						<li :class="{ active: true }">
							<div class="tab-pane" style="top: 20px">
								<ul style="margin-bottom: 10px">
									<li>
										<div class="tit">
											공동주택 분석
											<span style="float: right; font-size: medium; margin-left: 110px; padding-top: 5px"
												>공동주택호수 : 총 {{ sumAccount }} 세대</span
											>
										</div>
										<div class="land-list">
											<table class="table data-table hover mb-0">
												<caption>
													지적리스트 정보이며 PNU, 지번, 지목, 면적, 소유자구분코드 정보를 제공합니다.
												</caption>
												<colgroup>
													<col style="width: 300px" />
													<col style="width: 300px" />
													<col style="width: 300px" />
												</colgroup>
												<thead>
													<tr>
														<th scope="col">공동주택 구분</th>
														<th scope="col">세대수</th>
														<th scope="col">합계</th>
													</tr>
												</thead>
												<tbody>
													<tr
														v-for="building in countArray"
														:key="building.pnu"
														:id="building.pnu"
														@click="onClickTrBuilding($event)"
													>
														<th scope="row">{{ building.name }}</th>
														<td>{{ building.aptCpx }}</td>
														<td>{{ building.count }}</td>
													</tr>
												</tbody>
											</table>
										</div>
									</li>
								</ul>
								<span style="float: right; font-size: medium">총계 : {{ buildingAccount }}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</template>
		<template v-if="countArray.length > 3">
			<div class="body" style="padding-top: 0px; padding-bottom: 0px; height: 300px">
				<!-- <div class="groupName">{{ groupDetailArr[0].mngGrpNm }}</div> -->
				<div class="tab">
					<ul>
						<li :class="{ active: true }">
							<div class="tab-pane" style="top: 20px">
								<ul style="margin-bottom: 10px">
									<li>
										<div class="tit">
											공동주택 분석
											<span style="float: right; font-size: medium; margin-left: 110px; padding-top: 5px"
												>공동주택호수 : 총 {{ sumAccount }} 세대</span
											>
										</div>
										<div class="land-list">
											<table class="table data-table hover mb-0">
												<caption>
													지적리스트 정보이며 PNU, 지번, 지목, 면적, 소유자구분코드 정보를 제공합니다.
												</caption>
												<colgroup>
													<col style="width: 300px" />
													<col style="width: 300px" />
													<col style="width: 300px" />
												</colgroup>
												<thead>
													<tr>
														<th scope="col">공동주택 구분</th>
														<th scope="col">세대수</th>
														<th scope="col">합계</th>
													</tr>
												</thead>
												<tbody>
													<tr
														v-for="building in countArray"
														:key="building.pnu"
														:id="building.pnu"
														@click="onClickTrBuilding($event)"
													>
														<th scope="row">{{ building.name }}</th>
														<td>{{ building.aptCpx }}</td>
														<td>{{ building.count }}</td>
													</tr>
												</tbody>
											</table>
										</div>
									</li>
								</ul>
								<span style="float: right; font-size: medium">총계 : {{ buildingAccount }}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</template>
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
		buildingNameCountList: {
			type: Object,
			default: () => {},
		},
		countArray: {
			type: Array,
			default: () => [],
		},
		sumAccount: {
			type: Number,
			default: 0,
		},
		buildingAccount: {
			type: Number,
			default: 0,
		},
	},
	emits: ['closeDetailPopup'],
	setup(props, { emit }) {
		onMounted(async () => {
			$('#areaGroupPopup2').draggable({
				containment: 'body',
				scroll: false,
				handle: '.head',
			})
		})

		let layer = null
		const getParamString = (params) => {
			return Object.keys(params)
				.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
				.join('&')
		}

		const onClickTrBuilding = async (event) => {
			const SELECTED_LAYER = 'publicGeometry'

			WGMap.removeLayer(WGMap.getLayerById(SELECTED_LAYER))
			const source = new wg.source.Vector()
			layer = new wg.layer.Vector({
				id: SELECTED_LAYER,
				source: source,
				style: new wg.style.Style({
					image: new wg.style.Icon({
						src: '/assets/images/marker_small.png',
						scale: 1,
						color: `rgba(255,255,0, 1)`,
					}),
				}),
				visible: true,
				zIndex: 10,
			})

			const pnuArr = event.target.parentNode.id.split(',')

			// cql_filter가 길어 나눠서 get 요청 (post 요청 xml 오류나서 get으로 요청 유지)
			let bunchNumber = Math.floor(pnuArr.length / 200)
			for (let k = 0; k <= bunchNumber; k++) {
				let standLength = pnuArr.length >= 200 * k + 200 ? 200 * k + 200 : pnuArr.length
				let pnuStr = 'PNU='
				for (let j = 200 * k; j < standLength; j++) {
					if (j == standLength - 1) {
						pnuStr += pnuArr[j]
					} else {
						pnuStr += pnuArr[j] + 'OR PNU='
					}
				}

				const params = {
					service: 'WFS',
					version: '1.0.0',
					request: 'GetFeature',
					typeName: 'spta:GIS_AL_D197',
					outputformat: 'application/json',
					format_options: 'CHARSET:EUC-KR',
					cql_filter: pnuStr,
				}

				WGMap.removeLayer(WGMap.getLayerById('publicGeometry'))
				const geometryObjectInfo = await axios.get('/gis/wfs?' + getParamString(params))
				geometryObjectInfo.data.features.forEach((d) => {
					let feature = new wg.format.GeoJSON().readFeature(d.geometry)
					source.addFeature(feature)
				})
			}
			WGMap.addLayer(layer)
		}
		const closePoupClick = () => {
			emit('closeDetailPopup')
		}

		return {
			closePoupClick,
			onClickTrBuilding,
		}
	},
}
</script>

<style scoped>
.layer-popup .body {
	/* min-height: 220px; */
	/* min-width: 850px; */
}
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
.land-list {
	height: auto;
}
</style>
