<template>
	<el-container class="layout-container">
		<columns-aside />
		<div class="layout-columns-warp">
			<common-asides />
			<el-container class="flex-center layout-backtop">
				<common-header v-if="isFixedHeader" />
				<el-scrollbar>
					<common-header v-if="!isFixedHeader" />
					<common-main />
				</el-scrollbar>
			</el-container>
		</div>
		<el-backtop target=".layout-backtop .el-scrollbar__wrap"></el-backtop>
	</el-container>
</template>

<script>
import CommonAsides from '../component/aside.vue';
import CommonHeader from '../component/header.vue';
import CommonMain from '../component/main.vue';
import ColumnsAside from '../component/columnsAside.vue';
import { mapState } from 'vuex';
export default {
	name: 'layoutColumns',
	components: {
		CommonAsides,
		CommonHeader,
		CommonMain,
		ColumnsAside,
	},
	computed: {
		...mapState(['themeConfig']),
		// 是否开启固定 header
		isFixedHeader() {
			return this.themeConfig.themeConfig.isFixedHeader;
		},
	},
};
</script>

<style></style>
