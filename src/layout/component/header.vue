<template>
	<el-header class="layout-header" :height="setHeaderHeight">
		<nav-bars />
	</el-header>
</template>

<script>
import { mapState } from 'vuex';
import NavBars from '../navBars/index.vue';
export default {
	name: 'layoutHeader',
	data() {
		return {};
	},
	components: {
		NavBars,
	},
	computed: {
		...mapState(['themeConfig']),
		// 设置顶部header具体高度
		setHeaderHeight() {
			const { isTagsview, layout } = this.themeConfig.themeConfig;
			if (isTagsview && layout !== 'classic') return '84px';
			else return '50px';
		},
	},
};
</script>

<style></style>
