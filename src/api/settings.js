import { $api } from './api.config'
import { SETTING } from './api.url'

export const layerAuth = {
	getLayerAuthList: async (pagination) =>
		await $api.get(SETTING.LAYER_AUTH.LIST, {
			params: { ...pagination },
		}),
	getLayerRoleList: async (searchSelect, searchInput, pagination) =>
		await $api.get(SETTING.LAYER_AUTH.ROLE_LIST, {
			params: { searchSelect, searchInput, ...pagination },
		}),
	addLayerGroup: async (checkedList) => await $api.post(SETTING.LAYER_AUTH.ADD_GROUP, checkedList),
	deleteLayerGroup: async (checkedGroup) => await $api.post(SETTING.LAYER_AUTH.DELETE_GROUP, checkedGroup),
	getGroupRole: async (groupName) => await $api.get(SETTING.LAYER_AUTH.GROUP_ROLE, { params: { groupName } }),
	modLayerGroup: async (checkedList) => await $api.post(SETTING.LAYER_AUTH.MOD_GROUP, checkedList),
	getUserLayer: async (userId, keyWord) =>
		await $api.get(SETTING.LAYER_AUTH.GET_USER_LAYER, {
			params: { userId, keyWord },
		}),
	getGroupId: async (groupNm) => await $api.get(SETTING.LAYER_AUTH.GET_GROUP_ID, { params: { groupNm } }),
}

export const manageUser = {
	list: async (searchOrganization, searchApprove, searchCondition, searchKeyword, pagination) =>
		await $api.get(SETTING.MANAGEUSER.LIST, {
			params: { searchOrganization, searchApprove, searchCondition, searchKeyword, ...pagination },
		}),
	updateApprove: async (id, manageUser) => await $api.put(SETTING.MANAGEUSER.DETAIL.replace('{id}', id), manageUser),
	updateAllUserApprove: async (id) => await $api.put(SETTING.MANAGEUSER.UPDATE_USER_APPROVE.replace('{id}', id)),
	delete: async (id) => await $api.delete(SETTING.MANAGEUSER.DETAIL.replace('{id}', id)),
	updateUserInfo: async (manageUser) => await $api.post(SETTING.MANAGEUSER.USER_INFO, manageUser),
	addUserRoleGroup: async (payload) => await $api.post(SETTING.MANAGEUSER.USER_AUTH_INSERT, payload),
	updateUserRoleGroup: async (payload) => await $api.put(SETTING.MANAGEUSER.USER_AUTH_UPDATE, payload),
	registerIdCheck: async (id) => await $api.get(SETTING.MANAGEUSER.REGISTER_USER_ID_CHECK, { params: { id } }),
	addLayerRoleGroup: async (payload) => await $api.post(SETTING.MANAGEUSER.LAYER_AUTH_INSERT, payload),
	updateLayerRoleGroup: async (payload) => await $api.put(SETTING.MANAGEUSER.LAYER_AUTH_UPDATE, payload),
	IdCheck: async (userId) => await $api.get(SETTING.MANAGEUSER.USER_AUTH_ID_CHECK, { params: { userId } }),
	userLayerIdCheck: async (userId) => await $api.get(SETTING.MANAGEUSER.LAYER_AUTH_ID_CHECK, { params: { userId } }),
	userRegister: async (manageUser) => await $api.post(SETTING.MANAGEUSER.USER_REGISTER, manageUser),
	updateEmailReception: async (manageUser) => await $api.put(SETTING.MANAGEUSER.USER_EMAIL_RECEPTION, manageUser),
	updatePassword: async (manageUser) => await $api.put(SETTING.MANAGEUSER.UPDATE_PASSWORD, manageUser),
	deleteUserRoleGroup: async (userId) =>
		await $api.delete(SETTING.MANAGEUSER.DELETE_USER_ROLE_GROUP.replace('{userId}', userId)),
	deleteLayerRoleGroup: async (userId) =>
		await $api.delete(SETTING.MANAGEUSER.DELETE_LAYER_ROLE_GROUP.replace('{userId}', userId)),
	downloadFile: async (id) =>
		await $api.get(SETTING.MANAGEUSER.DOWNLOAD_FILE.replace('{id}', id), {
			responseType: 'blob',
		}),
	deleteFile: async (id) => await $api.put(SETTING.MANAGEUSER.DELETE_FILE.replace('{id}', id)),
}

