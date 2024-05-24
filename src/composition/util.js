export const useUtil = () => {
	/**
	 * 숫자단위를 한글로 표현 (일억구천만 X, 1억9000만 O)
	 * @param {*} number
	 * @returns
	 */
	const numberToKorean = (number) => {
		const inputNumber = number < 0 ? false : number
		const unitWords = ['', '만', '억', '조', '경']
		const splitUnit = 10000
		const splitCount = unitWords.length
		let resultArray = []
		let resultString = ''

		for (let i = 0; i < splitCount; i++) {
			var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i)
			unitResult = Math.floor(unitResult)
			if (unitResult > 0) {
				resultArray[i] = unitResult
			}
		}

		for (let i = 0; i < resultArray.length; i++) {
			if (!resultArray[i]) continue
			resultString = String(resultArray[i]) + unitWords[i] + resultString
		}

		return resultString || 0
	}

	return {
		numberToKorean,
	}
}

export default useUtil
