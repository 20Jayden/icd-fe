<template>
	<div class="stat-condition">
		<h2 class="blind">통계조건 패널</h2>
		<a href="#" class="btn-fold" title="통계조건 펼치기"><span>통계 조건</span></a>
		<div class="content">
			<div class="head">
				<h3>통계 조건</h3>
				<a href="#" class="btn-close"><span>닫기</span></a>
			</div>
			<div class="body">
				<ul>
					<li>
						<label>통계유형</label>
						<div class="form-group">
							<div class="btn-group">
								<button type="button" class="btn btn-dark active">가격 변동률</button>
								<button type="button" class="btn btn-dark">가격 지수</button>
							</div>
						</div>
					</li>
					<li>
						<label>통계유형</label>
						<div class="form-group">
							<input type="date" class="form-control" />
						</div>
					</li>
					<li>
						<label>지역유형</label>
						<div class="form-group">
							<select class="form-control">
								<option>서울특별시</option>
								<option>서울특별시</option>
								<option>서울특별시</option>
							</select>
						</div>
					</li>
					<li>
						<label>주택유형</label>
						<div class="form-group">
							<select class="form-control">
								<option>종합</option>
								<option>종합</option>
								<option>종합</option>
							</select>
						</div>
					</li>
					<li>
						<label>거래유형</label>
						<div class="form-group">
							<select class="form-control">
								<option>매매</option>
								<option>매매</option>
								<option>매매</option>
							</select>
						</div>
					</li>
				</ul>

				<div class="action-btn-group">
					<div class="center">
						<button type="button" class="btn btn-dark w-sm">
							<i class="ico ico-reset"></i>초기화
						</button>
						<button type="button" class="btn btn-primary w-sm">
							<i class="ico ico-search"></i>조회
						</button>
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
