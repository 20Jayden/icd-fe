<template>
	<div class="signup">
		<div class="wrap">
			<div class="logo-wrap">
				<div class="logo logo-image"></div>
				<div class="logo logo-text"></div>
				<div class="soul-logo"></div>
			</div>
			<div class="tit">GIS 사용자 등록</div>
			<div class="content">
				<form class="form-area">
					<div class="tit">사용자 정보</div>
					<ul>
						<li>
							<label
								>소속(지자체명)
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<select
									v-model="registPayload.ogdpCd"
									ref="ogdpInput"
									class="form-control"
									@change="handleSelectionChange($event)"
								>
									<option value="">선택</option>
									<option value="11000">서울시청</option>
									<option v-for="(sgg, index) in sggOptions" :key="index" :value="sgg.value">{{ sgg.text }}청</option>
								</select>
							</div>
						</li>
						<li>
							<label
								>부서(국)
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<input v-model="registPayload.deptNm" ref="deptInput" type="text" class="form-control" />
							</div>
						</li>
						<li>
							<label
								>부서(과)
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<input v-model="registPayload.divNm" ref="divInput" type="text" class="form-control" />
							</div>
						</li>
						<li>
							<label
								>아이디
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group duplication">
								<input
									v-model="registPayload.id"
									ref="idInput"
									type="text"
									class="form-control"
									:readonly="vaildateYn.id"
									:disabled="vaildateYn.id"
								/>
								<button
									type="button"
									class="btn btn-outline-dark modal-open"
									data-modal="alert-idcheck"
									@click="onCheckDuplicateClick()"
									:disabled="vaildateYn.id"
								>
									중복여부
								</button>
								<!-- <button type="button" class="btn btn-success">사용가능</button> -->
							</div>
						</li>
						<li>
							<label
								>이름
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<input
									v-model="registPayload.nm"
									ref="nameInput"
									type="text"
									class="form-control"
									@change="validateNm"
								/>
								<span v-if="!vaildateYn.nm" class="text-danger vaildate-text">
									이름을 올바르게 입력하셔야 합니다.
								</span>
							</div>
						</li>
						<li>
							<label
								>업무담당
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<select v-model="registPayload.taskTkcgCd" ref="taskTkcgInput" class="form-control">
									<option value="">선택</option>
									<option v-for="(taskTkcg, index) in taskTkcgOptions" :key="index" :value="taskTkcg.value">
										{{ taskTkcg.text }}
									</option>
								</select>
							</div>
						</li>
						<li>
							<label
								>비밀번호
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<input
									v-model="registPayload.pswd"
									type="password"
									ref="passwordInput"
									class="form-control"
									@blur="validatePasswordLength"
									@change="onConfirmPassword"
								/>
								<span
									v-if="!vaildateYn.passwordLength && registPayload.pswd.length < 6"
									class="text-danger vaildate-text"
								>
									비밀번호는 6자리 이상 입력하셔야 합니다.
								</span>
								<span
									v-if="!vaildateYn.passwordLength && registPayload.pswd.length > 21"
									class="text-danger vaildate-text"
								>
									비밀번호는 20자리 이하로 입력하셔야 합니다.
								</span>
								<div>
									<span v-if="!vaildateYn.passwordForm" class="text-danger vaildate-text">
										비밀번호는 대문자, 소문자, 숫자, 특수문자(!, @, #, $)를 각각 최소한 하나씩 포함하셔야 합니다.
									</span>
								</div>
							</div>
						</li>
						<li>
							<label
								>비밀번호 확인
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<input
									v-model="passwordConfirm"
									type="password"
									ref="passwordConfirmInput"
									class="form-control"
									@change="onConfirmPassword"
								/>
								<span v-if="!vaildateYn.password" class="text-danger vaildate-text">
									비밀번호가 일치하지 않습니다.
								</span>
							</div>
						</li>
						<li>
							<label
								>연락처
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<input
									v-model="registPayload.telno"
									type="text"
									ref="telnoInput"
									id="telno"
									class="form-control"
									placeholder="02-1234-1234"
									@input="formatPhoneNumber"
								/>
								<span v-if="!vaildateYn.telno" class="text-danger vaildate-text"> 올바른 연락처 형식이 아닙니다. </span>
							</div>
						</li>
						<li>
							<label
								>이메일
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<input
									v-model="registPayload.eml"
									type="text"
									ref="emailInput"
									class="form-control"
									placeholder="email@address.co.kr"
									@blur="validateEmail"
								/>
							</div>
							<div class="form-group">
								<div class="custom-control mb-10">
									<input type="checkbox" id="emlRecvYn" ref="emailRecvInput" @change="changeEmlRecvYn" />
									<label for="emlRecvYn">
										부동산거래 일일모니터링
										<br />
										이메일 수신 여부
										<!-- <div class="required"><span>필수입력</span></div> -->
									</label>
								</div>
							</div>
						</li>
						<li>
							<label
								>보안서약서
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<input type="file" id="fileUpload" accept=".pdf" ref="fileInput" @change="onFileConfirm" />
								<span class="text-danger" v-if="!isPdfFile">pdf만 지원합니다.</span>
							</div>
						</li>
					</ul>
				</form>
				<div class="Info-message">
					<div class="tit">서울 부동산 동향 공간 분석 시스템</div>
					<p class="mb-20">부동산 동향 분석 업무지원을 위한 공간정보시스템</p>
					<p class="mb-20">
						주요 기능<br />
						· 부동산 거래 통계분석 <br />
						· 부동산 거래 추이분석 <br />
						· 부동산 거래 통계지도 <br />
						· 부동산 거래 모니터링 <br />
						· 부동산 주제도 <br />
						· 토지거래허가구역 관리 <br />
						· 사용자지정 공간분석
					</p>
					<div class="tit">문의</div>
					<ul>
						<li><i class="icon icon-user"></i>서울특별시 도시공간본부 토지관리과 이은영 주무관</li>
						<li><i class="icon icon-email"></i>eylee@seoul.go.kr</li>
						<li><i class="icon icon-tel"></i>02-2133-4666</li>
					</ul>
				</div>
			</div>
			<div class="action-btn-group">
				<div class="center">
					<button
						type="button"
						class="btn btn-primary w-sm modal-open"
						data-modal="alert-approval"
						@click="onSignupClick"
					>
						승인신청
					</button>
					<button type="button" class="btn btn-dark w-sm" @click="onCancelClick">취소</button>
				</div>
			</div>
		</div>
	</div>

	<!-- alert : ID 중복여부 체크 -->
	<div class="modal" id="alert-idcheck">
		<div class="modal-sandbox"></div>
		<div class="modal-content">
			<div class="modal-head">
				<div class="tit">알림</div>
				<a href="#" class="btn-close"><span>팝업창 닫기</span></a>
			</div>
			<div class="modal-body">
				<div class="alert-ment danger">
					<!-- 알럿 아이콘 종류 .success / .info / .save / .danger -->
					<p>사용하실 수 없는 중복된 아이디 입니다.</p>
				</div>
				<!--<div class="alert-ment info">
                    <p>사용하실 수 있는 아이디 입니다.</p>
                </div>-->
				<div class="action-btn-group">
					<div class="center">
						<button type="button" class="btn btn-primary w-sm btn-close">확인</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- alert : 승인신청 -->
	<div class="modal" id="alert-approval">
		<div class="modal-sandbox"></div>
		<div class="modal-content">
			<div class="modal-head">
				<div class="tit">알림</div>
				<a href="#" class="btn-close"><span>팝업창 닫기</span></a>
			</div>
			<div class="modal-body">
				<div class="alert-ment success">
					<p>사용자 승인신청을 완료하였습니다.</p>
				</div>
				<!--
                <div class="alert-ment danger">
                    <p>사용자정보 ㅇㅇㅇ을 입력하시기 바랍니다.</p>
                </div>
                <div class="alert-ment danger">
                    <p>비밀번호 확인을 정확히 입력하시기 바랍니다.</p>
                </div>
                -->
				<div class="action-btn-group">
					<div class="center">
						<button type="button" class="btn btn-primary w-sm btn-close">확인</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
//basic
import { ref, reactive, onMounted } from 'vue'
//api
import optionsApi from '@/api/options'
import authApi from '@/api/auth'
import { useModalStore } from '@/stores/modal'

export default {
	setup() {
		const modalStore = useModalStore()

		let sggOptions = ref([]) // 시군구 옵션 목록
		let taskTkcgOptions = ref([]) // 업무담당 옵션 목록

		// 사용자 등록 정보
		let registPayload = reactive({
			id: '', // 아이디
			pswd: '', // 비밀번호
			nm: '', // 이름
			ogdpCd: '', // 소속코드
			ogdpNm: '', // 소속명
			deptNm: '', // 부서(국)
			divNm: '', // 부서(과)
			taskTkcgCd: '', // 담당업무
			telno: '', // 연락처
			eml: '', // 이메일
			emlRecvYn: '',
			fileYn: '', // 보안서약서 첨부 여부
			fileNm: '', // 보안서약서 파일명
		})

		// 비밀번호확인
		let passwordConfirm = ref('')

		// 유효성검사 여부
		let vaildateYn = ref({
			id: false,
			password: true,
			passwordLength: true,
			passwordForm: true,
			email: true,
			telno: true,
			nm: true,
		})

		// 각 필드 ref
		const idInput = ref(null)
		const passwordInput = ref(null)
		const passwordConfirmInput = ref(null)
		const nameInput = ref(null)
		const ogdpInput = ref(null)
		const deptInput = ref(null)
		const divInput = ref(null)
		const taskTkcgInput = ref(null)
		const telnoInput = ref(null)
		const emailInput = ref(null)
		const emailRecvInput = ref(null)
		const fileInput = ref(null)
		const isPdfFile = ref(true)

		// 아이디형식 유효성검사 정규식
		const idRegex = /^[a-zA-Z0-9]{4,12}$/
		// 이메일형식 유효성검사 정규식
		const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
		// 비밀번호형식 유효성검사 정규식
		const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$])[A-Za-z\d!@#$]{8,}$/
		//연락처형식 유효성 검사 정규식
		const nmRegex = /^[a-zA-Z가-힣]{2,}$/

		/**
		 * Component Mount
		 */
		onMounted(() => {
			getSGGOptions()
			getTaskTkcgOptions()
		})

		/**
		 * 소속(지자체명) 목록 불러오기
		 */
		const getSGGOptions = async () => {
			const { data } = await optionsApi.getSGGOptions()
			sggOptions.value = data
		}

		/**
		 * 업무담당 목록 불러오기
		 */
		const getTaskTkcgOptions = async () => {
			const { data } = await optionsApi.getTaskTkcgOptions()
			taskTkcgOptions.value = data
		}

		/**
		 * 소속 클릭 시, Payload에 소속명 입력
		 * @param {*} event
		 */
		const handleSelectionChange = (event) => {
			const selectedIndex = event.target.selectedIndex
			registPayload.ogdpNm = event.target.options[selectedIndex].innerText
		}

		/**
		 * 아이디 중복여부 Alert
		 * @param {*} id
		 */
		const onCheckDuplicateClick = async () => {
			// 아이디 빈값 체크
			if (registPayload.id === '') {
				modalStore.showAlert('아이디를 입력해주세요')
				return
			}

			// 아이디 형식 체크
			if (!idRegex.test(registPayload.id)) {
				modalStore.showAlert('아이디는 4~12자의 영문 대소문자와 숫자로만 입력하여 주세요.')
				return
			}

			// 아이디 중복여부 체크
			if (await isIdDuplication(registPayload.id)) {
				modalStore.showConfirm(
					`사용할 수 있는 아이디입니다.
				이 아이디를 사용하시겠습니까?`,
					() => {
						vaildateYn.value.id = true
					}
				)
			} else {
				modalStore.showAlert('이미 사용 중인 아이디입니다.')
				vaildateYn.value.id = false
			}
		}

		/**
		 * 비밀번호 확인
		 */
		const onConfirmPassword = () => {
			// 비밀번호확인 빈값 체크
			if (passwordConfirm.value === '') {
				vaildateYn.value.password = true
				return
			}

			if (registPayload.pswd === passwordConfirm.value) {
				vaildateYn.value.password = true
			} else {
				vaildateYn.value.password = false
			}
		}

		/**
		 * 이름 형식 vaildate
		 */
		const validateNm = () => {
			if (registPayload.nm === '') {
				vaildateYn.value.nm = true
				return
			}
			if (nmRegex.test(registPayload.nm)) {
				vaildateYn.value.nm = true
			} else {
				vaildateYn.value.nm = false
			}
		}
		/**
		 * 이메일 형식 vaildate
		 */
		const validateEmail = () => {
			// 이메일 빈값 체크
			if (registPayload.eml === '') {
				vaildateYn.value.email = true
				return
			}
			// 이메일형식 체크
			if (emailRegex.test(registPayload.eml)) {
				vaildateYn.value.email = true
			} else {
				vaildateYn.value.email = false
			}
		}

		/**
		 * 비밀번호 길이 vaildate
		 */
		const validatePasswordLength = () => {
			// 비밀번호 빈값 체크
			if (registPayload.pswd === '') {
				vaildateYn.value.passwordLength = true
				return
			}
			/**
			 * 비밀번호 길이 체크 (8자 이상)
			 */
			if (registPayload.pswd.length >= 6 && registPayload.pswd.length <= 20) {
				vaildateYn.value.passwordLength = true
			} else {
				vaildateYn.value.passwordLength = false
			}

			if (passwordRegex.test(registPayload.pswd)) {
				vaildateYn.value.passwordForm = true
			} else {
				vaildateYn.value.passwordForm = false
			}
		}

		// const validatePhoneNumber = () => {
		// 	if (registPayload.telno === '') {
		// 		vaildateYn.value.telno = true
		// 		return
		// 	}
		// }
		/**
		 * 연락처 형식 vaildate
		 */
		const formatPhoneNumber = () => {
			// 정규식을 사용하여 숫자만 추출
			const phoneNumber = registPayload.telno.replace(/[^0-9]/g, '')

			if (registPayload.telno === '') {
				vaildateYn.value.telno = true
				return
			}

			// 전화번호가 02로 시작하는지 확인
			if (phoneNumber.startsWith('02')) {
				// 02로 시작하면 중간에 '-' 추가
				registPayload.telno = phoneNumber.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3')
				if (phoneNumber.length >= 9 && phoneNumber.length <= 10) {
					vaildateYn.value.telno = true
				} else {
					vaildateYn.value.telno = false
				}
			} else if (phoneNumber.startsWith('010')) {
				// 02로 시작하지 않으면 중간에 '-' 추가하지 않음
				registPayload.telno = phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
				if (phoneNumber.length == 11) {
					vaildateYn.value.telno = true
				} else {
					vaildateYn.value.telno = false
				}
			} else {
				vaildateYn.value.telno = false
			}
		}

		/**
		 * 아이디 중복여부
		 * @param {*} id
		 */
		const isIdDuplication = async (id) => {
			// 중복체크
			const { data } = await authApi.signupIdCheck(id)

			return data ? true : false
		}

		/**
		 * 취소버튼 클릭
		 */
		const onCancelClick = () => {
			location.href = '/login'
		}

		/**
		 * 관리자 여부
		 * */
		const changeEmlRecvYn = () => {
			if (registPayload.emlRecvYn === 'Y') {
				registPayload.emlRecvYn = 'N'
			} else {
				registPayload.emlRecvYn = 'Y'
			}
		}

		/**
		 * 승인요청 버튼 클릭
		 */
		const onSignupClick = () => {
			if (registPayload.ogdpCd === '') {
				modalStore.showToast('error', '소속(지자체)을 입력해주세요.')
				ogdpInput.value.focus()
				return
			}

			if (registPayload.deptNm === '') {
				modalStore.showToast('error', '부서(국)를 입력해주세요.')
				deptInput.value.focus()
				return
			}

			if (registPayload.divNm === '') {
				modalStore.showToast('error', '부서(과)를 입력해주세요.')
				divInput.value.focus()
				return
			}

			if (registPayload.id === '') {
				modalStore.showToast('error', '아이디를 입력해주세요.')
				idInput.value.focus()
				return
			}

			if (!vaildateYn.value.id) {
				modalStore.showToast('error', '아이디 중복여부를 확인해주세요.')
				idInput.value.focus()
				return
			}

			if (registPayload.nm === '') {
				modalStore.showToast('error', '이름을 입력해주세요.')
				nameInput.value.focus()
				return
			}

			if (vaildateYn.value.nm === false) {
				modalStore.showToast('error', '이름을 올바르게 입력해주세요.')
				nameInput.value.focus()
				return
			}

			if (registPayload.taskTkcgCd === '') {
				modalStore.showToast('error', '업무담당을 입력해주세요.')
				taskTkcgInput.value.focus()
				return
			}

			if (registPayload.pswd === '') {
				modalStore.showToast('error', '비밀번호를 입력해주세요.')
				passwordInput.value.focus()
				return
			}

			if (passwordConfirm.value === '') {
				modalStore.showToast('error', '비밀번호 확인을 입력해주세요.')
				passwordConfirmInput.value.focus()

				return
			}

			if (!vaildateYn.value.passwordLength) {
				modalStore.showToast('error', '비밀번호 길이가 맞지 않습니다.')
				passwordInput.value.focus()
				return
			}

			if (!vaildateYn.value.password) {
				modalStore.showToast('error', '비밀번호 형식이 올바르지 않습니다.')
				passwordConfirmInput.value.focus()
				return
			}

			if (registPayload.telno === '') {
				modalStore.showToast('error', `연락처를 입력해주세요.`)
				telnoInput.value.focus()
				return
			}

			if (vaildateYn.value.telno == false) {
				modalStore.showToast('error', `연락처 형식이 올바르지 않습니다.`)
				telnoInput.value.focus()
				return
			}

			if (registPayload.eml === '') {
				modalStore.showToast('error', `이메일을 입력해주세요.`)
				emailInput.value.focus()
				return
			}

			if (vaildateYn.value.eml == false) {
				modalStore.showToast('error', `이메일 형식이 올바르지 않습니다.`)
				emailInput.value.focus()
				return
			}

			if (!vaildateYn.value.email) {
				modalStore.showToast('error', `이메일 형식이 올바르지 않습니다.`)
				emailInput.value.focus()
				return
			}

			if (!fileInput.value.files.length) {
				modalStore.showToast('error', '보안서약서를 첨부해주세요.')
				return
			}

			// 파일 형식이 pdf만 지원하는지 여부
			if (fileInput.value.files && fileInput.value.files.length > 0) {
				const selectedFileType = fileInput.value.files[0].type

				if (selectedFileType !== 'application/pdf') {
					modalStore.showToast('error', '파일 형식은 PDF만 지원합니다.')
					return
				}
			}

			modalStore.showConfirm(
				`사용자 정보를
			등록하고 사용승인 신청을
			하시겠습니까?`,
				async () => {
					// 이메일 수신 동의 여부
					if (registPayload.emlRecvYn == '') {
						registPayload.emlRecvYn = 'N'
					}

					// 보안서약서 여부
					if (registPayload.fileYn === '') {
						registPayload.fileYn = 'N'
					}

					// FormData 객체 생성
					const formData = new FormData()
					const file = fileInput.value.files[0]

					formData.append('gisUserInfo.id', registPayload.id)
					formData.append('gisUserInfo.pswd', registPayload.pswd)
					formData.append('gisUserInfo.nm', registPayload.nm)
					formData.append('gisUserInfo.ogdpCd', registPayload.ogdpCd)
					formData.append('gisUserInfo.ogdpNm', registPayload.ogdpNm)
					formData.append('gisUserInfo.deptNm', registPayload.deptNm)
					formData.append('gisUserInfo.divNm', registPayload.divNm)
					formData.append('gisUserInfo.taskTkcgCd', registPayload.taskTkcgCd)
					formData.append('gisUserInfo.telno', registPayload.telno)
					formData.append('gisUserInfo.eml', registPayload.eml)
					formData.append('gisUserInfo.emlRecvYn', registPayload.emlRecvYn)
					formData.append('gisUserInfo.fileYn', registPayload.fileYn)
					formData.append('gisUserInfo.fileNm', file.name)

					// 파일이 존재하면 FormData에 파일을 추가
					if (file) {
						formData.append('file', file, file.name)
						registPayload.fileNm = file.name
					}

					try {
						const { data, status } = await authApi.signup(formData, {
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'multipart/form-data',
							},
						})

						if (status.code === 200) {
							modalStore.showToast('success', `사용자 승인신청을 완료하였습니다.`)
						} else {
							modalStore.showToast('error', `내부 서버 에러가 발생하였습니다.`)
						}
						// router.push({ name: 'login' })
						location.href = '/login'
					} catch (error) {
						console.error('회원가입 중 에러 발생:', error)
					}
				}
			)
		}

		// 보안서약서
		const onFileConfirm = () => {
			// 파일 형식이 pdf만 지원하는지 여부
			if (fileInput.value.files && fileInput.value.files.length > 0) {
				const selectedFileType = fileInput.value.files[0].type

				if (selectedFileType !== 'application/pdf') {
					isPdfFile.value = false
					return
				} else {
					isPdfFile.value = true
				}
			} else {
				isPdfFile.value = false
				console.log('pdf 파일 xxx')
			}

			const selectedFile = fileInput.value.files[0]
			registPayload.fileNm = selectedFile
			console.log('파일명', registPayload.fileNm)

			// 보안서약서 파일 여부
			if (registPayload.fileNm) {
				registPayload.fileYn = 'Y'
			} else {
				registPayload.fileYn = 'N'
			}
		}

		return {
			sggOptions,
			taskTkcgOptions,
			registPayload,
			idInput,
			passwordInput,
			passwordConfirmInput,
			nameInput,
			ogdpInput,
			deptInput,
			divInput,
			taskTkcgInput,
			telnoInput,
			emailInput,
			emailRecvInput,
			passwordConfirm,
			vaildateYn,
			onConfirmPassword,
			validateEmail,
			validatePasswordLength,
			handleSelectionChange,
			onCheckDuplicateClick,
			onCancelClick,
			onSignupClick,
			changeEmlRecvYn,
			formatPhoneNumber,
			validateNm,
			fileInput,
			onFileConfirm,
			isPdfFile,
		}
	},
}
</script>

<style scoped>
.vaildate-text {
	display: block;
	margin-top: 8px;
	font-size: 12px;
}

/** Text Box, button disabled CSS */
input[type='text']:disabled {
	background: #ccc;
}
button:disabled {
	background: #ccc;
	border-color: #ccc;
}
</style>
