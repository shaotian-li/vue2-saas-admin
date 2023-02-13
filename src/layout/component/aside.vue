<template>
	<el-aside class="layout-aside" :class="setCollapseWidth" v-if="clientWidth > 1000">
		<Logo v-if="setShowLogo" />
		<el-scrollbar class="flex-auto">
			<Vertical :menuList="menuList" :class="setCollapseWidth" />
		</el-scrollbar>
	</el-aside>
	<el-drawer
		v-else
		:visible.sync="themeConfig.themeConfig.isCollapse"
		:with-header="false"
		direction="ltr"
		size="220px"
	>
		<el-aside class="layout-aside w100 h100">
			<Logo v-if="setShowLogo" />
			<el-scrollbar class="flex-auto" ref="layoutAsideRef">
				<Vertical :menuList="menuList" />
			</el-scrollbar>
		</el-aside>
	</el-drawer>
</template>

<script>
import { mapState } from 'vuex';
import Vertical from '../navMenu/vertical.vue';
import Logo from '../logo.vue';
export default {
	name: 'CommonAside',
	data() {
		return {
			menuList: [],
			clientWidth: '',
		};
	},
	components: {
		Logo,
		Vertical,
	},
	computed: {
		// 设置 logo是否现实
		setShowLogo() {
			const { layout, isShowLogo } = this.themeConfig.themeConfig;
			return (isShowLogo && layout === 'defaults') || (isShowLogo && layout === 'columns');
		},
		// 获取布局配置信息
		...mapState(['themeConfig', 'routesList']),
		// 设置左侧菜单的具体宽度
		setCollapseWidth() {
			let asideBrColor = '';
			const { layout, isCollapse } = this.themeConfig.themeConfig;
			if (layout === 'columns') {
				if (isCollapse) {
					return ['layout-aside-width64', asideBrColor];
				} else {
					return ['layout-aside-width-default', asideBrColor];
				}
			} else {
				if (isCollapse) {
					return ['layout-aside-width64', asideBrColor];
				} else {
					return ['layout-aside-width-default', asideBrColor];
				}
			}
		},
	},
	created() {
		this.initMenuFixed(document.body.clientWidth);
		this.setFilterRoutes();
		this.bus.$on('layoutMobileResize', (res) => {
			this.initMenuFixed(res.clientWidth);
		});
		this.bus.$on('setSendColumnsChildren', (res) => {
			this.menuList = res.children;
		});
		// 菜单滚动条监听
		this.bus.$on('updateElScrollBar', () => {
			setTimeout(() => {
				this.$refs.layoutAsideRef.update();
			}, 300);
		});
	},
	methods: {
		// 设置/过滤路由（非静态路由/是否显示在菜单中）
		setFilterRoutes() {
			if (this.themeConfig.themeConfig.layout === 'columns') return false;
			this.menuList = this.filterRoutesFun(this.routesList.routesList);
		},
		// 过滤路由 递归函数
		filterRoutesFun(arr) {
			return arr
				.filter((item) => !item.meta.isHide)
				.map((item) => {
					item = Object.assign({}, item);
					if (item.children) item.children = this.filterRoutesFun(item.children);
					return item;
				});
		},

		// 设置菜单导航是否固定（移动端）
		initMenuFixed(clientWidth) {
			this.clientWidth = clientWidth;
		},
	},
	// 页面销毁时
	destroyed() {
		// 取消菜单滚动条监听
		this.bus.$off('updateElScrollBar', () => {});
	},
};
</script>

<style></style>
