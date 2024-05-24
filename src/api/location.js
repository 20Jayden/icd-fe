import { $api } from './api.config'

import { LOCATION } from './api.url'

export default {
	getCenterLocation: async (lon, lat) => await $api.get(LOCATION.CENTER.ADDRESS, { params: { lon, lat } }),
	getSGGCenterCoord: async (sggCd) => await $api.get(LOCATION.CENTER.SGG.replace('{sggCd}', sggCd)),
	getUMDCenterCoord: async (umdCd) => await $api.get(LOCATION.CENTER.UMD.replace('{umdCd}', umdCd)),
}
