<template>
	<!--  header  -->
	<header class="header">
		<h1 class="logo-1">
			<a href="#" style="color: #fff; font-size: 1.195rem; margin-left: 10px"
				><span>지형지물 자동 인식 및 변화정보 판독 시스템</span></a
			>
		</h1>
		<div class="location">
			<a href="#" class="current"><span>서울특별시강남구 개포 1동</span></a>
			<div class="select-region">
				<ul>
					<li><a href="#">전체</a></li>
					<li class="active"><a href="#">강남구</a></li>
					<li><a href="#">강동구</a></li>
					<li><a href="#">강북구</a></li>
					<li><a href="#">관악구</a></li>
					<li><a href="#">구로구</a></li>
					<li><a href="#">도봉구</a></li>
				</ul>
				<ul>
					<li><a href="#">전체</a></li>
					<li class="active"><a href="#">개포1동</a></li>
					<li><a href="#">개포2동</a></li>
					<li><a href="#">개포3동</a></li>
					<li><a href="#">개포4동</a></li>
					<li><a href="#">개포5동</a></li>
					<li><a href="#">개포6동</a></li>
				</ul>
			</div>
		</div>
		<div class="right-utile">
			<!-- 클래스 on / off -->
			<div class="user-name">문준혁 [ mjh@wgsystem.co.kr ]</div>
			<a href="#" class="btn btn-dark btn-logout modal-open" data-modal="alert-logout">로그아웃</a>
		</div>
	</header>
	<!--//  header  -->

	<!-- alert : 로그아웃 -->
	<div class="modal" id="alert-logout">
		<div class="modal-sandbox"></div>
		<div class="modal-content">
			<div class="modal-head">
				<div class="tit">알림</div>
				<a href="#" class="btn-close"><span>팝업창 닫기</span></a>
			</div>
			<div class="modal-body">
				<p class="text-center mt-15">로그아웃을 진행하겠습니까?</p>

				<div class="action-btn-group">
					<div class="center">
						<button type="button" class="btn btn-dark w-sm btn-close">아니오</button>
						<button type="button" class="btn btn-primary w-sm">예</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	setup() {
		return {}
	},
}
</script>

<style lang="scss" scoped></style>
