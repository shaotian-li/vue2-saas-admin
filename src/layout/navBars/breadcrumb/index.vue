<template>
	<div class="layout-navbars-breadcrumb-index">
		<logo v-if="setIsShowLogo" />
		<breadcrumb />
		<horizontal :menuList="menuList" v-if="isLayoutTransverse" />
		<user />
	</div>
</template>

<script>
import Logo from '../../logo.vue';
import Breadcrumb from './breadcrumb.vue';
import User from './user.vue';
import Horizontal from '../../navMenu/horizontal.vue';
import { mapState } from 'vuex';
export default {
	name: 'BreadcrumbIndex',
	components: {
		Logo,
		Breadcrumb,
		User,
		Horizontal,
	},
	data() {
		return {
			menuList: [],
		};
	},
	computed: {
		...mapState(['themeConfig']),
		// 设置 logo是否显示
		setIsShowLogo() {
			let { isShowLogo, layout } = this.themeConfig.themeConfig;
			return (isShowLogo && layout === 'classic') || (isShowLogo && layout === 'transverse');
		},
		// 设置是否显示横向菜单
		isLayoutTransverse() {
			let { layout, isClassicSplitMenu } = this.themeConfig.themeConfig;
			return layout === 'transverse' || (isClassicSplitMenu && layout === 'classic');
		},
	},
	mounted() {
		this.setFilterRoutes();
	},
	methods: {
		// 设置路由的过滤
		setFilterRoutes() {
			this.menuList = this.filterRoutesFun(this.$store.state.routesList.routesList);
			console.log(this.menuList, 'meon');
		},
		// 设置路由的过滤递归函数
		filterRoutesFun(arr) {
			return arr
				.filter((item) => !item.meta.isHide)
				.map((item) => {
					item = Object.assign({}, item);
					if (item.children) item.children = this.filterRoutesFun(item.children);
					return item;
				});
		},
	},
	watch: {
		// 监听 vuex 数据变化
		'$store.state': {
			handler(val) {
				if (val.routesList.routesList.length === this.menuList.length) return false;
				this.setFilterRoutes();
			},
			deep: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.layout-navbars-breadcrumb-index {
	height: 50px;
	display: flex;
	align-items: center;
	padding-right: 15px;
	overflow: hidden;
	background: var(--prev-bg-topBar);
	border-bottom: 1px solid var(--prev-border-color-lighter);
}
</style>
