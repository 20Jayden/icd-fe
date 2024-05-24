const API_CONTEXT = 'api'
const API_VERSION = 'v1'

export const SERVER_URL = `/${API_CONTEXT}/${API_VERSION}`

// 공통
export const CMMN = {
	OPTIONS: {
		SGG: '/options/sgg',
		UMD: '/options/sgg/{sggCd}/umd',
		RTMS_CODE: '/options/rtms-codes/{code}',
		KAB_BLDB_MUSE: '/options/kab-bldg-muse',
		RENT_KAB_BLDB_MUSE: '/options/rent-codes/kab-bldg-muse',
		RENT_PLCY_BLDB_MUSE: '/options/rent-codes/plcy-bldg-muse',
		TASK_TKCG: '/options/task-tkcg',
		LAYER_AUTH_GROUP: '/options/layer_auth_group',
		USER_AUTH_GROUP: '/options/user_auth_group',
	},
}

export const AUTH = {
	LOGIN: '/auth/login',
	LOGIN_REFRESH: '/auth/login/refresh',
	LOGIN_INFO: '/auth/login/info',
	SIGNUP: '/auth/signup',
	SIGNUP_ID_CHECK: '/auth/signup/duplcate',
	// IS3DAUTH: '/auth/dimension',
	// DATABOARD_AUTH: '/auth/databoard',
}

// 위치
export const LOCATION = {
	CENTER: {
		ADDRESS: '/location/center',
		SGG: '/location/center/sgg/{sggCd}',
		UMD: '/location/center/umd/{umdCd}',
	},
}

// 로그인한 사용자 정보
export const USERINFO = {
	LOGIN_USER_INFO: '/login-user/user-info/{id}',
	UPDATE_PASSWORD: '/login-user/update/user-info',
}
// 모니터링
export const MONITOR = {
	// 메인 하단 목록
	LIST: {
		PLCY: '/monitors/{stand-date}',
		GEOMETRY: '/monitors/geometry-list',
	},
	DATE: {
		KAB_LATEST: '/dashboard/latest/kabInsDt',
		KAB_TRADE_LATEST: '/dashboard/latest/kabTradeInsDt',
	},
	// 메인 하단 선택
	GEOMETRY: '/monitors/geometry/{pnu}',
	// 실거래 모니터링
	RTMS: {
		LIST: '/monitoring/rtms', // 실거래 모니터링 목록
		SUMMARY: '/monitoring/rtms/summary', // 실거래 모니터링 요약 목록
		SUMMARY_DETAIL: '/monitoring/rtms/summary/{pnu}',
	},
	// 아파트 모니터링
	APT: {
		LIST: '/monitoring/apt', // 좌측 리스트 조회
		SUMMARY: '/monitoring/apt/summary', // 지도의 CIRCLE 요약정보 조회
		SUMMARY_DETAIL: '/monitoring/apt/summary/{pnu}', // PNU단위 요약정보의 상세정보 팝업 조회
		SUMMARY_DEALS: '/monitoring/apt/summary/deals', // CIRCLE에서 임계치 레벨 클릭시 좌측 리스트 조회
		SUMMARY_DEALS_EXCEL: '/monitoring/apt/summary/deals/excel', // CIRCLE에서 임계치 레벨 클릭시 좌측 리스트 엑셀다운로드
		SUMMARY_DEALS_COORD: '/monitoring/apt/summary/deals/coord-count', // CIRCLE에서 임계치 레벨 클릭시 임계치 거래 위치 및 건수 조회
	},
	RENT: {
		LIST: '/monitoring/rent',
		SUMMARY: '/monitoring/rent/summary',
		SUMMARY_DETAIL: '/monitoring/rent/summary/{pnu}',
	},
	MARKET: {
		LIST: '/monitoring/market',
		SUMMARY: '/monitoring/market/summary',
		SUMMARY_DETAIL: '/monitoring/market/summary/{pnu}',
		SUMMARY_DETAIL_STAT: '/monitoring/market/summary/stat/{pnu}',
	},
	EMAIL: {
		SEND: '/send-mail/email',
		UPDATE: '/send-mail/update/{userId}',
	},
}

