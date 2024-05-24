import { $api } from './api.config'
import { LAYER } from './api.url.js'

export default {
	listLayer: async () => await $api.get(LAYER.LIST),
}
