import { $api } from './api.config'
import { MARK } from './api.url'

export default {
	addBookmark: async (bookmark) => await $api.post(MARK.BOOKMARK.LIST, bookmark),
	listBookmark: async () => await $api.get(MARK.BOOKMARK.LIST),
	deleteBookmark: async (bookmarkId) => await $api.delete(MARK.BOOKMARK.DETAIL.replace('{bookmarkId}', bookmarkId)),
	sortBookmark: async (bookmarks) => await $api.put(MARK.BOOKMARK.SORT, bookmarks),
}
