<template>
	<div class="layer-popup" style="top: 250px; right: 40%">
		<!-- 임시로 위치 잡음 style은 나중에 지워주세요-->
		<div class="head">
			<div class="tit">실거래 상세정보</div>
			<a class="btn-close"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<div class="large-tit text-center">강남구 신사동</div>
			<div class="trade-detail">
				<ul>
					<li>
						<strong>거래금액</strong>
						<p>23.3억<span class="text-info ml-5">▼</span></p>
						<!-- <span class="text-danger ml-5">▲</span> -->
					</li>
					<li>
						<strong>건수</strong>
						<p>17건</p>
					</li>
					<li>
						<strong>면적</strong>
						<p>5,437㎡</p>
					</li>
				</ul>
				<div class="tit">가격 진단정보</div>
				<ol>
					<li>
						<strong>이상거래금액(만원)</strong>
						<p>1.4억</p>
					</li>
					<li>
						<strong>상한가(만원)</strong>
						<p>13억</p>
					</li>
					<li>
						<strong>하한가(만원)</strong>
						<p>13억</p>
					</li>
					<li>
						<strong>평균가(만원)</strong>
						<p>13억</p>
					</li>
				</ol>
			</div>
		</div>
	</div>

	<div class="layer-popup" style="top: 250px; right: 20%">
		<!-- 임시로 위치 잡음 style은 나중에 지워주세요-->
		<div class="head">
			<div class="tit">아파트 물건 상세정보</div>
			<a class="btn-close"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<div class="apart-detail">
				<ul>
					<li class="info">
						<strong class="name">삼익아파트</strong>
						<span class="addr-1">동작구 상도동 413</span>
						<span class="addr-2">서울특별시 동작구 양념로26길 27</span>
					</li>
					<li class="average">
						<strong>평균시세</strong>
						<p>3억 3,546만</p>
					</li>
				</ul>
				<table class="table data-table mb-20">
					<caption>
						아파트 물건 상제 정보이며 준공, 면적별, 면적(㎡)을 제공합니다.
					</caption>
					<colgroup>
						<col style="width: 150px" />
						<col style="width: 150px" />
						<col style="width: 150px" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">준공</th>
							<th scope="col">면적별</th>
							<th scope="col">면적(㎡)</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">2006</th>
							<td>중형</td>
							<td>84.81</td>
						</tr>
					</tbody>
				</table>

				<div class="tit">이상거래 모니터링</div>
				<table class="table data-table color-blue">
					<caption>
						이상거래 모니터링 정보이며 직전거래, 최고가, 평균, 거래해제를 제공합니다.
					</caption>
					<colgroup>
						<col style="width: 150px" />
						<col style="width: 150px" />
						<col style="width: 150px" />
						<col style="width: 150px" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">직전거래</th>
							<th scope="col" class="highlight">최고가</th>
							<th scope="col">평균</th>
							<th scope="col">거래해제</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">3.33</th>
							<td class="highlight">38.4</td>
							<td>7</td>
							<td>Y</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
	$('.layer-popup .btn-close').on('click', function () {
		$('.layer-popup').hide()
	})
})
</script>

<style scoped>
a {
	cursor: pointer;
}
</style>
