<template>
	<div class="login">
		<div class="wrap">
			<div class="logo-wrap">
				<div class="logo logo-image"></div>
				<div class="logo logo-text"></div>
				<div class="soul-logo"></div>
			</div>
			<form class="form-area">
				<div class="tit">GIS 로그인</div>
				<div class="form-group id">
					<input
						v-model="state.loginReqPayload.id"
						type="text"
						class="form-control form-control-lg"
						placeholder="아이디 입력"
						@keyup.enter="login"
					/>
				</div>
				<div class="form-group pw">
					<input
						v-model="state.loginReqPayload.password"
						type="password"
						class="form-control form-control-lg"
						placeholder="비밀번호 입력"
						@keyup.enter="login"
					/>
					<!-- 틀렸을경우 .invalid 추가 -->
					<div class="form-group">
						<span v-if="state.validate.required" class="text-danger">아이디 및 비밀번호를 입력해 주세요.</span>
						<span v-if="state.validate.unauthorized" class="text-danger">
							{{ state.validate.unauthorized }}
						</span>
					</div>
					<div class="form-group">
						<a href="#" @click="forgetPassword"
							><span class="text-info" style="text-decoration: underline">비밀번호를 잊으셨나요?</span></a
						>
					</div>
				</div>
				<div class="form-group">
					<button
						type="button"
						class="btn btn-primary btn-block btn-rounded btn-lg modal-open"
						data-modal="modal-inquiry"
						:disabled="isLoading"
						@click="login"
					>
						로그인
						<Spinner v-if="isLoading" style="float: right; width: 20px; height: 20px" />
					</button>
				</div>
				<div class="findid">
					<div class="custom-control custom-checkbox">
						<input
							v-model="state.saveId"
							type="checkbox"
							id="check1"
							class="custom-control-input"
							@change="onSaveIdChange"
						/>
						<label class="custom-control-label" for="check1">아이디 기억하기</label>
					</div>
				</div>
				<!-- 로그인 정보 잘못됨 알럿 data-modal="alert-wrong" -->
				<button type="button" class="btn btn-light btn-block btn-rounded btn-lg" @click="signup">
					공간분석 시스템 사용자 등록
				</button>
			</form>
		</div>

		<!-- <button type="button" class="btn btn-light btn-rounded btn-lg btn-leftbottom" @click="dashboard">대시보드</button> -->
		<router-link to="/dashboard">
			<button type="button" class="btn btn-light btn-rounded btn-lg btn-leftbottom">대시보드</button>
		</router-link>
		<router-link to="/bi">
			<button type="button" class="btn btn-light btn-rounded btn-lg btn-rightbottom">정보분석 시스템 로그인</button>
		</router-link>
	</div>

	<!-- alert : 로그인 정보 잘못됨 -->
	<div class="modal" id="alert-wrong">
		<div class="modal-sandbox"></div>
		<div class="modal-content">
			<div class="modal-head">
				<div class="tit">알림</div>
				<a href="#" class="btn-close"><span>팝업창 닫기</span></a>
			</div>
			<div class="modal-body">
				<div class="alert-ment danger">
					<!-- 알럿 아이콘 종류 .success / .info / .save / .danger -->
					<p>로그인 정보가 잘못 되었습니다.</p>
				</div>
				<div class="action-btn-group">
					<div class="center">
						<button type="button" class="btn btn-primary w-sm btn-close">확인</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- modal : 관리자에게 문의 -->
	<div class="modal" id="modal-inquiry">
		<div class="modal-sandbox"></div>
		<div class="modal-content">
			<div class="modal-head">
				<div class="tit">알림</div>
				<a href="#" class="btn-close"><span>팝업창 닫기</span></a>
			</div>
			<div class="modal-body">
				<div class="h4 text-center">승인 대기중입니다.<br />관리자에게 문의 바랍니다.</div>
				<p class="text-center">
					담당부서 : 서울특별시 도시공간본부 토지관리과<br />
					담당자 : 이은영 주무관<br />
					메일 : eylee@seoul.go.kr<br />
					전화번호 : 02-1234-5678<br />
				</p>
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
//router
import router from '@/router'
//api
import authApi from '@/api/auth'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
//store
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'
//component
import Spinner from '@/components/Spinner.vue'

export default {
	components: {
		Spinner,
	},
	setup() {
		const modalStore = useModalStore()

		let isLoading = ref(false)

		onMounted(() => {
			const sptaId = localStorage.getItem('spta-id')
			if (sptaId) {
				state.loginReqPayload.id = sptaId
				state.saveId = true
			}
		})

		/**
		 * pinia: userStore
		 */
		const userStore = useUserStore()
		const log = useLog()

		/**
		 * state: 컴포넌트 상태관리
		 */
		const state = reactive({
			loginReqPayload: {
				id: '',
				password: '',
			},
			saveId: false,
			validate: {
				required: false,
				unauthorized: '',
			},
		})

		/**
		 * validate 리셋
		 */
		const resetValidate = () => {
			state.validate = {
				required: false,
				unauthorized: '',
			}
		}

		/**
		 * 로그인 처리 로직
		 */
		const login = async () => {
			// 입력 validation 체크
			if (!state.loginReqPayload.id || !state.loginReqPayload.password) {
				state.validate.required = true
				return false
			}

			// 아이디저장 여부 확인 및 저장
			if (state.saveId) {
				localStorage.setItem('spta-id', state.loginReqPayload.id)
			}

			resetValidate()

			isLoading.value = true

			console.log('$ 로그인 Request Payload ::', state.loginReqPayload)
			// 서버에 로그인 요청
			const { status, data } = await authApi.login(state.loginReqPayload)

			if (status.code === 200) {
				// localStorage에 토큰 저장
				localStorage.setItem('spta-t', data.token)
				// 로그인 사용자정보 store에 저장
				const { id, name, org, eml, auth, ogdpCd, taskTkcgCd, ogdpNm } = data
				userStore.setLoginUser({ id, name, org, eml, auth, ogdpCd, taskTkcgCd, ogdpNm })
				// 화면이동
				router.push({ name: 'main' })
				//로그테이블(로그인)
				CommonUtil.log(log.TARGET.LOGIN, log.ACTION.SUCCESS, null)
			} else {
				// console.log(status, data)
				state.validate.unauthorized = data.message
				isLoading.value = false
				CommonUtil.nLog(state.loginReqPayload.id, log.TARGET.LOGIN, log.ACTION.FAIL, data.message)
			}
		}

		/**
		 * 비밀번호 찾기
		 */
		const forgetPassword = () => {
			modalStore.showAlert(`관리자에게 문의 바랍니다.\n
					담당부서 : 서울특별시 도시공간본부 토지관리과
					담당자 : 이은영 주무관
					메일 : eylee@seoul.go.kr
					전화번호 : 02-2133-4666`)
		}
		/**
		 * 아이디저장 체크 변경
		 * @param {event} e
		 */
		const onSaveIdChange = (e) => {
			// 아이디저장 해제시 저장된 아이디 삭제
			if (!e.target.checked) {
				localStorage.removeItem('spta-id')
			}
		}

		const signup = () => {
			location.href = '/signup'
		}

		return { isLoading, state, forgetPassword, login, signup, onSaveIdChange }
	},
}
</script>

<style scoped></style>