// 검색
export const SEARCH = {
	// ADDRESS: ..
	// BUILDING: ..
	DEAL: {
		LIST: {
			KAB: '/search/trades/kab',
			PLCY: '/search/trades/plcy',
		},
		INFO: {
			KAB: '/search/trades/kab/info',
			PLCY: '/search/trades/plcy/info',
		},
	},
}

// 주택동향
export const HOUSETREND = {
	// 현황
	PRICE_RATE: '/house-trend/price-rate', // 가격변동률
	PRICE_INDEX: '/house-trend/price-index', // 가격지수
	RTMS_PRICE_RATE: '/house-trend/rtms-price-rate', // 실거래 가격변동률
	RTMS_PRICE_INDEX: '/house-trend/rtms-price-index', // 실거래 가격지수
	APT_PRICE_RATE: '/house-trend/apt-price-rate', // 아파트 가격변동률
	RBLD_APT_PRICE_RATE: '/house-trend/rbld-apt-price-rate', // 재건축vs아파트 가격변동률
	// 서울수도권 요약
	PRICE_RATE_SUMMARY: '/house-trend/price-rate-summary', // 가격변동률 요약 (서울수도권)
	PRICE_INDEX_SUMMARY: '/house-trend/price-index-summary', // 가격지수 요약 (서울수도권)
	RTMS_PRICE_RATE_SUMMARY: '/house-trend/rtms-price-rate-summary', // 실거래 가격변동률 요약 (서울수도권)
	RTMS_PRICE_INDEX_SUMMARY: '/house-trend/rtms-price-index-summary', // 실거래 가격지수 요약 (서울수도권)
	APT_PRICE_RATE_SUMMARY: '/house-trend/apt-price-rate-summary', // 아파트 가격변동률 요약 (서울수도권)
	RBLD_APT_PRICE_RATE_SUMMARY: '/house-trend/rbld-apt-price-rate-summary', // 재건축vs아파트 가격변동률 요약 (서울수도권)
	// 시계열
	TMLN_PRICE_RATE: '/house-trend/timeline/price-rate', // 시계열 가격변동률
	TMLN_PRICE_RATE_CMPR: '/house-trend/timeline/price-rate-compare', // 시계열 가격변동률(가격지수)비교 추이
	TMLN_RTMS_PRICE_RATE: '/house-trend/timeline/rtms-price-rate', // 시계열 실거래 가격변동률
	TMLN_RTMS_PRICE_RATE_CMPR: '/house-trend/timeline/rtms-price-rate-compare', // 시계열 실거래 가격변동률(가격지수)비교 추이
	TMLN_APT_PRICE_RATE: '/house-trend/timeline/apt-price-rate', // 시계열 아파트 가격변동률 추이
	TMLN_RBLD_APT_PRICE_RATE: '/house-trend/timeline/rbld-apt-price-rate', // 시계열 재건축vs아파트 가격변동률 추이
}

// 실거래부동산 동향
export const RTMSTREND = {
	RTMS_PRICE_RATE: '/rtms-trend/rtms-price-rate', // 가격변동률
	RTMS_TRADE_RATE: '/rtms-trend/rtms-trade-rate', // 거래량변동률
	LAW_AUCN_INFO: '/rtms-trend/law-auction', // 법원경매정보
	TMLN_RTMS_PRICE_RATE: '/rtms-trend/timeline/rtms-price-rate', // 시계열 가격변동률 추이
	TMLN_RTMS_TRADE_RATE: '/rtms-trend/timeline/rtms-trade-rate', // 시계열 거래량변동률 추이
	TMLN_LAW_AUCN: '/rtms-trend/timeline/law-auction', // 시계열 법원 경매정보 추이
	RTMS_TYPE_RATE: '/rtms-trend/rtms-type-rate', // 유형별 거래량
}

