import axios, { HttpStatusCode } from 'axios'
import { parse, stringify } from 'qs'
import { SERVER_URL, AUTH } from './api.url'
import { useModalStore } from '@/stores/modal'
import { useAreaStore } from '@/stores/area'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'

const modalStore = useModalStore()
const areaStore = useAreaStore()
const log = useLog()

export const $api = (() => {
	const instance = axios.create({
		timeout: 29000,
		baseURL: SERVER_URL,
		withCredentials: true,
		paramsSerializer: {
			encode: parse,
			serialize: (params) => {
				// sort property 가공
				if (params.sort) {
					// camelCase to snake_case
					// params.sort = params.sort.map((str) => {
					// 	let [property, direction] = str.split(',')
					// 	property = property.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
					// 	return property + ',' + direction
					// })
				}
				return stringify(params, { arrayFormat: 'repeat' })
			},
		},
	})

	const isLoginRequest = (requestUrl) => {
		return [AUTH.LOGIN_REFRESH, AUTH.LOGIN].includes(requestUrl)
	}

	/**
	 * request interceptor
	 */
	instance.interceptors.request.use(
		(config) => {
			if (!isLoginRequest(config.url)) {
				// TODO: 로그인 완성 후, 토큰 삽입
				config.headers['Authorization'] = `Bearer ${localStorage.getItem('spta-t')}`
			}
			return config
		},
		(error) => {
			console.error('REQUEST-ERROR', error)
			return Promise.reject(error)
		}
	)

	/**
	 * response interceptor
	 */
	instance.interceptors.response.use(
		(response) => {
			const resolve = {
				data: response.data,
				status: {
					code: response.status,
					text: response.statusText,
				},
			}
			console.debug('SUCCESS', resolve)

			// console.groupEnd('API REQUEST')
			return resolve
		},
		async (error) => {
			if (error.code === 'ECONNABORTED') {
				modalStore.showAlert('많은 데이터로 인하여 처리시간이 초과되었습니다. 다시 시도해 주십시오.')
				areaStore.setLoadingStat(false)
				return Promise.reject(error)
			}
			const { data, status, statusText, config } = error.response

			if (status === HttpStatusCode.Unauthorized) {
				modalStore.showAlert('세션이 종료되었습니다.\n로그인페이지로 돌아갑니다.', () => {
					// localStorage.removeItem('spta-t')
					location.href = '/login'
				})
			}

			const resolve = {
				data: data,
				status: {
					code: status,
					text: statusText,
				},
			}

			console.log('error', resolve)

			// 공통 에러 메세지 처리, 메세지가 있는경우 출력
			if (data.message && config.url !== AUTH.LOGIN_REFRESH) {
				modalStore.showAlert(data.message)
			}

			// api에서 catch를 쓸거면 reject, 아니면 resolve
			// console.groupEnd('API REQUEST')
			return Promise.resolve(resolve)
		}
	)

	return instance
})()

export const $kakao = (() => {
	return axios.create({
		baseURL: 'https://dapi.kakao.com',
		headers: { Authorization: 'KakaoAK ' + import.meta.env.VITE_KAKAO_API_KEY },
	})
})()
