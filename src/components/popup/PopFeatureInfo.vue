<template>
	<div id="selectionPopup" class="feature-info-popup feature-info show" style="top: 30%; left: 40%">
		<!-- 임시로 위치 잡음 style은 나중에 지워주세요-->
		<div class="head">
			<div class="tit">정보보기</div>
			<a class="btn-close" id="selectPopup" @click="onClose()"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<table>
				<colgroup>
					<col style="width: 250px" />
					<col style="width: 10px" />
					<col style="width: 250px" />
				</colgroup>
				<tr>
					<td style="vertical-align: top">
						<span v-if="message">{{ message }}</span>
						<!-- 트리 -->
						<Tree v-else :nodes="tree.nodes" :config="tree.config" @nodeFocus="onFocusTreeNode" />
					</td>
					<td style="border-right: #ddd solid 1px">&nbsp;</td>
					<td style="vertical-align: top">
						<div style="width: 100%; text-align: center; font-size: 12px">
							<!-- 테이블 -->
							<table
								style="width: 250px; margin-left: 10px"
								class="data-table"
								v-if="Object.keys(properties).length > 0"
							>
								<colgroup>
									<col style="width: 50%" />
									<col style="width: 50%" />
								</colgroup>
								<thead>
									<tr>
										<th>속성명</th>
										<th>속성값</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="pKey in Object.keys(properties)" :key="pKey">
										<td v-if="pKey != 'undefined' && pKey != 'bbox'">{{ pKey }}</td>
										<td v-if="pKey != 'undefined' && pKey != 'bbox'">{{ properties[pKey] }}</td>
									</tr>
								</tbody>
							</table>
							<div v-else class="no-data-message">
								<p>항목을 선택해 주세요</p>
							</div>
						</div>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
let vworldRes = null

