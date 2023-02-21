<template>
	<div id="app">
		<router-view />
		<setings ref="setingsRef" />
	</div>
</template>

<script>
import setIntroduction from '@/utils/setIconfont.js';
import Setings from '@/layout/navBars/breadcrumb/setings.vue';
import { Local } from '@/utils/storage.js';
import { mapState, mapActions } from 'vuex';
export default {
	name: 'App',

	components: {
		Setings,
	},
	computed: {
		...mapState(['themeConfig']),
	},

	mounted() {
		this.initSetIconfont();
		this.openSetingsDrawer();
		this.getLayoutThemeConfig();
	},

	methods: {
		...mapActions({
			setThemeConfig: 'themeConfig/setThemeConfig',
		}),
		// 设置初始化，防止刷新时恢复默认
		initSetIconfont() {
			// 设置批量第三方 icon 图标
			setIntroduction.cssCdn();
			// 设置批量第三方 js
			setIntroduction.jsCdn();
		},
		// 布局配置弹窗
		openSetingsDrawer() {
			this.bus.$on('openSetingsDrawer', () => {
				this.$refs.setingsRef.openDrawer();
			});
		},
		// 获取缓存中的布局配置
		getLayoutThemeConfig() {
			if (Local.get('themeConfigPrev')) {
				this.setThemeConfig(Local.get('themeConfigPrev'));
				document.documentElement.style.cssText = Local.get('themeConfigStyle');
			} else {
				Local.set('themeConfigPrev', this.themeConfig.themeConfig);
			}
		},
	},
	watch: {
		// 监听路由的变化
		$route: {
			handler(to) {
				this.$nextTick(() => {
					let webTitle = '';
					const { globalTitle } = this.themeConfig.themeConfig;
					to.path === '/login' ? (webTitle = to.meta.title) : (webTitle = this.$t(to.meta.title));
					document.title = `${webTitle} - ${globalTitle}` || globalTitle;
				});
			},
			deep: true,
			immediate: true,
		},
	},
	destroyed() {
		this.bus.$off('openSetingsDrawer');
	},
};
</script>

<style></style>
