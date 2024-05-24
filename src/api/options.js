import { $api } from './api.config'

import { CMMN } from './api.url'

export default {
	getSGGOptions: async () => await $api.get(CMMN.OPTIONS.SGG),
	getUMDOptions: async (sggCd) => await $api.get(CMMN.OPTIONS.UMD.replace('{sggCd}', sggCd)),
	getRtmsCodeOptions: async (code) => await $api.get(CMMN.OPTIONS.RTMS_CODE.replace('{code}', code)),
	getKabBldgMuseOptions: async () => await $api.get(CMMN.OPTIONS.KAB_BLDB_MUSE),
	getRentKabBldgMuseOptions: async () => await $api.get(CMMN.OPTIONS.RENT_KAB_BLDB_MUSE),
	getRentPlcyBldgMuseOptions: async () => await $api.get(CMMN.OPTIONS.RENT_PLCY_BLDB_MUSE),
	getTaskTkcgOptions: async () => await $api.get(CMMN.OPTIONS.TASK_TKCG),
	getLayerAuthOptions: async () => await $api.get(CMMN.OPTIONS.LAYER_AUTH_GROUP),
	getUserAuthOptions: async () => await $api.get(CMMN.OPTIONS.USER_AUTH_GROUP),
}
