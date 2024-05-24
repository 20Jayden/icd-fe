<template>
	<div class="password-popup layer-popup show">
		<div class="password-form">
			<div class="head">
				<div class="tit">비밀번호 변경</div>
				<a class="btn-close" @click="closePopup()"><span>팝업창</span></a>
			</div>
			<div class="body" style="height: 410px">
				<form class="password-condition">
					<legend>비밀번호 변경</legend>
					<ul>
						<li>
							<label
								>현재 비밀번호
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<input type="password" class="form-control" ref="passwordInput" v-model="info.pswd" />
							</div>
						</li>
						<li>
							<label
								>새 비밀번호
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<input
									type="password"
									class="form-control"
									ref="newPasswordInput"
									v-model="info.newPswd"
									@blur="validatePasswordLength"
									@change="onConfirmPassword"
								/>
								<br />
								<span v-if="!validateYn.passwordLength" class="text-danger validate-text">
									비밀번호는 8자리 이상으로 입력하셔야 합니다.</span
								>
							</div>
							<span v-if="!validateYn.passwordForm" class="text-danger validate-text">
								비밀번호는 대문자, 소문자, 숫자, 특수문자(!, @, #, $)를 각각 최소한 하나씩 포함하셔야 합니다.</span
							>
						</li>
						<li>
							<label
								>새 비밀번호 확인
								<div class="required"><span>필수입력</span></div></label
							>
							<div class="form-group">
								<input
									type="password"
									class="form-control"
									ref="newPasswordInputConfirm"
									@change="onConfirmPassword"
									v-model="passwordConfirm"
								/>
							</div>
						</li>
					</ul>
					<div class="action-btn-group">
						<div class="center">
							<button type="button" class="btn btn-primary w-sm" @click="onChangePassword()">변경</button>
							<button type="button" class="btn btn-dark w-sm" @click="closePopup()">취소</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import authApi from '@/api/auth'
import { useUserInfoStore } from '@/stores/userInfo'
import userInfo from '@/api/userInfo'
import { manageUser as manageUserApi } from '@/api/settings'
import { useModalStore } from '@/stores/modal'
export default {
	emits: ['closePopup'],
	setup(props, { emit }) {
		onMounted(() => {
			getUserInfo()
		})

		// store
		const userStore = useUserStore()
		const modalStore = useModalStore()

		const closePopup = async () => {
			emit('closePopup')
		}

		watch(
			() => userStore.loginUser.id,
			(newId) => {
				info.value.id = newId
			}
		)

		// 각 필드
		const passwordInput = ref(null)
		const newPasswordInput = ref(null)
		const newPasswordInputConfirm = ref(null)

		// 비밀번호 확인
		let passwordConfirm = ref('')

		// 비밀번호형식 유효성검사 정규식
		const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$])[A-Za-z\d!@#$]{8,}$/

		// 유효성 검사 여부
		let validateYn = ref({
			password: true,
			passwordLength: true,
			passwordForm: true,
			passwordMatch: false,
		})

		let info = ref({
			id: userStore.loginUser.id,
			pswd: '',
			newPswd: '',
		})

		const getUserInfo = async () => {
			// const { data, status } = await userInfo.getUserInfo(userStore.loginUser.id)
			// console.log('로그인한 사용자 data', data)
			// console.log('로그인한 사용자 status', status)
		}

		// 비밀번호 validate
		const validatePasswordLength = () => {
			// 새 비밀번호 입력란 빈 값 체크
			if (info.value.newPswd === '') {
				validateYn.value.passwordLength = true
				return
			}

			// 비밀번호 길이 체크(8자 이상)
			if (info.value.newPswd.length >= 8) {
				validateYn.value.passwordLength = true
			} else {
				validateYn.value.passwordLength = false
			}

			// 비밀번호 형식
			if (passwordRegex.test(info.value.newPswd)) {
				validateYn.value.passwordForm = true
			} else {
				validateYn.value.passwordForm = false
			}
		}

		// 비밀번호 확인
		const onConfirmPassword = () => {
			// 비밀번호 빈 값 체크
			if (passwordConfirm.value === '') {
				validateYn.value.password = true
				return
			}

			if (info.value.newPswd === passwordConfirm.value) {
				validateYn.value.password = true
			} else {
				validateYn.value.password = false
			}

			// 신규 비밀번호 일치/불일치
			// if (!validateYn.value.password) {
			// 	modalStore.showToast('error', '비밀번호가 일치하지 않습니다.')
			// 	newPasswordInputConfirm.value.focus()
			// 	return
			// }
		}

		const onChangePassword = async () => {
			info.value.id = userStore.loginUser.id
			console.log('New Password:', info.value.pswd)
			console.log('>>>>>>>', info.value)
			if (info.value.newPswd !== passwordConfirm.value) {
				modalStore.showToast('error', '신규 비밀번호가 일치하지 않습니다.')
				newPasswordInputConfirm.value.focus()
				return
			}
			if (info.value.pswd === '') {
				modalStore.showToast('error', '현재 비밀번호를 입력해주세요.')
				passwordInput.value.focus()
				return
			}

			if (info.value.newPswd === '') {
				modalStore.showToast('error', '신규 비밀번호를 입력해주세요.')
				newPasswordInput.value.focus()
				return
			}

			if (passwordConfirm.value === '') {
				modalStore.showToast('error', '신규 비밀번호 확인을 입력해주세요.')
				newPasswordInputConfirm.value.focus()
				return
			}

			modalStore.showConfirm('비밀번호를 변경하시겠습니까?', async () => {
				const { data, status } = await userInfo.updatePassword(info.value)
				console.log('사용자 비밀번호 변경 status', status)
				if (status.code === 200) {
					modalStore.showAlert('비밀번호가 변경되었습니다.')
					closePopup()
				} else if (status.code === 400) {
					modalStore.showAlert('현재 비밀번호가 일치하지 않습니다.')
				}
			})
		}

		return {
			passwordInput,
			newPasswordInput,
			newPasswordInputConfirm,
			passwordConfirm,
			info,
			confirm,
			validateYn,
			closePopup,
			validatePasswordLength,
			onConfirmPassword,
			onChangePassword,
		}
	},
}
</script>

<style scoped>
.password-popup {
	width: 100%;
	z-index: 76;
	height: 100%;
	position: fixed;
	background-color: rgba(0, 0, 0, 0.8);
}
.password-popup .password-form {
	width: 600px;
	margin-left: 40%;
	margin-top: 10%;
}
.head {
	cursor: move;
}

.password-form > .body {
	display: flex;
	justify-content: center;
	align-items: center;
}
.password-condition {
	width: 400px;
}
.password-condition .form-control {
	width: 400px;
}
.password-condition > ul {
	margin-bottom: 60px;
}
.password-condition > ul > li {
	margin: 10px 0;
}

.password-condition .required {
	display: inline-block;
}

.password-condition .required:before {
	content: '*';
	color: #dd3654;
	display: inline-block;
}

.password-condition .required span {
	display: none;
}
</style>
