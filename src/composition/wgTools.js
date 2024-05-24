import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
const log = useLog()
const wgTools = {
	fitAnim: (targetObj, baseSize = WGMap.getSize(), duration = 500) => {
		WGMap.getView().fit(targetObj, {
			size: baseSize,
			padding: [0, 0, 0, 0],
			duration: duration,
			maxZoom: 18,
		})
	},
	fitAnimZoom: (targetObj, zoom, duration, baseSize = WGMap.getSize()) => {
		WGMap.getView().fit(targetObj, {
			size: baseSize,
			padding: [0, 0, 0, 0],
			duration: duration,
			zoom: zoom,
			maxZoom: 18
		})
	},
}

export default wgTools