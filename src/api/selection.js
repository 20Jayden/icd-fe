import { $api } from './api.config'
import { SELECTION } from './api.url'

export const selectionApi = {
	getPnuByPolygon: async (coordinates) => await $api.get(SELECTION.POLYGON, { params: { coordinates } }),
	downloadExcel: async (pnuList) => await $api.post(SELECTION.DOWNLOAD, pnuList),
	getPublicStatFromPolygon: async (coordinates) => await $api.get(SELECTION.PUBLIC, { params: { coordinates } }),
}