// 임의영역추출
export const SELECTION = {
	POLYGON: 'selection/polygon',
	DOWNLOAD: 'selection/excel/pnu',
	PUBLIC: 'selection/public/polygon',
}

// 레이어
export const LAYER = {
	LIST: '/layers',
}

export const MARK = {
	BOOKMARK: {
		LIST: '/bookmark',
		DETAIL: '/bookmark/{bookmarkId}',
		SORT: '/bookmark/sort',
	},
	PINMARKER: {
		LIST: '/pinmarker',
		DETAIL: '/pinmarker/{pinMarkerId}',
		SAVE: '/pinmarker',
		REMOVE: '/pinmarker/{pinMarkerId}',
	},
}

// 토지동향
export const LANDTREND = {
	PRICE_RATE: '/land-trend/price-rate', // 지가변동률
	DEAL_INDEX: '/land-trend/deal-index', // 거래현황
	PRICE_RATE_SUMMARY: '/land-trend/price-rate-summary', // 가격변동률 요약 (서울수도권)
	TMLN_PRICE_RATE: '/land-trend/timeline/price-rate', // 시계열 가격(지가)변동률
	TMLN_PRICE_INDEX: '/land-trend/timeline/price-index', // 시계열 가격(지가)변동률 지수
	TMLN_DEAL_INDEX: '/land-trend/timeline/deal-index', // 지역별 토지, 건축물 거래
}

// 허가구역
export const MANAGEAREA = {
	AREA: '/area', //허가구역 그룹
	SGG: '/area/sgg',
	CENTER: '/area/center',
	AREA_SEARCH: '/area/stat/group',
	GEOMETRY: '/area/group-geometry/{groupCd}',
	GROUP_CENTER: '/area/group-center',
	GROUP_STAT: '/area/stat', // 단일그룹에 대한 통계 자료
	GROUP_FEATURE: '/area/group/feature/info', // 단일그룹 내의 필지 리스트
	CADA_FEATURE: '/area/group/feature/cada-info', // 허가구역 포함 지적도
	CADA_DETAIL_EXCEL: '/area/group/feature/cada-info/excel', // 허가구역 포함 지적도 엑셀 다운로드
	GROUP_DETAIL: '/area/group/detail/info/{groupCd}', // 단일 허가그룹 그룹에 대한 상세 정보
	GROUP_DETAIL_EXCEL: '/area/group/detail/excel',
	BIZ_DETAIL_EXCEL: '/area/biz/detail/excel',
	PNU_DETAIL_EXCEL: '/area/pnu/detail/excel',
	PNU_DETAIL_EXCEL_SECTION: '/area/pnu/detail/excel/section',
	AREA_ANALYSIS: 'area/analysis',
	AREA_ANALYSIS_SECTION: 'area/analysis/section',
	AREA_SELECTED_FEATURE: 'area/selected/features',
	AREA_SELECTED_FEATURE_SECTION: 'area/selected/features/section',
	TRADE_LIST: '/area/trade',
	TRADE_LIST_SECTION: '/area/trade/section',
	TRADE_EXCEL: '/area/trade/excel',
	TRADE_EXCEL_SECTION: '/area/trade/excel/section',
	AREA_TRADE: '/area/areaTrade',
	AREA_TRADE_EXCEL: '/area/areaTrade/excel',
	AREA_STATISTICS_EXCEL: 'area/statistics/excel/section',
	STATISTICS_EXCEL: '/area/statistics/excel',
}

