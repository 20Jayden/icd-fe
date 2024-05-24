<template>
	<div
		v-if="
			layerStore.visible[10] ||
			layerStore.visible[27] ||
			layerStore.visible[28] ||
			layerStore.visible[29] ||
			layerStore.visible[30] ||
			layerStore.visible[31] ||
			layerStore.visible[32]
		"
	>
		<a href="#" class="btn-open-legend" @click="onToggleClick(false)"><span>범례펼치기</span></a>
		<div class="legend-2" :class="{ 'show': isLegendVisible }">
			<div class="trend-legend-list">
				<ul>
					<li class="accordion" v-show="layerStore.visible[10]">
						<a class="tit active" @click="onAccordionClick">건물연령정보</a>
						<ul class="house-trend">
							<div class="custom-control" v-for="(legend, legendIndex) in legendList.wms10" :key="legendIndex">
								<label class="icon">
									<i :style="{ 'background-color': legend.value }"></i>
									{{ legend.text }}
								</label>
							</div>
						</ul>
					</li>
					<li class="accordion" v-show="layerStore.visible[27]">
						<a class="tit active" @click="onAccordionClick">개발제한구역</a>
						<ul class="house-trend">
							<div class="custom-control" v-for="(legend, legendIndex) in legendList.wms27" :key="legendIndex">
								<label class="icon">
									<i :style="{ 'background-color': legend.value }"></i>
									{{ legend.text }}
								</label>
							</div>
						</ul>
					</li>
					<li class="accordion" v-show="layerStore.visible[28]">
						<a class="tit active" @click="onAccordionClick">경관지구</a>
						<ul class="house-trend">
							<div class="custom-control" v-for="(legend, legendIndex) in legendList.wms28" :key="legendIndex">
								<label class="icon">
									<i class="wms-28-legend"></i>
									{{ legend.text }}
								</label>
							</div>
						</ul>
					</li>
					<li class="accordion" v-show="layerStore.visible[29]">
						<a class="tit active" @click="onAccordionClick">고도지구</a>
						<ul class="house-trend">
							<div class="custom-control" v-for="(legend, legendIndex) in legendList.wms29" :key="legendIndex">
								<label class="icon">
									<i class="wms-29-legend"></i>
									{{ legend.text }}
								</label>
							</div>
						</ul>
					</li>
					<li class="accordion" v-show="layerStore.visible[30]">
						<a class="tit active" @click="onAccordionClick">국토계획구역</a>
						<ul class="house-trend">
							<div class="custom-control">
								<label class="icon"
									><i
										style="
											border-width: 1px;
											background: url(/assets/images/vertical_blue_4.png) repeat 0 0px;
											border-color: #434343;
										"
									></i
									>시가화조정구역</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i
										style="
											border-width: 1px;
											background: url(/assets/images/vertical_blue_6.png) repeat 0 0px;
											border-color: #434343;
										"
									></i
									>수산자원보호구역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #d25757; border-color: #633232"></i
									>개발행위허가제한지역</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #7657d2; border-color: #352b55"></i>기반시설부담구역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #d77453; border-color: #663d2f"></i
									>개발밀도관리구역</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #64c6c6; border-color: #356060"></i
									>토지거래계약에관한허가구역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #dfdf75; border-color: #66662f"></i>광역계획구역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #95d753; border-color: #557535"></i>기타용지</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #e7a898; border-color: #844a3c"></i
									>공공시설용지</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #57d257; border-color: #326332"></i>녹지용지</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #ea6aea; border-color: #8f308f"></i>공업용지</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #4195e9; border-color: #224a73"></i>상업용지</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #ecb57d; border-color: #8f6030"></i>주거용지</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #d1d1d8; border-color: #818194"></i
									>제2종지구단위계획구역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #aeb5bb; border-color: #616b74"></i
									>제1종지구단위계획구역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #8c9d9d; border-color: #445151"></i>지구단위계획구역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #e8ffbf; border-color: #62802b"></i
									>도시계획구역</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #ece8e8; border-color: #949494"></i
									>용도구역기타</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #ffef80; border-color: #ad9c27"></i
									>용도구역미분류</label
								>
							</div>
							<div class="custom-control">
								<label class="icon"
									><i style="border-width: 1px; background-color: #ffef80; border-color: #ad9c27"></i>미분류</label
								>
							</div>
						</ul>
					</li>
					<li class="accordion" v-show="layerStore.visible[31]">
						<a class="tit active" @click="onAccordionClick">도시자연공원구역</a>
						<ul class="house-trend">
							<div class="custom-control">
								<label class="icon"
									><i
										style="
											background: url(/assets/images/slash_red_3.png) repeat 0 0px;
											background-color: #008000;
											border-color: #434343;
											border-style: solid;
										"
									></i
									>도시자연공원구역</label
								>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i
										style="border-width: 4px; background-color: #ffffff; border-color: #ff0000; border-style: solid"
									></i
									>기타</label
								>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i
										style="border-width: 4px; background-color: #ffffff; border-color: #ff0000; border-style: solid"
									></i
									>미분류</label
								>
							</div>
						</ul>
					</li>
					<li class="accordion" v-show="layerStore.visible[32]">
						<a class="tit active" @click="onAccordionClick">도시지역</a>
						<ul class="house-trend">
							<div class="custom-control">
								<label class="icon">
									<i
										style="
											width: 22px;
											height: 17px;
											background: url(/assets/images/dot_red_52.png) repeat 0 0px;
											background-color: #feff68;
										"
									></i>
									제1종전용주거지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i
										style="
											width: 22px;
											height: 17px;
											background: url(/assets/images/dot_red_52.png) repeat 0 0px;
											background-color: #feff68;
										"
									></i>
									제2종전용주거지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #feff68"></i>
									전용주거지역미분류
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #ffff66"></i>
									제1종일반주거지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #fdff00"></i>
									제2종일반주거지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #fecc00"></i>
									제3종일반주거지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #ffff66"></i>
									일반주거지역미분류
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i
										style="
											width: 22px;
											height: 17px;
											background: url(/assets/images/slash_red_3.png) repeat 0 0px;
											background-color: #ffff00;
										"
									></i>
									준주거지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #ffff66"></i>
									주거지역기타
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i
										style="
											width: 22px;
											height: 17px;
											background: url(/assets/images/dot_red_52.png) repeat 0 0px;
											background-color: #fe66cc;
										"
									></i>
									중심상업지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #fe66cc"></i>
									일반상업지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i
										style="
											width: 22px;
											height: 17px;
											background: url(/assets/images/slash_red_3.png) repeat 0 0px;
											background-color: #fe66cc;
										"
									></i>
									근린상업지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #fe66cc"></i>
									유통상업지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #fe66cc"></i>
									상업지역기타
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i
										style="
											width: 22px;
											height: 17px;
											background: url(/assets/images/dot_purple_25.png) repeat 0 0px;
											background-color: #cc66ff;
										"
									></i>
									전용공업지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #cc66ff"></i>
									일반공업지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i
										style="
											width: 22px;
											height: 17px;
											background: url(/assets/images/slash_red_3.png) repeat 0 0px;
											background-color: #cc66ff;
										"
									></i>
									준공업지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #cc66ff"></i>
									공업지역기타
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i
										style="
											width: 22px;
											height: 17px;
											background: url(/assets/images/dot_green_25.png) repeat 0 0px;
											background-color: #ccfe66;
										"
									></i>
									보전녹지지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i
										style="
											width: 22px;
											height: 17px;
											background: url(/assets/images/slash_green_3.png) repeat 0 0px;
											background-color: #ccfe66;
										"
									></i>
									생산녹지지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #ccfe66"></i>
									자연녹지지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #ccfe66"></i>
									녹지지역기타
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #fd4758"></i>
									도시지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #ffffff"></i>
									도시지역미지정지역
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #fd4758"></i>
									도시지역기타
								</label>
							</div>
							<div class="custom-control">
								<label class="icon">
									<i style="width: 22px; height: 17px; background-color: #fd4758"></i>
									도시지역미분류
								</label>
							</div>
						</ul>
					</li>
				</ul>
			</div>
			<div>
				<button type="button" class="btn btn-primary btn-block mt-10" @click="onToggleClick">숨기기</button>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted, onUpdated } from 'vue'
