<template>
	<div class="stat-board">
		<div class="head">
			<div class="tit">통계 보드</div>
			<a href="#" class="btn-fold active"><span>접기/펼치기</span></a>
			<a href="#" class="btn-close"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<div class="tit">매매 변동률 추이</div>
			<div class="tab">
				<ul>
					<li class="active">
						<a href="#"><span>차트</span></a>
						<div class="tab-pane">
							<div>그래프 들어가는곳</div>
						</div>
					</li>
					<li>
						<a href="#"><span>도표</span></a>
						<div class="tab-pane">
							<table class="table data-table">
								<caption>
									매매 변동률 추이 도표 정보이며 월, 2019년, 2020년, 2021년, 2022년 정보를
									제공합니다.
								</caption>
								<colgroup>
									<col style="width: 30px" />
									<col style="width: 30px" />
									<col style="width: 30px" />
									<col style="width: 30px" />
									<col style="width: 30px" />
								</colgroup>
								<thead>
									<tr>
										<th scope="col">월</th>
										<th scope="col">2019년</th>
										<th scope="col">2020년</th>
										<th scope="col">2021년</th>
										<th scope="col">2022년</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th scope="row">1월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
									<tr>
										<th scope="row">2월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
									<tr>
										<th scope="row">3월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
									<tr>
										<th scope="row">4월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
									<tr>
										<th scope="row">5월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
									<tr>
										<th scope="row">6월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
									<tr>
										<th scope="row">7월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
									<tr>
										<th scope="row">8월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
									<tr>
										<th scope="row">9월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
									<tr>
										<th scope="row">10월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
									<tr>
										<th scope="row">11월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
									<tr>
										<th scope="row">12월</th>
										<td>0.23</td>
										<td>0.28</td>
										<td>0.26</td>
										<td>0.35</td>
									</tr>
								</tbody>
							</table>
						</div>
					</li>
				</ul>
			</div>
			<div class="source">
				<span class="left">가격지수 : 2022.03 ~ 100</span>
				<span class="right">자료 : 한국부동산</span>
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
