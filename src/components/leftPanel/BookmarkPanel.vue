<template>
	<div class="content show">
		<div class="head">
			<h3>즐겨찾기</h3>
		</div>
		<div class="body slim-scroll">
			<div class="bookmark-list">
				<draggable :list="bookmarks" @change="sortBookmark(bookmarks)">
					<div v-for="(bookmark, index) in bookmarks" :key="index" class="thum" @click="moveBookmark(bookmark)">
						<span v-if="bookmark.location != null" class="badge badge-info">{{ bookmark.location }}</span>
						<div class="img"><img :src="bookmark.thumbnail" alt="더미이미지" /></div>
						<a href="#" class="del" title="삭제" @click="deleteBookmark(bookmark, index)"></a>
					</div>
				</draggable>
			</div>
			<div class="action-btn-group">
				<button type="button" class="btn btn-primary btn-block" @click="addBookmark">즐겨찾기 추가</button>
			</div>
		</div>
	</div>
</template>

<script>
import { useModalStore } from '@/stores/modal'
import { ref, onMounted } from 'vue'
import bookmarkApi from '@/api/bookmark'
import { useViewStore } from '@/stores/view'
import { useLayerStore } from '@/stores/layer'
import wms from '@/composition/wms'
import bookmark from '@/api/bookmark'
import html2canvas from 'html2canvas'
import { VueDraggableNext } from 'vue-draggable-next'
import { useLocationStore } from '@/stores/location'
import { useMenuStore } from '@/stores/menu'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'

export default {
	components: {
		draggable: VueDraggableNext,
	},
	setup() {
		const modalStore = useModalStore()
		const menuStore = useMenuStore()
		const viewStore = useViewStore()
		const layerStore = useLayerStore()
		const locationStore = useLocationStore()
		const log = useLog()
		// 북마크 목록 데이터
		const bookmarks = ref([])
		onMounted(() => {
			$('.side-panel .body').slimScroll({
				height: 'calc(100% - 75px)',
				railVisible: true,
				wheelStep: 50,
				allowPageScroll: false,
				disableFadeOut: false,
			})
			listBookmark()
			layerStore.listLayer()
		})

		/**
		 * 즐겨찾기 목록 조회
		 */
		const listBookmark = async () => {
			const { data } = await bookmarkApi.listBookmark()
			bookmarks.value = data
		}

		/**
		 * 즐겨찾기 등록
		 */
		const addBookmark = async () => {
			let element = WGMap.getTargetElement()
			html2canvas(element, {
				useCORS: true,
				allowTaint: true,
				scale: 0.5,
			}).then(async (canvas) => {
				const imgSrc = canvas.toDataURL('image/jpeg', 0.1)
				let newBookmark = {
					thumbnail: imgSrc,
					view: { ...viewStore.$state },
					location:
						locationStore.selectedSgg.text === undefined
							? null
							: locationStore.selectedSgg.text + ' ' + locationStore.selectedUmd.text, // 시군구 + 읍면동
					layers: layerStore.visibleLayerIds,
				}
				const { status, data } = await bookmarkApi.addBookmark(newBookmark)

				if (status.code === 200) {
					bookmarks.value.unshift(data)
					modalStore.showToast('success', `즐겨찾기가 추가되었습니다.`)
					//로그테이블(즐겨찾기 추가)
					CommonUtil.log(log.TARGET.BOOKMARKSAVE, log.ACTION.SUCCESS, null)
				} else {
					modalStore.showToast('error', `즐겨찾기 추가를 실패하였습니다.`)
					CommonUtil.log(log.TARGET.BOOKMARKSAVE, log.ACTION.FAIL, null)
				}
			})
		}

		/**
		 * 즐겨찾기 이동
		 */
		const moveBookmark = ({ view, layers }) => {
			viewStore.basemap = view.basemap
			viewStore.isHybrid = view.isHybrid
			// 위치 이동
			WGMap.getView().setCenter(wg.proj.transform([view.lon, view.lat], 'EPSG:4326', 'EPSG:3857'))
			WGMap.getView().setZoom(view.zoom)
			WGMap.getView().setRotation(view.rotate)
			setTimeout(() => {
				// 레이어 체크 해제
				layerStore.setInvisibleAllLayers()

				// 레이어 표시
				wms.inVisible()

				layers.forEach((seq) => {
					console.log(seq)

					wms.setVisible('spta', seq, true)

					layerStore.visible[seq] = true
				})
			}, 100)
		}

		/**
		 * 즐겨찾기 삭제
		 */
		const deleteBookmark = async ({ bookmarkId }, index) => {
			console.log(bookmarkId)
			modalStore.showConfirm(`즐겨찾기를 삭제하시겠습니까?`, async () => {
				const { status, data } = await bookmarkApi.deleteBookmark(bookmarkId)

				if (status.code === 200) {
					bookmarks.value.splice(index, 1)
					modalStore.showToast('success', `즐겨찾기를 삭제하였습니다.`)
				} else {
					modalStore.showToast('error', `즐겨찾기 삭제를 실패하였습니다.`)
				}
			})
		}

		/**
		 * 즐겨찾기 순서변경
		 */
		const sortBookmark = async () => {
			const payload = bookmarks.value.map((bookmark, index) => {
				bookmark.order = bookmarks.value.length - index
				const { bookmarkId, order } = bookmark

				return {
					bookmarkId,
					order,
				}
			})

			const res = await bookmarkApi.sortBookmark(payload)
		}

		return { bookmarks, addBookmark, moveBookmark, deleteBookmark, sortBookmark }
	},
}
</script>

<style scoped></style>