import { useLayerStore } from '@/stores/layer'

export default {
	setup() {
		onMounted(() => {
			$('.trend-legend-list').slimScroll({
				height: '100%',
				wheelStep: 50,
				allowPageScroll: false,
				disableFadeOut: false,
			})
		})

		onUpdated(() => {
			$('.trend-legend-list').slimScroll({
				height: '100%',
				wheelStep: 50,
				allowPageScroll: false,
				disableFadeOut: false,
			})
		})

		const layerStore = useLayerStore()

		const isLegendVisible = ref(true)

		const legendList = ref({
			wms10: [
				{ value: '#66ff66', text: '10세 미만' },
				{ value: '#4BE04B', text: '10대' },
				{ value: '#97c53e', text: '20대' },
				{ value: '#fbbb66', text: '30대' },
				{ value: '#fba057', text: '40대' },
				{ value: '#fc6b3a', text: '50대' },
				{ value: '#FC542F', text: '60대' },
				{ value: '#ff0000', text: '70대' },
				{ value: '#DB0000', text: '80대' },
				{ value: '#B70000', text: '90대' },
				{ value: '#810000', text: '100세 이상' },
				{ value: '#8C8C8C', text: '기타' },
			],
			wms27: [
				{ value: '#AAFFFF', text: '개발제한구역' },
				{ value: '#AAFFFF', text: '기타' },
				{ value: '#AAFFFF', text: '미분류' },
			],
			wms28: [
				{ text: '자연경관지구' },
				{ text: '특화경관지구' },
				{ text: '시가지경관지구' },
				{ text: '시가지경관지구(일반)' },
				{ text: '시가지경관지구(중심)' },
				{ text: '경관지구' },
				{ text: '기타' },
				{ text: '미분류' },
			],
			wms29: [
				{ text: '최고고도지구' },
				{ text: '최저고도지구' },
				{ text: '고도지구' },
				{ text: '기타' },
				{ text: '미분류' },
			],
		})

		// 범례 on / off
		const onToggleClick = () => {
			isLegendVisible.value = !isLegendVisible.value
		}

		/**
		 * 아코디언 이벤트 핸들러
		 * @param {*} e
		 */
		const onAccordionClick = (e) => {
			$(e.target).next().slideToggle(200).prev().toggleClass('active')
		}

		return { legendList, layerStore, isLegendVisible, onToggleClick, onAccordionClick }
	},
}
</script>