// 세팅
export const SETTING = {
	LAYER_AUTH: {
		LIST: '/settings/layer-auth/group',
		ROLE_LIST: '/settings/layer-auth/role',
		ADD_GROUP: '/settings/layer-auth/add-group',
		DELETE_GROUP: '/settings/layer-auth/delete-group',
		GROUP_ROLE: '/settings/layer-auth/group-role',
		MOD_GROUP: '/settings/layer-auth/mod-group',
		GET_USER_LAYER: '/settings/layer-auth/user-layer',
		GET_GROUP_ID: '/settings/layer-auth/group-id',
	},
	MANAGEUSER: {
		LIST: '/settings/manage-user/users',
		DETAIL: '/settings/manage-user/user-detail/{id}',
		UPDATE_USER_APPROVE: '/settings/manage-user/user-all-approve/{id}',
		USER_INFO: '/settings/manage-user/user-info',
		USER_AUTH_INSERT: '/settings/manage-user/user-info/user-role-group-insert',
		USER_AUTH_UPDATE: '/settings//manage-user/user-info/user-role-group-update',
		REGISTER_USER_ID_CHECK: '/settings/manage-user/manage-user-register/duplicate',
		USER_AUTH_ID_CHECK: '/settings/manage-user/user-info/user-auth/duplicate',
		LAYER_AUTH_INSERT: '/settings/manage-user/user-info/layer-auth-insert',
		LAYER_AUTH_UPDATE: '/settings/manage-user/user-info/layer-auth-update',
		LAYER_AUTH_ID_CHECK: '/settings/manage-user/user-info/layer-auth/duplicate',
		USER_REGISTER: '/settings/manage-user/user-info/user-register',
		USER_EMAIL_RECEPTION: '/settings/manage-user/user-info/email-reception',
		UPDATE_PASSWORD: '/settings/manage-user/user-info/update-user-password',
		DELETE_USER_ROLE_GROUP: '/settings/manage-user/user-info/user-role-group-delete/{userId}',
		DELETE_LAYER_ROLE_GROUP: '/settings/manage-user/user-info/user-layer-group-delete/{userId}',
		DOWNLOAD_FILE: '/settings/manage-user/user-info/download/{id}',
		DELETE_FILE: '/settings/manage-user/user-info/delete-file/{id}',
	},
	AUTH_GROUP: {
		GROUP_LIST: '/settings/auth-group',
		GROUP_ROLE: '/settings/auth-group/{roleGroupId}',
		ROLE_LIST: '/settings/auth-role',
		DELETE_GROUP: '/settings/auth-group/delete',
		ADD_GROUP: '/settings/auth-group/add',
		MODIFY_GROUP: '/settings/auth-group/modify',
		MENU_AUTH: '/settings/menu-auth/{userId}',
	},
	LOG: {
		LIST: '/settings/log/log',
		EXCEL: '/settings/log/excel',
		LINKLIST: '/settings/log/linkLog',
		LINKEXCEL: '/settings/log/linkExcel',
	},
	COLOR: {
		LIST: '/settings/manage-color',
		UPDATE_COLOR: '/settings/manage-color-update',
		// UPDATE_COLOR: '/settings//manage-color/color-update/{colorSn}',
	},
	STATIC: {
		USER: '/settings/static/user',
		MENU: '/settings/static/menu',
		LAYER: '/settings/static/layer',
		USER_EXCEL: '/settings/static/user/excel',
		MENU_EXCEL: '/settings/static/menu/excel',
		LAYER_EXCEL: '/settings/static/layer/excel',
	},
	CASCADING: {
		CARD: '/settings/cascading/card',
		DETAIL: '/settings/cascading/card/detail/{id}',
		LOAD: '/settings/cascading/load/{id}',
		REFRESH: '/settings/cascading/refresh/{id}',
		REFRESH_ALL: '/settings/cascading/refreshAll',
		GET_STATUS: '/settings/cascading/get-status/{id}',
	},
}

//로그데이터 쌓기
export const LOGTABLE = {
	LOG_TABLE: {
		REGIST: {
			LOGDATA: '/log/log',
			noTokenDATA: '/log/nLog',
		},
	},
}

export const NOTICE = {
	INFO: '/notice',
	INSEART: '/notice/insert',
	UPDATE: '/notice/update/{id}',
	DELETE: '/notice/delete/{id}',
	LIST: '/notice/noticeList',
	DELETECHECK: '/notice/checkNotice/{id}',
}

export default {
	CMMN,
}

// export default {
// 	CMMN,
// }
