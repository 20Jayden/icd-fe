<template>
	<div class="abno-transaction show">
		<h3 class="blind">이상거래 일람 창</h3>
		<div class="head">
			<div class="center">
				<a href="#" class="btn-fold active"><span>이상거래 일람</span></a>
				<a href="#" class="btn-curtloca">현 위치 검색<i class="ico ico-curt"></i></a>
				<a href="#" class="btn-mapmark">지도표시<span class="on">ON</span></a>
			</div>
			<div class="right">
				<div class="window-resize">
					<strong>창크기</strong>
					<a href="#" class="small"><span>25%</span></a>
					<a href="#" class="half"><span>50%</span></a>
					<a href="#" class="full"><span>100%</span></a>
				</div>
			</div>
		</div>
		<div class="body">
			<div class="fixed-thead">
				<table class="table data-table">
					<caption>
						이상거래 일람 정보이며 자치구, 법정도, 건물명, 준공년도, 면적별, 건물평균가격. 면적,
						거래일시, 거래금액, 층수, 하한가, 상한가, 직전거래대비, 최고가대비, 평균대비,
						거래해제신고건 정보를 제공합니다.
					</caption>
					<colgroup>
						<col style="width: 23px" />
						<col style="width: 60px" />
						<col style="width: 68px" />
						<col style="width: 142px" />
						<col style="width: 60px" />
						<col style="width: 48px" />
						<col style="width: 85px" />
						<col style="width: 58px" />
						<col style="width: 73px" />
						<col style="width: 60px" />
						<col style="width: 35px" />
						<col style="width: 57px" />
						<col style="width: 57px" />
						<col style="width: 72px" />
						<col style="width: 65px" />
						<col style="width: 35px" />
						<col style="width: 35px" />
						<col style="width: 61px" />
						<col style="width: 60px" />
						<col style="width: 65px" />
						<col style="width: 85px" />
						<col style="width: 85px" />
						<col style="width: 85px" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col"></th>
							<th scope="col" colspan="7">기본정보</th>
							<th scope="col" colspan="3">최근거래정보</th>
							<th scope="col" colspan="2">KB시세</th>
							<th scope="col" colspan="3">직전거래현황</th>
							<th scope="col" colspan="2">3개월 평균현황</th>
							<th scope="col" colspan="2">6개월 최고거래 현황</th>
							<th scope="col" colspan="3">일계치 비교</th>
						</tr>
						<tr>
							<th></th>
							<th>자치구</th>
							<th>법정동</th>
							<th>건물명</th>
							<th>준공년도</th>
							<th>면적별</th>
							<th>건물평균가격</th>
							<th>면적[㎡]</th>
							<th>거래일시</th>
							<th>거래금액</th>
							<th>층수</th>
							<th>상한가</th>
							<th>하한가</th>
							<th>거래일시</th>
							<th>거래금액</th>
							<th>층수</th>
							<th>건수</th>
							<th>거래금액</th>
							<th>차이금액</th>
							<th>거래금액</th>
							<th>직전거래대비</th>
							<th>최고가대비</th>
							<th>평균대비</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="tbody slim-scroll">
				<table class="table data-table">
					<caption></caption>
					<colgroup>
						<col style="width: 23px" />
						<col style="width: 60px" />
						<col style="width: 68px" />
						<col style="width: 142px" />
						<col style="width: 60px" />
						<col style="width: 48px" />
						<col style="width: 85px" />
						<col style="width: 58px" />
						<col style="width: 73px" />
						<col style="width: 60px" />
						<col style="width: 35px" />
						<col style="width: 57px" />
						<col style="width: 57px" />
						<col style="width: 72px" />
						<col style="width: 65px" />
						<col style="width: 35px" />
						<col style="width: 35px" />
						<col style="width: 61px" />
						<col style="width: 60px" />
						<col style="width: 65px" />
						<col style="width: 85px" />
						<col style="width: 85px" />
						<col style="width: 85px" />
					</colgroup>
					<tbody>
						<tr>
							<th scope="row" class="num">11</th>
							<td class="text-left">금천구</td>
							<td class="text-left">독산동</td>
							<td class="text-left">금천롯데캐슬골드파크..</td>
							<td class="text-left">2016</td>
							<td class="text-left">중형</td>
							<td class="text-right">14612.09</td>
							<td class="text-right">100.21</td>
							<td class="text-left">20220501</td>
							<td class="text-right">125670</td>
							<td class="text-left">12</td>
							<td class="text-right">154500</td>
							<td class="text-right">133000</td>
							<td class="text-left">20231123</td>
							<td class="text-right">1256000</td>
							<td class="text-left">11</td>
							<td class="text-right">3</td>
							<td class="text-right">12456</td>
							<td class="text-right">-8000</td>
							<td class="text-right">1245667</td>
							<td class="text-right bg-green">33.33</td>
							<td class="text-right bg-green">0</td>
							<td class="text-right bg-green">0</td>
						</tr>
						<tr>
							<th scope="row" class="num">12</th>
							<td class="text-left">관악구</td>
							<td class="text-left">신림동</td>
							<td class="text-left">동부</td>
							<td class="text-left">1993</td>
							<td class="text-left">중형</td>
							<td class="text-right">14612.09</td>
							<td class="text-right">100.21</td>
							<td class="text-left">20220501</td>
							<td class="text-right">125670</td>
							<td class="text-left">12</td>
							<td class="text-right">154500</td>
							<td class="text-right">133000</td>
							<td class="text-left">20231123</td>
							<td class="text-right">1256000</td>
							<td class="text-left">11</td>
							<td class="text-right">3</td>
							<td class="text-right">12456</td>
							<td class="text-right">-8000</td>
							<td class="text-right">1245667</td>
							<td class="text-right bg-yellow">22.78</td>
							<td class="text-right bg-green">0</td>
							<td class="text-right bg-green">0</td>
						</tr>
						<tr>
							<th scope="row" class="num">13</th>
							<td class="text-left">용산구</td>
							<td class="text-left">원효로4가</td>
							<td class="text-left">산호</td>
							<td class="text-left">1996</td>
							<td class="text-left">대형</td>
							<td class="text-right">14612.09</td>
							<td class="text-right">100.21</td>
							<td class="text-left">20220501</td>
							<td class="text-right">125670</td>
							<td class="text-left">12</td>
							<td class="text-right">154500</td>
							<td class="text-right">133000</td>
							<td class="text-left">20231123</td>
							<td class="text-right">1256000</td>
							<td class="text-left">11</td>
							<td class="text-right">3</td>
							<td class="text-right">12456</td>
							<td class="text-right">-8000</td>
							<td class="text-right">1245667</td>
							<td class="text-right bg-red">33.33</td>
							<td class="text-right bg-green">0</td>
							<td class="text-right bg-green">0</td>
						</tr>
						<tr>
							<th scope="row" class="num">14</th>
							<td class="text-left">성동구</td>
							<td class="text-left">금호동1가</td>
							<td class="text-left">벽산</td>
							<td class="text-left">2001</td>
							<td class="text-left">소형</td>
							<td class="text-right">14612.09</td>
							<td class="text-right">100.21</td>
							<td class="text-left">20220501</td>
							<td class="text-right">125670</td>
							<td class="text-left">12</td>
							<td class="text-right">154500</td>
							<td class="text-right">133000</td>
							<td class="text-left">20231123</td>
							<td class="text-right">1256000</td>
							<td class="text-left">11</td>
							<td class="text-right">3</td>
							<td class="text-right">12456</td>
							<td class="text-right">-8000</td>
							<td class="text-right">1245667</td>
							<td class="text-right bg-green">-1.45</td>
							<td class="text-right bg-green">-7.72</td>
							<td class="text-right bg-green">-3.21</td>
						</tr>
						<tr>
							<th scope="row" class="num">15</th>
							<td class="text-left">광진구</td>
							<td class="text-left">군자동</td>
							<td class="text-left">에피소드1</td>
							<td class="text-left">2014</td>
							<td class="text-left">소형</td>
							<td class="text-right">14612.09</td>
							<td class="text-right">100.21</td>
							<td class="text-left">20220501</td>
							<td class="text-right">125670</td>
							<td class="text-left">12</td>
							<td class="text-right">154500</td>
							<td class="text-right">133000</td>
							<td class="text-left">20231123</td>
							<td class="text-right">1256000</td>
							<td class="text-left">11</td>
							<td class="text-right">3</td>
							<td class="text-right">12456</td>
							<td class="text-right">-8000</td>
							<td class="text-right">1245667</td>
							<td class="text-right bg-green">33.33</td>
							<td class="text-right bg-green">0</td>
							<td class="text-right bg-green">0</td>
						</tr>
						<tr>
							<th scope="row" class="num">16</th>
							<td class="text-left">금천구</td>
							<td class="text-left">독산동</td>
							<td class="text-left">금천롯데캐슬골드파크..</td>
							<td class="text-left">2016</td>
							<td class="text-left">중형</td>
							<td class="text-right">14612.09</td>
							<td class="text-right">100.21</td>
							<td class="text-left">20220501</td>
							<td class="text-right">125670</td>
							<td class="text-left">12</td>
							<td class="text-right">154500</td>
							<td class="text-right">133000</td>
							<td class="text-left">20231123</td>
							<td class="text-right">1256000</td>
							<td class="text-left">11</td>
							<td class="text-right">3</td>
							<td class="text-right">12456</td>
							<td class="text-right">-8000</td>
							<td class="text-right">1245667</td>
							<td class="text-right bg-green">33.33</td>
							<td class="text-right bg-green">0</td>
							<td class="text-right bg-green">0</td>
						</tr>
						<tr>
							<th scope="row" class="num">17</th>
							<td class="text-left">관악구</td>
							<td class="text-left">신림동</td>
							<td class="text-left">동부</td>
							<td class="text-left">1993</td>
							<td class="text-left">중형</td>
							<td class="text-right">14612.09</td>
							<td class="text-right">100.21</td>
							<td class="text-left">20220501</td>
							<td class="text-right">125670</td>
							<td class="text-left">12</td>
							<td class="text-right">154500</td>
							<td class="text-right">133000</td>
							<td class="text-left">20231123</td>
							<td class="text-right">1256000</td>
							<td class="text-left">11</td>
							<td class="text-right">3</td>
							<td class="text-right">12456</td>
							<td class="text-right">-8000</td>
							<td class="text-right">1245667</td>
							<td class="text-right bg-green">33.33</td>
							<td class="text-right bg-green">0</td>
							<td class="text-right bg-green">0</td>
						</tr>
						<tr>
							<th scope="row" class="num">18</th>
							<td class="text-left">용산구</td>
							<td class="text-left">원효로4가</td>
							<td class="text-left">산호</td>
							<td class="text-left">1996</td>
							<td class="text-left">대형</td>
							<td class="text-right">14612.09</td>
							<td class="text-right">100.21</td>
							<td class="text-left">20220501</td>
							<td class="text-right">125670</td>
							<td class="text-left">12</td>
							<td class="text-right">154500</td>
							<td class="text-right">133000</td>
							<td class="text-left">20231123</td>
							<td class="text-right">1256000</td>
							<td class="text-left">11</td>
							<td class="text-right">3</td>
							<td class="text-right">12456</td>
							<td class="text-right">-8000</td>
							<td class="text-right">1245667</td>
							<td class="text-right bg-green">33.33</td>
							<td class="text-right bg-green">0</td>
							<td class="text-right bg-green">0</td>
						</tr>
					</tbody>
				</table>
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
