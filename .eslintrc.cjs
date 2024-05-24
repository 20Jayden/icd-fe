/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	'extends': [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/eslint-config-prettier/skip-formatting',
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				semi: false,
				useTabs: true,
				tabWidth: 2,
				trailingComma: 'es5',
				printWidth: 100,
				proseWrap: 'preserve',
				bracketSpacing: true,
				arrowParens: 'always',
				endOfLine: 'auto',
				quoteProps: 'preserve',
			},
		],
		'vue/multi-word-component-names': 'off',
		'vue/v-on-event-hyphenation': 'off',
		'vue/attribute-hyphenation': 'off',
		'vue/no-reserved-component-names': 'off',
		'no-unused-vars': 'off',
		'no-undef': 'off',
	},
}
