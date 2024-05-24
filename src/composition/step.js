/**
 * 단계 설정 composition
 * @param {*} array 데이터 배열
 * @param {*} option 옵션
 * @returns
 */
import { useColorStore } from '@/stores/color'

export default function useStep(array, option) {
	// color store
	const colorStore = useColorStore()

	const positiveR = [194, 253] // Min / Max
	const positiveG = [0, 192]
	const positiveB = [11, 73]

	const negativeR = [0, 221] // Min / Max
	const negativeG = [40, 233]
	const negativeB = [130, 255]

	let defalutOption = {
		property: 'value',
		steps: 7,
		useAbs: false, // 절대값여부. (변동률 같은 경우 -10이 9보다 크다.)
	}

	// property : Object에서 가져올 Key명.
	// steps : 범례 단계.
	// useAbs : 절대값여부. ex) abs(-10) = 10
	const { property, steps, useAbs } = Object.assign({}, defalutOption, option)

	const hasNegative = array.some((obj) => obj[property] < 0)
	/**
	 * 최소값, 최대값 계산 함수
	 * @param {*} objectArray
	 * @returns
	 */
	const getMinMax = (objectArray) => {
		function getPropertyValues() {
			if (useAbs) {
				return objectArray.map((obj) => Math.abs(obj[property])) // 절대값
			} else {
				return objectArray.map((obj) => obj[property])
			}
		}
		function getMinPropertyValue() {
			return Math.min(...getPropertyValues())
		}
		function getMaxPropertyValue() {
			return Math.max(...getPropertyValues())
		}
		return {
			min: getMinPropertyValue(),
			max: getMaxPropertyValue(),
		}
	}

	/**
	 * 범례 색상 Index
	 * @param {*} value
	 * @returns
	 */
	const getStep = (value) => {
		// 0 ~ 1 Normalize
		function clamp(value, low, high) {
			return Math.max(low, Math.min(value, high))
		}

		const { min, max } = getMinMax(array, property) // 최소값, 최대값 가져오기

		if (!hasNegative) {
			// 양수만일때
			const f = clamp((value - min) / (max - min), 0, 1)
			const result = Math.round(f * (steps - 1))
			return isNaN(result) ? 0 : result
		}

		// 음수 포함일때
		const minValues = colorStore.valueMins
		const maxValues = colorStore.valueMaxs
		let resultIndex = -1

		for (let i = 0; i < minValues.length; i++) {
			const min = minValues[i]
			const max = maxValues[i]
			if (value >= min && value < max) {
				resultIndex = i
				break
			}
		}

		if (resultIndex == -1 && hasNegative) {
			resultIndex = minValues.length - 1
		}

		return resultIndex
	}

	/**
	 * 범례 색상 및 범위 설정
	 * @returns
	 */
	const getLegend = () => {
		/**
		 * RGB(0~255) Normalize 함수
		 * @param {*} value
		 * @param {*} min
		 * @param {*} max
		 * @returns
		 */

		const getNearValueInArr = (value, arr, last) => {
			let result = 0

			for (let i = 0; i < arr.length; i++) {
				if (arr[i] < value) {
					result = arr[i == 0 ? 0 : i - 1]
					break
				}
			}
			if (result == 0) {
				if (value == 0) result = last
				else result = arr[arr.length - 1]
			}

			return result
		}

		const getNearIndexInArr = (value, arr, isPositive) => {
			let index = -1

			for (let i = 0; i < arr.length; i++) {
				if (arr[i] < value) {
					index = i == 0 ? 0 : i - 1
					break
				}
			}
			if (index <= 0) {
				if (value == 0) index = -99
				else index = isPositive ? 0 : arr.length - 1
			}

			return index
		}

		const normalize = (value, min, max) => {
			return ((value - min) / (max - min)) * 255
		}

		const normalizeBetweenTwoRanges = (val, minVal, maxVal, newMin, newMax) => {
			return newMin + ((val - minVal) * (newMax - newMin)) / (maxVal - minVal)
		}

		// Linear Interpolation
		const lerp = (x, y, a) => x * (1 - a) + y * a

		/**
		 * RGB 컬러 계산 함수
		 * @param {*} value
		 * @param {*} min
		 * @param {*} max
		 * @returns
		 */
		const getRgbColor = (value, min, max) => {
			//let normalizedValue = normalize(value, min, max)
			let normalizedValue = 0
			let rgba = null
			const colorOffset = 20

			if (value >= 0) {
				//양수
				normalizedValue = normalize(value, min, max)
				normalizedValue = normalizedValue < colorOffset ? colorOffset : normalizedValue

				let nearestR = lerp(positiveR[0], positiveR[1], normalizeBetweenTwoRanges(255 - normalizedValue, 0, 255, 0, 1))
				let nearestG = lerp(positiveG[0], positiveG[1], normalizeBetweenTwoRanges(255 - normalizedValue, 0, 255, 0, 1))
				let nearestB = lerp(positiveB[0], positiveB[1], normalizeBetweenTwoRanges(255 - normalizedValue, 0, 255, 0, 1))

				// RGB 색상 조합
				rgba = [nearestR, nearestG, nearestB]
			} else {
				//음수
				normalizedValue = normalize(Math.abs(value), min, max)
				normalizedValue = normalizedValue < colorOffset ? colorOffset : normalizedValue

				let test = normalizeBetweenTwoRanges(255 - normalizedValue, 0, 255, 0, 1)

				let nearestR = lerp(negativeR[0], negativeR[1], normalizeBetweenTwoRanges(255 - normalizedValue, 0, 255, 0, 1))
				let nearestG = lerp(negativeG[0], negativeG[1], normalizeBetweenTwoRanges(255 - normalizedValue, 0, 255, 0, 1))
				let nearestB = lerp(negativeB[0], negativeB[1], normalizeBetweenTwoRanges(255 - normalizedValue, 0, 255, 0, 1))

				// RGB 색상 조합
				rgba = [nearestR, nearestG, nearestB]
			}

			return 'rgba(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ')'
		}

		/**
		 * 1. 음수, 양수 범위 비율 및 갯수를 계산
		 * 2. 각 단계의 범위 입력
		 * 3. 조합한 RGB 색상을 colorStore에 저장
		 * @param {*} min
		 * @param {*} max
		 * @returns
		 */
		function splitRange(min, max) {
			const intervals = []
			const rgbList = []
			const startValues = []
			const endValues = []
			const sample = ''

			const intervalSize = Math.abs(
				min > 0 ? (max - min) / steps : max < 0 ? (Math.abs(max) - Math.abs(min)) / steps : (max - min) / steps
			)

			// 음수, 양수 범위 비율 계산
			const negativeRange = Math.abs(min < 0 ? min : 0) // 음수 범위
			const positiveRange = max > 0 ? max : 0 // 양수 범위
			const totalRange = negativeRange + positiveRange //전체 범위

			const negativePrevSteps = Math.round((negativeRange / totalRange) * steps) || 0 //음수
			const negativeSteps = negativePrevSteps == 0 && negativeRange > 0 ? 1 : negativePrevSteps
			const positiveSteps = negativeSteps == steps && positiveRange > 0 ? 1 : steps - negativeSteps //양수

			// 음수값 존재 유무
			if (!hasNegative) {
				for (let i = 0; i < steps; i++) {
					const start = min + i * intervalSize
					const end = start + intervalSize

					// 소수 둘째자리까지 보여주기 위함
					const roundedStart = parseFloat(start.toFixed(2))
					const roundedEnd = parseFloat(end.toFixed(2))

					intervals.push(`${roundedStart} ~ ${roundedEnd}`)
					startValues.push(roundedStart)
					endValues.push(roundedEnd)
				}
			} else {
				// 음수 범위 계산 및 RGB 색상 리스트 입력
				for (let i = 0; i < negativeSteps; i++) {
					const start = min + i * intervalSize
					const endX2 = start + intervalSize * 2
					const end = endX2 > 0 ? 0 : start + intervalSize
					intervals.push(`${start.toFixed(2)} ~ ${end.toFixed(2)}`)
					const rgba = getRgbColor(start, 0, negativeSteps > positiveSteps ? Math.abs(min) : Math.abs(max))
					rgbList.push(rgba)
					startValues.push(start)
					endValues.push(end)
				}

				// 양수 범위 계산 및 RGB 색상 리스트 입력
				for (let i = 0; i < positiveSteps; i++) {
					let start = i * intervalSize
					const end = start + intervalSize
					intervals.push(`${start.toFixed(2)} ~ ${end.toFixed(2)}`)
					const rgba = getRgbColor(end, 0, negativeSteps > positiveSteps ? Math.abs(min) : Math.abs(max))
					rgbList.push(rgba)
					startValues.push(start)
					endValues.push(end)
				}

				colorStore.colors = rgbList // colorStore에 RGB 색상 리스트 저장
			}
			colorStore.valueMins = startValues
			colorStore.valueMaxs = endValues

			return intervals
		}

		const { min, max } = getMinMax(array, property) // 최소값, 최대값 가져오기
		return splitRange(min, max) // 결과 리턴
	}

	return {
		getStep,
		getLegend,
	}
}