<style scoped>
.legend-2.show {
	width: 250px;
	height: 577px;
}
.custom-control label:before {
	content: none;
}
.legend-2 {
	justify-content: space-between;
}
.custom-control label {
	padding: 0;
	margin-bottom: 10px;
}
.icon i {
	width: 18px;
	height: 18px;
	vertical-align: middle;
	display: inline-block;
	left: 24px;
	margin-right: 5px;
}
/** 아코디언 스타일 사용자설정 */
.accordion {
	margin-bottom: 5px;
}
.accordion > .tit {
	margin: 5px 0;
	font-size: 1.078rem;
	background-color: #fff;
	color: #3d3d3d;
	border-radius: 20px;
	border: 1px solid rgba(110, 65, 222, 0.7);
}
.accordion > .tit:after {
	border-left: 2px solid #3d3d3d;
	border-bottom: 2px solid #3d3d3d;
}
.accordion > .house-trend {
	margin-top: 12px;
}

/**
레이어 Legend 스타일
*/
.wms-28-legend {
	background: url(/assets/images/slash_orange_2.png) repeat 0 0px;
	border: 1px solid #008088;
}
.wms-29-legend {
	background: url(/assets/images/vertical_blue_4.png) repeat 0 0px;
	background-color: #ffffff;
	border-color: #434343;
}
</style>
