import { $api } from './api.config'
import { MARK } from './api.url'

export default {
	// addPinMarker: async (pinMarker) => await $api.post(MARK.PINMARKER.LIST, bookmark),
	listPinMarker: async () => await $api.get(MARK.PINMARKER.LIST),
	pinMarkerDetail: async (pinMarkerId) => await $api.get(MARK.PINMARKER.DETAIL.replace('{pinMarkerId}', pinMarkerId)),
	savePinMarker: async (markerInfo) => await $api.post(MARK.PINMARKER.SAVE, markerInfo),
	removePinMarker: async (pinMarkerId) =>
		await $api.delete(MARK.PINMARKER.REMOVE.replace('{pinMarkerId}', pinMarkerId)),
	// sortPinMarker: async (bookmarks) => await $api.put(MARK.PINMARKER.SORT, bookmarks),
}
