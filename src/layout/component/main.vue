<template>
	<el-main class="layout-main">
		<el-scrollbar
			class="layout-scrollbar"
			ref="layoutScrollbarRef"
			v-show="!currentRouteMeta.isLink && !currentRouteMeta.isIframe"
			:style="{ minHeight: `calc(100vh - ${headerHeight}` }"
		>
			<layout-parent />
			<footers v-if="themeConfig.themeConfig.isFooter" />
		</el-scrollbar>
		<iframes
			:style="{ height: `calc(100vh - ${headerHeight}` }"
			v-if="currentRouteMeta.isLink && currentRouteMeta.isIframe && isShowLink"
			@getCurrentRouteMeta="onGetCurrentRouteMeta"
			:meta="currentRouteMeta"
		/>
	</el-main>
</template>

<script>
import LayoutParent from '../routerView/parent.vue';
import footers from '../footer.vue';
import { mapState } from 'vuex';
import Iframes from '../routerView/iframes.vue';
export default {
	name: 'CommonMain',
	data() {
		return {
			headerHeight: '',
			isShowLink: false,
			currentRouteMeta: {},
		};
	},
	components: {
		LayoutParent,
		footers,
		Iframes,
	},
	computed: {
		...mapState(['themeConfig']),
	},
	mounted() {
		this.initHeaderHeight();
		this.initCurrentRouteMeta(this.$route.meta);
	},
	methods: {
		// 初始化当前路由 meta 信息
		initCurrentRouteMeta(meta) {
			// console.log(meta, '=====');
			this.isShowLink = false;
			this.currentRouteMeta = meta;
			setTimeout(() => {
				this.isShowLink = true;
			}, 100);
		},
		// 设置 main 的高度
		initHeaderHeight() {
			const { isTagsview } = this.themeConfig.themeConfig;
			if (isTagsview) {
				return (this.headerHeight = `84px`);
			} else {
				return (this.headerHeight = `50px`);
			}
		},

		// 子组件触发更新
		onGetCurrentRouteMeta() {
			this.initCurrentRouteMeta(this.$route.meta);
		},
	},
	watch: {
		// 监听 vuex 数据变化
		'$stote.state.themeConfig.themeConfig': {
			handler(val) {
				this.headerHeight = val.isTagsview ? '84px' : '50px';
				if (val.isFixedHeaderChange !== val.isFixedHeader) {
					if (!this.$refs.layoutScrollbarRef) return false;
					this.$refs.layoutScrollbarRef.update();
				}
			},
			deep: true,
		},
		// 监听路由变化
		$route: {
			handler(to) {
				this.initCurrentRouteMeta(to.meta);
				this.$refs.layoutScrollbarRef.wrap.scrollTop = 0;
			},
			deep: true,
		},
	},
};
</script>

<style></style>
