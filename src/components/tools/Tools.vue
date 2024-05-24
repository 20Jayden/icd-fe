<template>
	<div class="toolbar">
		<h3 class="blind">도구모음</h3>
		<ul>
			<BasicTools />
			<!-- <DrawTools /> -->
		</ul>
	</div>
</template>

<script>
import BasicTools from '@/components/tools/basicTools/BasicTools.vue'
// import DrawTools from '@/components/tools/drawTools/DrawTools.vue'
import { onMounted } from 'vue'

export default {
	components: { BasicTools },
	setup() {
		onMounted(() => {
			addEventHandler()
		})

		const addEventHandler = () => {
			// 툴바
			$('.toolbar > ul > li > a').click(function () {
				$(this).toggleClass('active')
			})

			// 툴바 중복 켜기 Off하려면 주석해제
			// $(document).mouseup(function (e) {
			// 	if ($('.toolbar > ul > li > ol').has(e.target).length == 0) {
			// 		$('.toolbar > ul > li > ol').prev().removeClass('active')
			// 	}
			// })
		}

		return {}
	},
}
</script>

<style lang="scss" scoped></style>
