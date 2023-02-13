<template>
	<div class="layout-navbars-breadcrumb" :style="{ display: isShowBreadcrumb }">
		<i
			class="layout-navbars-breadcrumb-icon"
			:class="themeConfig.themeConfig.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
			@click="onThemeConfigChange"
		></i>

		<el-breadcrumb class="layout-navbars-breadcrumb-hide">
			<transition-group name="breadcrumb" mode="out-in">
				<el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
					<span v-if="index === breadcrumbList.length - 1" class="layout-navbars-breadcrumb-span">
						<i
							:class="item.meta.icon"
							class="layout-navbars-breadcrumb-iconfont"
							v-if="themeConfig.themeConfig.isBreadcrumbIcon"
						></i>
						{{ $t(item.meta.title) }}
					</span>
					<a v-else @click.prevent="onBreadcrumbClick(item)">
						<i
							:class="item.meta.icon"
							class="layout-navbars-breadcrumb-iconfont"
							v-if="themeConfig.themeConfig.isBreadcrumbIcon"
						></i
						>{{ $t(item.meta.title) }}
					</a>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'Breadcrumbs',
	data() {
		return {
			breadcrumbList: [],
			routeSplit: [],
			routeSplitFirst: '',
			routeSplitIndex: 1,
		};
	},
	computed: {
		...mapState(['themeConfig', 'routesList']),
		// 动态设置 经典 横向布局不显示
		isShowBreadcrumb() {
			const { layout, isBreadcrumb } = this.themeConfig.themeConfig;
			if (layout === 'classic' || layout === 'transverse') {
				return 'none';
			} else {
				return isBreadcrumb ? '' : 'none';
			}
		},
	},
	methods: {
		//icon 点击菜单展开与收起
		onThemeConfigChange() {
			this.$store.state.themeConfig.themeConfig.isCollapse =
				!this.$store.state.themeConfig.themeConfig.isCollapse;
		},

		// 当前路由分割
		initRouteSplit(path) {
			this.breadcrumbList = [
				{
					path: '/',
					meta: {
						title: this.routesList.routesList[0].meta.title,
						icon: this.routesList.routesList[0].meta.icon,
					},
				},
			];
			this.routeSplit = path.split('/');
			this.routeSplit.shift();
			this.routeSplitFirst = `/${this.routeSplit[0]}`;
			this.routeSplitIndex = 1;
			this.getBreadcrumbList(this.routesList.routesList);
			// console.log(this.breadcrumbList);
			// console.log(this.routeSplit);
		},
		// 递归设置 breadcrumb
		getBreadcrumbList(arr) {
			arr.map((item) => {
				this.routeSplit.map((v, k, arrs) => {
					if (this.routeSplitFirst === item.path) {
						this.routeSplitFirst += `/${arrs[this.routeSplitIndex]}`;
						this.breadcrumbList.push(item);
						this.routeSplitIndex++;
						if (item.children) this.getBreadcrumbList(item.children);
					}
				});
			});
		},
		// 点击当前项
		onBreadcrumbClick(v) {
			const { redirect, path } = v;
			// console.log(v, '======');
			if (redirect) this.$router.push(redirect);
			else this.$router.push(path);
		},
	},

	mounted() {
		this.initRouteSplit(this.$route.path);
	},
	// 监听路由变化
	watch: {
		$route: {
			handler(nawVal) {
				this.initRouteSplit(nawVal.path);
			},
			deep: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.layout-navbars-breadcrumb {
	flex: 1;
	height: inherit;
	display: flex;
	align-items: center;
	padding-left: 15px;
	.layout-navbars-breadcrumb-icon {
		cursor: pointer;
		font-size: 18px;
		margin-right: 15px;
		color: var(--prev-bg-topBarColor);
		opacity: 0.8;
		&:hover {
			opacity: 1;
		}
	}
	.layout-navbars-breadcrumb-span {
		opacity: 0.7;
		color: var(--prev-bg-topBarColor);
	}
	.layout-navbars-breadcrumb-iconfont {
		font-size: 14px;
		margin-right: 5px;
	}
}
</style>
