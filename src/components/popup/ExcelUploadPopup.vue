<template>
	<div
		id="tool-print"
		class="modal"
		tabindex="-1"
		role="dialog"
		data-backdrop="static"
		style="display: block; page-break-after: avoid"
	>
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body">
					<div>
						<h5 class="tit">신규 연계 파일 업로드</h5>
						<div class="table-utility">
							<div class="left">
								<div class="text-bold-6" style="margin-right: 30px; display: inline-block">데이터 유형</div>
								<div class="checkbox" style="display: inline-block">
									<input type="checkbox" id="trade" checked />
									<label for="trade" class="icon" style="margin: 0 3px">RTMS·매매</label>
									<input type="checkbox" id="rent" />
									<label for="rent" class="icon" style="margin: 0 30px 0 3px">RTMS·임대차</label>
								</div>
							</div>
							<div v-if="uploadYn" class="count right">{{ excelName }} 검사 결과 : 오류 45건</div>
						</div>

						<template v-if="!uploadYn">
							<div class="excel-upload">
								<div class="container">
									<div
										id="dropArea"
										@dragover="onUploadDragOver($event)"
										@dragleave="onUploadDragLeave($event)"
										@drop="onUploadDrop($event)"
										@click="onUploadClick()"
									>
										<div class="upload-icon"></div>
										<p>이미지를 드래그 앤 드롭 하거나 클릭하여 업로드하세요.</p>
										<input
											type="file"
											id="fileInput"
											accept=".xls,.xlsx"
											style="display: none"
											@change="onFileInputChange($event)"
										/>
									</div>
								</div>
							</div>

							<div class="guide-text">
								<div class="left" style="margin-bottom: 10px">연계 파일 업로드 안내</div>
								<div class="left">· 엑셀 파일의 첫번째 행은 각 열의 이름으로 인식합니다.</div>
								<div class="left">
									· 엑셀 파일 로딩 시 각 열의 데이터 속성 (타입, 길이 등) 을 검사하고, 검사 결과에 따라 업로드 단계
									실행이 진행됩니다.
								</div>
								<div class="left" style="margin: 10px 0 10px 6px">정상 : 업로드 가능&nbsp;검사 오류: 업로드 불가능</div>
								<div class="left">
									· 검사 오류 발생 시 해당 열의 데이터 확인 후 검증 단계를 재실행 하여 업로드를 진행할 수 있습니다.
								</div>
							</div>
						</template>
						<template v-else>
							<table class="table data-table">
								<colgroup>
									<col style="width: 40px" />
									<col style="width: 100px" />
									<col style="width: 200px" />
									<col style="width: 110px" />
								</colgroup>
								<thead>
									<tr>
										<th scope="col">행번호</th>
										<th scope="col">열번호</th>
										<th scope="col">입력된 데이터</th>
										<th scope="col">오류명</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>34</td>
										<td>4</td>
										<td>admin</td>
										<td>데이터 형식 오류(숫자)</td>
									</tr>
								</tbody>
							</table>
							<!-- <Pagination
						:currPage="pagination.page"
						:countPerPage="pagination.size"
						:unitPage="pagination.unitPage"
						:totalCount="pagination.totalCount"
						@movePage="getNotice"
					/> -->
							<div class="excel-upload">
								<div class="container">
									<div
										id="dropArea"
										@dragover="onUploadDragOver($event)"
										@dragleave="onUploadDragLeave($event)"
										@drop="onUploadDrop($event)"
										@click="onUploadClick()"
									>
										<div class="upload-icon"></div>
										<p>이미지를 드래그 앤 드롭 하거나 클릭하여 업로드하세요.</p>
										<input
											type="file"
											id="fileInput"
											accept=".xls,.xlsx"
											style="display: none"
											@change="onFileInputChange($event)"
										/>
									</div>
								</div>
							</div>
						</template>
						<div class="action-btn-group">
							<div class="btn-print-group">
								<button
									type="button"
									class="btn btn-light btn-close"
									data-dismiss="modal"
									aria-label="Close"
									@click="onUploadPopupCloseClick"
								>
									닫기
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref } from 'vue'
import { usePopupStore } from '@/stores/popup'
export default {
	setup() {
		const popupStore = usePopupStore()

		const uploadYn = ref(false)
		const excelName = ref('')

		// 드래그 앤 드롭 이벤트 처리
		const onUploadDragOver = (e) => {
			e.preventDefault()
			document.getElementById('dropArea').style.backgroundColor = '#eee'
		}

		const onUploadDragLeave = (e) => {
			document.getElementById('dropArea').style.backgroundColor = '#fff'
		}

		const onUploadDrop = (e) => {
			e.preventDefault()
			document.getElementById('dropArea').style.backgroundColor = '#fff'
			const file = e.dataTransfer.files[0]
			uploadYn.value = file ? true : false
			excelName.value = file.name
		}

		const onFileInputChange = (e) => {
			const file = e.target.files[0]
			uploadYn.value = file ? true : false
			excelName.value = file.name
		}

		// 클릭 이벤트 처리
		const onUploadClick = () => {
			document.getElementById('fileInput').click()
		}

		const onUploadPopupCloseClick = () => {
			popupStore.excelUploadPopupVisible = false
		}

		return {
			uploadYn,
			excelName,
			onUploadDragOver,
			onUploadDragLeave,
			onUploadDrop,
			onFileInputChange,
			onUploadClick,
			onUploadPopupCloseClick,
		}
	},
}
</script>

<style scoped>
.guide-text {
	width: 1000px;
}
.modal .modal-body {
	border-radius: 13px;
}
.modal .modal-content {
	min-width: 900px;
	max-width: 1200px;
}

#dropArea {
	border: 2px dashed #ccc;
	width: 100%;
	height: 200px;
	text-align: center;
	margin-bottom: 30px;
	transition: background-color 0.3s ease-in-out;
}
#dropArea:hover {
	background-color: #eee;
}
.table-utility {
	text-wrap: nowrap;
}
</style>
