<template>
	<div
		:id="'notice-' + data.id"
		class="layer-popup show"
		:style="{ left: screenWidth / 2 - 900 / 2 + 'px', top: screenHeight / 2 - 547 / 2 + 'px' }"
		v-if="cookieData.indexOf('notice-' + data.id + '=done') < 0"
	>
		<div class="body">
			<div class="property-info">
				<div class="left">
					<span v-if="data.notiType === '공지사항'" class="badge badge-outline-danger" style="font-size: 1rem">{{
						data.notiType
					}}</span>
					<span v-if="data.notiType === '교육알림'" class="badge badge-outline-info" style="font-size: 1rem">{{
						data.notiType
					}}</span>
				</div>
				<div class="right">{{ formatDateText(data.createdDt) }}</div>
			</div>
			<div class="body-center">
				<div class="large-tit text-center">{{ data.notiTitle }}</div>
				<div class="notice-wrap">
					<!-- 텍스트형 공지 -->
					<template v-if="data.notiContentType === 'T'">
						<div v-html="data.notiContentText" class="text-left text-wrap"></div>
					</template>
				</div>
			</div>
			<div class="action-btn-group">
				<div class="center" style="text-align: center">
					<button type="button" class="btn btn-primary" @click="setCookie('notice-' + data.id, 'done')">
						오늘 하루 보지않기
					</button>
					<button
						v-if="data.notiLinkPath != null"
						type="button"
						class="btn btn-primary"
						@click="onDetailViewClick(data.notiLinkPath)"
					>
						자세히 보기
					</button>
					<button type="button" class="btn btn-primary btn-close" @click="onClosePopup('notice-' + data.id)">
						닫기
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
	props: {
		// 데이터
		data: {
			type: Object,
			default: () => {},
		},
	},
	setup(props) {
		const screenWidth = ref(document.body.offsetWidth) // 화면 가로길이
		const screenHeight = ref(window.screen.height) // 화면 세로길이
		const cookieData = ref('') // 쿠키 데이터

		onMounted(() => {
			$('#notice-' + props.data.id).draggable({
				containment: 'body',
				scroll: false,
				handle: '.body',
			})
			$('.notice-wrap').slimScroll({
				height: '400px',
				railVisible: true,
				wheelStep: 50,
				allowPageScroll: false,
				disableFadeOut: false,
			})
			cookieData.value = document.cookie
		})

		/**
		 * 팝업 자세히 보기
		 * @param {*} link
		 */
		const onDetailViewClick = (link) => {
			window.open(link, '_blank').focus()
		}

		/**
		 * 팝업 닫기
		 * @param {*} popupId
		 */
		const onClosePopup = (popupId) => {
			document.getElementById(popupId).style.display = 'none'
		}

		// const setCookie = (name, value, exDay) => {
		// 	let todayDate = new Date()
		// 	todayDate.setDate(todayDate.getDate() + exDay)
		// 	document.cookie = name + '=' + escape(value) + '; path=/; expires=' + todayDate.toGMTString() + ';'
		// 	cookieData.value = document.cookie
		// }
		const setCookie = (name, value) => {
			let now = new Date()
			let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) // 내일 날짜 설정
			document.cookie = name + '=' + escape(value) + '; path=/; expires=' + tomorrow.toGMTString() + ';'
			cookieData.value = document.cookie // 쿠키 데이터 업데이트
		}

		/**
		 * 공지 날짜 포맷
		 * @param {*} date
		 */
		const formatDateText = (date) => {
			let today = new Date(date)
			let year = today.getFullYear()
			let month = ('0' + (today.getMonth() + 1)).slice(-2)
			let day = ('0' + today.getDate()).slice(-2)

			return year + '년 ' + month + '월 ' + day + '일'
		}

		return { screenWidth, screenHeight, cookieData, onClosePopup, onDetailViewClick, formatDateText, setCookie }
	},
}
</script>

<style scoped>
.layer-popup {
	min-width: 900px;
	width: 900px;
	height: 547px;
	border-radius: 3%;
}
.layer-popup > .body {
	width: 100%;
	height: 100%;
	padding: 30px;
	border-radius: 3%;
}
.layer-popup > .body > .body-center {
	display: flex;
	flex-direction: column;
	margin-bottom: 20px;
}
.text-wrap {
	white-space: pre-line;
	color: #4b4b4b;
	font-size: 1.075rem;
	position: relative;
	width: 846px;
	margin: 0 auto;
}
.notice-wrap > .notice-image {
	display: block;
	text-align: center;
	margin: 0 auto;
	margin-bottom: 20px;
}
.large-tit {
	font-size: 1.288rem !important;
}
</style>
