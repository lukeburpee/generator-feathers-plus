module.exports = {
	uiTypes: [
		{ name: 'Basic', value: 'basic' },
		{ name: 'Angular', value: 'angular' },
		{ name: 'React', value: 'react' },
		{ name: 'Vue', value: 'vue' }
	],
	reactFrameworks: [
		{ name: 'Gatsby.js', value: 'gatsby' },
		{ name: 'Next.js', value: 'next' }
	],
	vueFrameworks = [
		{ name: 'Nuxt.js', value: 'nuxt' },
		{ name: 'Quasar.js', value: 'quasar' }
	],
	uiFrameworks: function (uiType) {
		const common = [{ name: 'None', value: 'none' }];
		switch (uiType) {
			case 'react':
				return reactFrameworks.concat(common);
			case 'vue':
				return vueFrameworks.concat(common);
			default:
				return common;
		};
	}
};