import { defineStore } from 'pinia'

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useModalStore = defineStore({
	id: 'modal',
	state: () => ({
		alert: {
			title: '확인',
			contents: '저장되었습니다.',
			confirm: '확인',
			onConfirm: () => {},
		},
		confirm: {
			title: '확인',
			contents: '저장하시겠습니까',
			confirm: '확인',
			cancel: '취소',
			onConfirm: () => {},
			onCancel: () => {},
		},
	}),
	actions: {
		showAlert(param, confirmCallback) {
			if (typeof param === 'string') {
				this.alert.contents = param
			} else {
				Object.assign(this.alert, param)
			}

			if (confirmCallback) {
				this.alert.onConfirm = confirmCallback
			}
			$('#modal-alert').show()
		},
		showConfirm(param, confirmCallback, cancelCallback) {
			if (typeof param === 'string') {
				this.confirm.contents = param
			} else {
				Object.assign(this.confirm, param)
			}

			if (confirmCallback) {
				this.confirm.onConfirm = confirmCallback
			}
			if (cancelCallback) {
				this.confirm.onCancel = cancelCallback
			}
			$('#modal-confirm').show()
		},
		showToast(status, message) {
			switch (status) {
				case 'info':
					toast.info(message, {
						theme: toast.THEME.COLORED,
						position: toast.POSITION.BOTTOM_RIGHT,
					})
					break
				case 'error':
					toast.error(message, {
						theme: toast.THEME.COLORED,
						position: toast.POSITION.BOTTOM_RIGHT,
					})
					break
				case 'warning':
					toast.warn(message, {
						theme: toast.THEME.COLORED,
						position: toast.POSITION.BOTTOM_RIGHT,
					})
					break
				case 'success':
					toast.success(message, {
						theme: toast.THEME.COLORED,
						position: toast.POSITION.BOTTOM_RIGHT,
					})
					break
			}
		},
	},
})
