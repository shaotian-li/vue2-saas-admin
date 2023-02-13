<template>
	<el-container class="layout-container">
		<common-asides />
		<el-container class="flex-center layout-backtop">
			<common-header v-if="isFixedHeader" />
			<el-scrollbar ref="layoutDefaultsScrollbarRef">
				<common-header v-if="!isFixedHeader" />
				<common-main />
			</el-scrollbar>
		</el-container>
		<el-backtop target=".layout-backtop .el-scrollbar__wrap"></el-backtop>
	</el-container>
</template>

<script>
import CommonAsides from '../component/aside.vue';
import CommonHeader from '../component/header.vue';
import CommonMain from '../component/main.vue';
import { mapState } from 'vuex';
export default {
	name: 'layoutDefault',
	data() {
		return {};
	},
	computed: {
		...mapState(['themeConfig']),
		// 是否开启固定 header
		isFixedHeader() {
			return this.themeConfig.themeConfig.isFixedHeader;
		},
	},
	components: {
		CommonAsides,
		CommonHeader,
		CommonMain,
	},
	watch: {
		// 监听路由的变化
		$route: {
			handler() {
				this.$refs.layoutDefaultsScrollbarRef.wrap.scrollTop = 0;
			},
			deep: true,
		},
	},
};
</script>

<style></style>
