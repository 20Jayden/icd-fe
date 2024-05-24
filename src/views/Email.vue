<template>
	<body>
		<div class="error-page">
			<div class="wrap">
				<img src="/assets/images/soul_logo.png" alt="" />
				<button class="btn btn-primary btn-lg" style="background: firebrick; margin-right: 20px" @click="onEmailClick">
					이메일 수신 거부
				</button>
				<a class="btn btn-primary btn-lg" href="http://retrend.ss.eseoul.go.kr:8090">로그인페이지로 이동</a>
			</div>
		</div>
	</body>
</template>

<script>
import { ref, onMounted } from 'vue'
import { monitorBottom as BottomListApi } from '@/api/monitor'
import { useModalStore } from '@/stores/modal'

export default {
	setup() {
		onMounted(() => {
			console.log(window.location.href)
		})

		const userId = ref('')
		const modalStore = useModalStore()
		const onEmailClick = async () => {
			let words = window.location.href.split('/')
			let length = words.length
			userId.value = words[length - 1]

			console.log('유저 아이디는', userId.value)
			const { data, status } = await BottomListApi.updateUserEmlInfo(userId.value)

			if (status.code == 200) {
				modalStore.showAlert(userId.value + '님 이메일 수신 동의를 철회 했습니다')
			} else {
				modalStore.showAlert(userId.value + '님 이메일 수신 동의 철회를 실패 했습니다.')
			}
		}
		return {
			onEmailClick,
		}
	},
}
</script>

<style scoped></style>
