<template>
	<div class="h100">
		<transition :name="setTransitionName" mode="out-in">
			<keep-alive :include="keepAliveNameList">
				<router-view :key="refreshRouterViewKey" />
			</keep-alive>
		</transition>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
	name: 'parent',
	data() {
		return {
			refreshRouterViewKey: null,
			keepAliveNameList: [],
		};
	},
	created() {
		// 页面加载前，处理缓存，页面刷新时路由缓存处理
		this.keepAliveNameList = this.getKeepAliveNames();
		this.bus.$on('onTagsViewRefreshRouterView', (path) => {
			if (this.$route.path !== path) return false;
			this.keepAliveNameList = this.getKeepAliveNames().filter((name) => this.$route.name !== name);
			this.refreshRouterViewKey = this.$route.path;
			this.$nextTick(() => {
				this.refreshRouterViewKey = null;
				this.keepAliveNameList = this.getKeepAliveNames();
			});
		});
	},

	computed: {
		...mapState(['themeConfig']),
		...mapGetters({
			setKeepAliveNameList: 'keepAliveName/getKeepAliveNameList',
		}),
		// 设置主界面切换动画
		setTransitionName() {
			return this.themeConfig.themeConfig.animation;
		},
	},
	methods: {
		// 获取路由缓存列表
		getKeepAliveNames() {
			return this.setKeepAliveNameList;
		},
	},
};
</script>

<style></style>