window.parseResponse = (data) => {
	vworldRes = data
}
import 'vue3-treeview/dist/style.css'
import { ref, watch, onMounted } from 'vue'
import { useLayerStore } from '@/stores/layer'
import { useViewStore } from '@/stores/view'
import mappingJSON from '@/code/codeToKor.json'
import vworld from '@/composition/vworld'
import Tree from 'vue3-treeview'
export default {
	components: {
		Tree,
	},
	props: {
		coordinate: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['close'],
	setup(props, { emit }) {
		let message = ref('')
		const layerStore = useLayerStore()
		const viewStore = useViewStore()
		const { VITE_VWORLD_API_KEY } = import.meta.env
		const vwolrdDomain = import.meta.env.VITE_VWORLD_DOMAIN
		const tree = ref({
			config: {
				roots: [],
				padding: 5,
			},
			nodes: {},
		})
		const jsonData = ref(null)

		const properties = ref({})

		onMounted(() => {
			// window.jsonpCallback = (data) => {
			// 	jsonData.value = data
			// 	console.log(data)
			// }
			console.log('피쳐인포 마운티드')

			$('.feature-info-popup .body').slimScroll({
				width: '100%',
				height: '100%',
				railVisible: true,
				wheelStep: 10,
				allowPageScroll: false,
				disableFadeOut: false,
			})

			addEventHandler()
			getFeatureInfo()
			getVworldFeatureInfo()
		})

		const getFeatureInfo = () => {
			const url = getFeatureInfoUrl()
			const vworldUrl = getVworldFeatureInfo()
			console.log('result', url)
			if (!url && !vworldUrl) {
				message.value = '조회된 데이터가 없습니다.'
				return
			}

			message.value = '조회 중입니다...'
			if (url && vworldUrl) {
				fetch(url)
					.then((res) => res.json())
					.then((res) => {
						console.log('res', res)
						let orginal = res.features

						fetch({
							url: vworldUrl,
							type: 'jsonp',
							jsonpCallback: 'parseResponse',
						}).then(function (data) {
							console.log('data -> vworldRes :: ', vworldRes)
						})

						const script = document.createElement('script')
						script.src = `${vworldUrl}${
							vworldUrl.includes('?') ? '&' : '?'
						}output=text/javascript&format_options=callback:parseResponse`
						document.body.appendChild(script)

						setTimeout(() => {
							let vworldVer = vworldRes?.features || []

							let res = [...orginal, ...vworldVer]
							let roots = []
							let nodes = {}
							if (res.length === 0) {
								message.value = '조회된 데이터가 없습니다.'
								return
							}
							res.forEach((feature) => {
								message.value = ''

								const layerName = feature.id.split('.')[0]

								console.log('$$$ layerName >>>> ', layerName)
								// 루트에 없다면 레이어명으로 루트 및 루트노드 추가
								if (roots.filter((root) => root === layerName).length === 0) {
									roots.push(layerName)
									nodes[layerName] = {
										id: layerName,
										text: layerName,
										children: [],
									}
								}

								// 루트 노드에 피처노드 id 추가
								nodes[layerName].children.push(feature.id)
								Object.keys(nodes)
									.filter((nodeName) => nodeName === layerName)
									.forEach((layerName) => {
										if (nodes[layerName].children?.length > 0) {
											nodes[layerName].text =
												(mappingJSON[layerName]?.value || layerName) + ` (${nodes[layerName].children.length})`
										}
									})

								let textStr = getNodeText(layerName, feature)
								// 피쳐노드 추가
								nodes[feature.id] = {
									id: feature.id,
									text: textStr,
									// text: feature.properties[pkey],
									data: feature,
								}
							})

							tree.value = {
								config: {
									roots,
									padding: tree.value.config.padding,
								},
								nodes,
							}
							properties.value = {}
							$('.node-text').css('font-size', '12px')
						}, 3000)
					})
					.catch((error) => {
						message.value = `정보 조회중 오류가 발생했습니다.
					잠시후에 다시 이용해주세요.`
					})
				console.log('$$$$ tree :::: ', tree)
			}
			if (url && !vworldUrl) {
				fetch(url)
					.then((res) => res.json())
					.then((res) => {
						let roots = []
						let nodes = {}
						if (res.features.length === 0) {
							message.value = '조회된 데이터가 없습니다.'
							return
						}
						res.features.forEach((feature) => {
							message.value = ''

							const layerName = feature.id.split('.')[0]

							console.log('$$$ layerName >>>> ', layerName)
							// 루트에 없다면 레이어명으로 루트 및 루트노드 추가
							if (roots.filter((root) => root === layerName).length === 0) {
								roots.push(layerName)
								nodes[layerName] = {
									id: layerName,
									text: layerName,
									children: [],
								}
							}

							// 루트 노드에 피처노드 id 추가
							nodes[layerName].children.push(feature.id)
							Object.keys(nodes)
								.filter((nodeName) => nodeName === layerName)
								.forEach((layerName) => {
									if (nodes[layerName].children?.length > 0) {
										nodes[layerName].text =
											(mappingJSON[layerName]?.value || layerName) + ` (${nodes[layerName].children.length})`
									}
								})

							let textStr = getNodeText(layerName, feature)
							// 피쳐노드 추가
							nodes[feature.id] = {
								id: feature.id,
								text: textStr,
								// text: feature.properties[pkey],
								data: feature,
							}
						})

						tree.value = {
							config: {
								roots,
								padding: tree.value.config.padding,
							},
							nodes,
						}
						properties.value = {}
						$('.node-text').css('font-size', '12px')
					})
					.catch((error) => {
						message.value = `정보 조회중 오류가 발생했습니다.
					잠시후에 다시 이용해주세요.`
					})
				console.log('$$$$ tree :::: ', tree)
			}
			if (!url && vworldUrl) {
				fetch({
					url: vworldUrl,
					type: 'jsonp',
					jsonpCallback: 'parseResponse',
				}).then(function (data) {
					console.log('data -> vworldRes :: ', vworldRes)
				})

				const script = document.createElement('script')
				script.src = `${vworldUrl}${
					vworldUrl.includes('?') ? '&' : '?'
				}output=text/javascript&format_options=callback:parseResponse`
				document.body.appendChild(script)

				setTimeout(() => {
					let res = vworldRes
					console.log('vworldRes', vworldRes)

					let roots = []
					let nodes = {}
					if (res?.features.length === 0 || res === null) {
						message.value = '조회된 데이터가 없습니다.'
						return
					}
					res.features.forEach((feature) => {
						message.value = ''

						const layerName = feature.id.split('.')[0]

						console.log('$$$ layerName >>>> ', layerName)
						// 루트에 없다면 레이어명으로 루트 및 루트노드 추가
						if (roots.filter((root) => root === layerName).length === 0) {
							roots.push(layerName)
							nodes[layerName] = {
								id: layerName,
								text: layerName,
								children: [],
							}
						}

						// 루트 노드에 피처노드 id 추가
						nodes[layerName].children.push(feature.id)
						Object.keys(nodes)
							.filter((nodeName) => nodeName === layerName)
							.forEach((layerName) => {
								if (nodes[layerName].children?.length > 0) {
									nodes[layerName].text =
										(mappingJSON[layerName]?.value || layerName) + ` (${nodes[layerName].children.length})`
								}
							})

						let textStr = getNodeText(layerName, feature)
						// 피쳐노드 추가
						nodes[feature.id] = {
							id: feature.id,
							text: textStr,
							// text: feature.properties[pkey],
							data: feature,
						}
					})

					tree.value = {
						config: {
							roots,
							padding: tree.value.config.padding,
						},
						nodes,
					}
					properties.value = {}
					$('.node-text').css('font-size', '12px')
					console.log('$$$$ tree :::: ', tree)
				}, 3000)
			}
		}

		const getVworldFeatureInfo = () => {
			const vwolrdLayerName = layerStore.visibleLayers.filter((layer) => layer.layerSourceCode === 'VWORLD')

			if (vwolrdLayerName.length === 0) {
				return null
			}

			const viewResolution = /** @type {number} */ (WGMap.getView().getResolution())
			let vWorldNameArr = vwolrdLayerName.map((layer) => {
				return layer.layerId
			})
			const vWorldNameStr = vWorldNameArr.join(',').toString().toLowerCase()

			let bbox = WGMap.getView().calculateExtent().join(',')

			const firstLayer = WGMap.getAllLayers().filter((l) => l.get('id').startsWith('wms'))[0]

			if (!firstLayer) {
				onClose()
				return
			}
			const vWorldurlStr = firstLayer.getSource().getFeatureInfoUrl(props.coordinate, viewResolution, 'EPSG:3857', {
				INFO_FORMAT: 'text/javascript',
			})

			const url = new URL(location.origin + '/' + vWorldurlStr)
			let params = Object.fromEntries(url.searchParams)

			params = Object.assign(params, {
				LAYERS: vWorldNameStr,
				KEY: VITE_VWORLD_API_KEY,
				QUERY_LAYERS: vWorldNameStr,
				FEATURE_COUNT: 10,
				DOMAIN: vwolrdDomain,
			})

			// return url.origin + '/vworld/req/wms' + '?' + WGMap.getParamString(params)
			return 'https://api.vworld.kr' + '/req/wms' + '?' + WGMap.getParamString(params)
		}

		watch(
			() => props.coordinate,
			() => {
				vworldRes = null

				getFeatureInfo()
			}
		)

		const getFeatureInfoUrl = () => {
			let layers = layerStore.visibleLayers.filter((layer) => layer.layerWorkSpace === 'spta')

			if (layers.length === 0) {
				return null
			}

			const queryLayersStr = layers.map((layer) => layer.layerWorkSpace + ':' + layer.layerId).join(',')

			const viewResolution = /** @type {number} */ (WGMap.getView().getResolution())
			const firstLayer = WGMap.getAllLayers().filter((l) => l.get('id').startsWith('wms'))[0]
			if (!firstLayer) {
				onClose()
				return
			}
			const urlStr = firstLayer.getSource().getFeatureInfoUrl(props.coordinate, viewResolution, 'EPSG:3857', {
				INFO_FORMAT: 'application/json',
			})
			console.log('location.origin + urlStr', location.origin + urlStr)
			console.log('urlStr', location.origin + '/' + urlStr)
			const url = new URL(location.origin + '/' + urlStr)
			let params = Object.fromEntries(url.searchParams)

			params = Object.assign(params, {
				LAYERS: queryLayersStr,
				QUERY_LAYERS: queryLayersStr,
				FEATURE_COUNT: 10,
			})

			return url.origin + '/gis/wms' + '?' + WGMap.getParamString(params)
		}

		const onClose = () => {
			emit('close')
		}

		const onFocusTreeNode = (node) => {
			console.log('onFocusTreeNode', node)
			if (!node.data) {
				properties.value = {}
				return
			}
			let result = {}
			Object.keys(node.data.properties).forEach(
				(pKey) =>
					(result[findKeysWithSubString(mappingJSON, node.parent).attributes[pKey]] = node.data.properties[pKey])
			)

			properties.value = result
		}

		const findKeysWithSubString = (obj, substring) => {
			let matchKeys = ''

			for (const key in obj) {
				if (new RegExp(key, 'i').test(substring)) {
					matchKeys = key
				}
			}

			return obj[matchKeys]
		}

		const addEventHandler = () => {
			$(function () {
				$('#selectionPopup').draggable({ containment: 'body', scroll: false, handle: '.head' })
			})
		}

		// 팝업 왼쪽 레이어명 아래 NODE를 의미 있는 TEXT로 교체
		function getNodeText(layerName, feature) {
			// node 텍스트 기준
			// 자치구 경계 GIS_ADM_SGG / SGG_NM 단독  EX) 강동구
			// 행정동 경계 GIS_G001 / NAM 단독  EX) 청운효자동
			// 법정동 경계 GIS_LP_AA_EMD / EMD_NM 단독  EX) 창전동
			// 기초구역 GIS_TL_KODIS_BAS / 기초구역 관리번호 : BAS_MGT_SN EX) 기초구역 관리번호 : 1144000098

			// 건물_SDW GIS_GI_TL_SPBD_BULD_A / 건물관리번호 : BD_MGT_SN EX) 건물관리번호 : 1123010200101020056036590
			// 건물(도로명안내시스템) GIS_TL_SPBD_BULD / 건물관리번호 : BD_MGT_SN EX) 건물관리번호 : 1123010200100390573040879
			// 건물군(도로명안내시스템) GIS_TL_SPBD_EQB / 건물군 일련번호 : EQB_MAN_SN EX) 건물군 일련번호 : 352
			// 건물통합정보 AL_11_D010 / PNU : PNU EX) PNU : 1123010200100390429
			// 건물연령정보 GIS_AL_D196 / PNU : PNU EX) PNU : 1120012200101370010
			// 건물용도별정보 AL_D198 /  PNU : PNU EX) PNU : 1120010600101100000
			// 공동주택정보 GIS_AL_D197 / PNU : PNU EX) PNU : 1120010800102650085
			// 연속지적도 GIS_LP_PA_CBND / PNU : PNU EX) PNU : 1120010600101790002
			// 지하철 역사 GIS_TL_SPSB_STATN / KOR_SUB_NM 단독 EX) 용답역

			// 토지거래허가구역(부동산종합공부) GIS_LSMD_CONT_UQ141 / 관리번호 : MNUM EX) 관리번호 : 61100001120020222455UQQ6000001001
			// 토지거래허가구역(SDW) GIS_TL_B_UQ141_SDW / 관리번호 : MNUM EX) 관리번호 : 61100001114020230172UQQ6000001001
			// 재개발구역 GIS_TL_C_UD501 / 관리번호 : MNUM EX) 관리번호 : 30700001129020060001UDR1000001001
			// 개발제한구역 GIS_TL_C_UD801 / 관리번호 : MNUM EX) 관리번호 : 61100001111020180000UDV1000443001

			// 개발제한구역 lt_c_ud801 / 관리번호 : MNUM EX) 관리번호 : 15000001141000000000UDV1000001001
			// 경관지구 lt_c_uq121 / 관리번호 : MNUM EX) 관리번호 : 15000001111020000000UQF1100071000
			// 고도지구 lt_c_uq123 / 관리번호 : MNUM EX) 관리번호 : 61100001111020100001UQH1000001001
			// 국토계획구역 lt_c_uq141 / 관리번호 : MNUM EX) 관리번호 : 61100001111020100005UQQ3000001001
			// 도시자연공원구역 lt_c_uq162 / 관리번호 : MNUM EX) 관리번호 : 61100001111020200254UQT6000001003
			// 도시지역 lt_c_uq111 / 관리번호 : MNUM EX) 관리번호 : 15000001111020030051UQA1220001001

			// 개별공시지가 GIS_OPEN_JIGA_M / PNU(LAND_CD로 되어 있음) : LAND_CD EX) PNU : 1111017500101810079
			// 개별주택가격 GIS_APMMHP_LAND / PNU : PNU EX) PNU : 1111017400105950219
			// 부동산 중개업소 GIS_OPEN_BRKPGOFC_M / 중개업소명 : CMP_NM EX) 중개업소명 : 광신부동산중개인사무소

			// 사업체조사(2022년) GIS_TB_COMPANY_RESEARCH / 사업체 관리번호 : SN EX) 사업체 관리번호 : 1063123
			// 생활권 경계(18년 3월) GIS_UPIS_SHP_ZON100  / ID : ID EX) ID : 생활권경계_002
			// 생활권 중심지(18년 3월) GIS_UPIS_SHP_ZON500 / ID : ID EX) ID : 중심지_35
			let textStr = ''
			if (layerName === 'GIS_ADM_SGG') {
				textStr = '시군구명 : ' + feature.properties.SGG_NM
			} else if (layerName === 'GIS_G001') {
				textStr = '명칭 : ' + feature.properties.NAM
			} else if (layerName === 'GIS_LP_AA_EMD') {
				textStr = '읍면동명 : ' + feature.properties.EMD_NM
			} else if (layerName === 'GIS_TL_KODIS_BAS') {
				textStr = '기초구역 관리번호 : ' + feature.properties.BAS_MGT_SN
			} else if (layerName === 'GIS_GI_TL_SPBD_BULD_A') {
				textStr = '건물 관리번호 : ' + feature.properties.BD_MGT_SN
			} else if (layerName === 'GIS_TL_SPBD_BULD') {
				textStr = '건물 관리번호 : ' + feature.properties.BD_MGT_SN
			} else if (layerName === 'GIS_TL_SPBD_EQB') {
				textStr = '건물군 일련번호 : ' + feature.properties.EQB_MAN_SN
			} else if (layerName === 'AL_11_D010') {
				textStr = 'PNU : ' + feature.properties.PNU
			} else if (layerName === 'GIS_AL_D196') {
				textStr = 'PNU : ' + feature.properties.PNU
			} else if (layerName === 'AL_D198') {
				textStr = 'PNU : ' + feature.properties.PNU
			} else if (layerName === 'GIS_AL_D197') {
				textStr = 'PNU : ' + feature.properties.PNU
			} else if (layerName === 'GIS_LP_PA_CBND') {
				textStr = 'PNU : ' + feature.properties.PNU
			} else if (layerName === 'GIS_TL_SPSB_STATN') {
				textStr = '지하철역사명 : ' + feature.properties.KOR_SUB_NM
			} else if (layerName === 'GIS_LSMD_CONT_UQ141') {
				textStr = '관리번호 : ' + feature.properties.MNUM
			} else if (layerName === 'GIS_LT_B_UQ141_SDW') {
				textStr = '관리번호 : ' + feature.properties.MNUM
			} else if (layerName === 'GIS_LT_C_UD501') {
				textStr = '관리번호 : ' + feature.properties.MNUM
			} else if (layerName === 'GIS_LT_C_UD801') {
				textStr = '관리번호 : ' + feature.properties.MNUM
			} else if (layerName === 'lt_c_ud801') {
				textStr = feature.properties.uname + '(관리번호:' + feature.properties.mnum + ')'
			} else if (layerName === 'lt_c_uq121') {
				textStr = feature.properties.uname + '(관리번호:' + feature.properties.mnum + ')'
			} else if (layerName === 'lt_c_uq123') {
				textStr = feature.properties.uname + '(관리번호:' + feature.properties.mnum + ')'
			} else if (layerName === 'lt_c_uq141') {
				textStr = feature.properties.uname + '(관리번호:' + feature.properties.mnum + ')'
			} else if (layerName === 'lt_c_uq162') {
				textStr = feature.properties.uname + '(관리번호:' + feature.properties.mnum + ')'
			} else if (layerName === 'lt_c_uq111') {
				textStr = feature.properties.uname + '(관리번호:' + feature.properties.mnum + ')'
			} else if (layerName === 'GIS_OPEN_JIGA_M') {
				textStr = 'PNU : ' + feature.properties.LAND_CD
			} else if (layerName === 'GIS_APMMHP_LAND') {
				textStr = 'PNU : ' + feature.properties.PNU
			} else if (layerName === 'GIS_OPEN_BRKPGOFC_M') {
				textStr = '중개업소명 : ' + feature.properties.CMP_NM
			} else if (layerName === 'GIS_TB_COMPANY_RESEARCH') {
				textStr = '사업체 관리번호 : ' + feature.properties.SN
			} else if (layerName === 'GIS_UPIS_SHP_ZON100') {
				textStr = 'ID : ' + feature.properties.ID
			} else if (layerName === 'GIS_UPIS_SHP_ZON500') {
				textStr = 'ID : ' + feature.properties.ID
			} else {
				textStr = feature.id.replace(layerName + '.', '')
			}

			return textStr
		}

		return { message, tree, properties, getFeatureInfo, onFocusTreeNode, onClose }
	},
}
</script>

<style scoped>
.head {
	cursor: move;
}
.body {
	max-height: 400px;
}

.feature-info-popup {
	min-width: 450px;
	box-shadow: rgba(0, 0, 0, 0.2) 5px 5px 10px;
	display: none;
	position: absolute;
}
.feature-info-popup.show {
	display: block;
}
.feature-info-popup .head {
	padding: 13px 20px;
	background-color: #2c17ca;
	display: flex;
	position: relative;
}
.feature-info-popup .head .tit {
	margin-right: auto;
	color: #fff;
	font-size: 1rem;
}
.feature-info-popup .head .btn-close {
	width: 46px;
	height: 46px;
	cursor: pointer;
	display: inline-block;
	position: absolute;
	top: 0;
	right: 0;
}
.feature-info-popup .head .btn-close span {
	display: none;
}
.feature-info-popup .head .btn-close:before,
.feature-info-popup .head .btn-close:after {
	width: 20px;
	height: 2px;
	content: '';
	background-color: #fff;
	position: absolute;
	top: 22px;
	right: 12px;
}
.feature-info-popup .head .btn-close:before {
	transform: rotate(-135deg);
	-webkit-transform: rotate(-135deg);
	-moz-transform: rotate(-135deg);
	-o-transform: rotate(-135deg);
	-ms-transform: rotate(-135deg);
}
.feature-info-popup .head .btn-close:after {
	transform: rotate(135deg);
	-webkit-transform: rotate(135deg);
	-moz-transform: rotate(135deg);
	-o-transform: rotate(135deg);
	-ms-transform: rotate(135deg);
}
.feature-info-popup .body {
	min-height: 100px;
	padding: 20px;
	background-color: #fff;
}
.feature-info-popup .body .tit {
	margin-bottom: 10px;
	font-size: 1.063rem;
	color: #6f6f6f;
	display: flex;
}
.feature-info-popup .body .tit:before {
	width: 3px;
	height: 16px;
	margin-right: 7px;
	content: '';
	background-color: #21b699;
	border-radius: 5px;
	display: inline-block;
	position: relative;
	top: 2px;
}
.feature-info-popup .body .large-tit {
	height: 39px;
	margin: 0 0 20px 0;
	padding: 7px 15px;
	background-color: #6e41de;
	border-radius: 70px;
	box-sizing: border-box;
	color: #fff;
	font-size: 1.188rem;
	font-weight: normal;
	position: relative;
}
.feature-info-popup .search-condition {
	margin-bottom: 15px;
}
.feature-info-popup .search-condition .tr {
	display: flex;
}
.feature-info-popup .search-condition .form-group {
	display: flex;
	align-items: center;
}
.feature-info-popup .search-condition .form-group .lable {
	margin-right: 10px;
}
.feature-info-popup .search-condition .form-group + .form-group {
	margin-left: 20px;
}
.feature-info-popup .search-condition .form-group .form-control + .form-control {
	margin-left: 5px;
}
.feature-info-popup .search-condition .action-btn-group {
	margin-left: auto;
}
.feature-info-popup .search-condition .action-btn-group .btn {
	height: 28px;
	padding: 1px 15px 0 15px;
}
.feature-info-popup .search-condition .action-btn-group .btn .ico {
	width: 15px;
	height: 15px;
	background-size: 390px auto;
}
.feature-info-popup .search-condition .action-btn-group .btn .ico.ico-search {
	background-position: -19px 0;
}

.no-data-message {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%; /* 화면 높이에 맞게 세로 중앙 정렬 */
	font-size: 1rem;
}
</style>