export const authGroupApi = {
	getAuthGroup: async (pagination) => await $api.get(SETTING.AUTH_GROUP.GROUP_LIST, { params: { ...pagination } }),
	getAuthGroupRole: async (roleGroupId) =>
		await $api.get(SETTING.AUTH_GROUP.GROUP_ROLE.replace('{roleGroupId}', roleGroupId)),
	getAuthRole: async (searchKeyword, searchInput, pagination) =>
		await $api.get(SETTING.AUTH_GROUP.ROLE_LIST, {
			params: {
				searchKeyword,
				searchInput,
				...pagination,
			},
		}),
	deleteAuthGroup: async (checkedGroup) => await $api.post(SETTING.AUTH_GROUP.DELETE_GROUP, checkedGroup),
	addAuthGroup: async (checkedList) => await $api.post(SETTING.AUTH_GROUP.ADD_GROUP, checkedList),
	modifyAuthGroup: async (checkedList) => await $api.post(SETTING.AUTH_GROUP.MODIFY_GROUP, checkedList),
	getUserAuth: async (userId) => await $api.get(SETTING.AUTH_GROUP.MENU_AUTH.replace('{userId}', userId)),
}

export const log = {
	list: async (searchCondition, searchKeyword, startDate, endDate, pagination) =>
		await $api.get(SETTING.LOG.LIST, { params: { searchCondition, searchKeyword, startDate, endDate, ...pagination } }),
	excel: async (searchCondition, searchKeyword, startDate, endDate) =>
		await $api.get(SETTING.LOG.EXCEL, {
			params: { searchCondition, searchKeyword, startDate, endDate },
			responseType: 'blob',
		}),
	linkList: async (searchCondition, searchKeyword, startDate, endDate, pagination) =>
		await $api.get(SETTING.LOG.LINKLIST, {
			params: { searchCondition, searchKeyword, startDate, endDate, ...pagination },
		}),
	linkExcel: async (searchCondition, searchKeyword, startDate, endDate) =>
		await $api.get(SETTING.LOG.LINKEXCEL, {
			params: { searchCondition, searchKeyword, startDate, endDate },
			responseType: 'blob',
		}),
}

export const manageColor = {
	list: async () => await $api.get(SETTING.COLOR.LIST),
	updateColor: async (manageColor) => await $api.put(SETTING.COLOR.UPDATE_COLOR, manageColor),
}

export const manageStatic = {
	userStatic: async (searchCondition, startDate, endDate) =>
		await $api.get(SETTING.STATIC.USER, { params: { searchCondition, startDate, endDate } }),
	menuStatic: async (searchCondition, startDate, endDate) =>
		await $api.get(SETTING.STATIC.MENU, { params: { searchCondition, startDate, endDate } }),
	layerStatic: async (searchCondition, searchColumn, startDate, endDate) =>
		await $api.get(SETTING.STATIC.LAYER, { params: { searchCondition, searchColumn, startDate, endDate } }),

	userExcel: async (searchCondition, startDate, endDate) =>
		await $api.get(SETTING.STATIC.USER_EXCEL, {
			params: { searchCondition, startDate, endDate },
			responseType: 'blob',
		}),
	menuExcel: async (searchCondition, startDate, endDate) =>
		await $api.get(SETTING.STATIC.MENU_EXCEL, {
			params: { searchCondition, startDate, endDate },
			responseType: 'blob',
		}),
	layerExcel: async (searchCondition, searchColumn, startDate, endDate) =>
		await $api.get(SETTING.STATIC.LAYER_EXCEL, {
			params: { searchCondition, searchColumn, startDate, endDate },
			responseType: 'blob',
		}),
}

export const manageCascading = {
	cardList: async () => await $api.get(SETTING.CASCADING.CARD),
	cardDetailList: async (id) => await $api.get(SETTING.CASCADING.DETAIL.replace('{id}', id)),
	load: async (id) => await $api.get(SETTING.CASCADING.LOAD.replace('{id}', id)),
	refresh: async (id) => await $api.get(SETTING.CASCADING.REFRESH.replace('{id}', id)),
	refreshAll: async () => await $api.get(SETTING.CASCADING.REFRESH_ALL),
	getCasStatus: async (id) => await $api.get(SETTING.CASCADING.GET_STATUS.replace('{id}', id)),
}
