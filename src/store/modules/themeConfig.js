const themeConfigModule = {
	namespaced: true,
	state: {
		themeConfig: {
			isDrawer: false, // 开启布局配置抽屉

			// ----------------      全局主题       -----------------
			primary: '#409eff', // 默认 primary 主题颜色
			isIsDark: false, // 是否开启深色模式

			// ----------------      全局网站标题 / 副标题       -----------------
			globalTitle: 'vue-admin', // 网站主标题
			globalViceTitle: '前端小菜鸟', // 网站副标题
			globalViceDes: '后台管理系统', // 网站描述
			globalI18n: 'zh-cn', // 默认初始语言，可选值"<zh-cn|en|zh-tw>"，默认 zh-cn
			globalComponentSize: '', // 默认全局组件大小，可选值"<|medium|small|mini>"，默认 ''

			// ----------------      界面设置       -----------------
			isCollapse: false, // 是否开启菜单水平折叠效果
			isFixedHeader: false, // 是否开启固定 Header
			isUniqueOpened: false, // 是否开启菜单手风琴效果
			layout: 'defaults', // 布局切换：可选值"<defaults|classic|transverse|columns>"，默认 defaults

			// ----------------      界面显示       -----------------
			isShowLogo: true, // 是否开启侧边栏 Logo

			isBreadcrumb: true, // 是否开启 Breadcrumb
			isBreadcrumbIcon: true, // 是否开启 Breadcrumb 图标
			isTagsview: true, // 是否开启 Tagsview
			isTagsviewIcon: true, // 是否开启 Tagsview 图标
			isCacheTagsView: false, // 是否开启 TagsView 缓存
			isInvert: false, // 是否开启色弱模式
			isGrayscale: false, // 是否开启灰色模式
			isFooter: false, // 是否开启 Footer 底部版权信息

			// ----------------      其他设置       -----------------
			tagsStyle: 'tags-style-one',
			animation: 'slide-right', // 主页面切换动画 可选值"<slide-right|slide-left|opacitys>"，默认 slide-right
			columnsAsideStyle: 'columns-round', //分栏高亮 可选值"<columns-round|columns-card>"，默认 columns-round
			columnsAsideLayout: 'columns-vertical', // 分栏布局风格：可选值"<columns-horizontal|columns-vertical>"，默认 columns-horizontal
		},
	},
	mutations: {
		// 设置布局配置
		getThemeConfig(state, data) {
			state.themeConfig = data;
		},
	},
	actions: {
		// 设置布局配置
		setThemeConfig({ commit }, data) {
			commit('getThemeConfig', data);
		},
	},
};

export default themeConfigModule;
