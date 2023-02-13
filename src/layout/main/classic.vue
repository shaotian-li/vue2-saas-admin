<template>
	<el-container class="layout-container flex-center">
		<common-header />
		<el-container class="layout-mian-height-50">
			<common-asides />
			<div class="flex-center layout-backtop">
				<tags-view v-if="themeConfig.themeConfig.isTagsview" />
				<common-main />
			</div>
		</el-container>
		<el-backtop target=".layout-backtop .el-scrollbar__wrap"></el-backtop>
	</el-container>
</template>

<script>
import CommonAsides from '../component/aside.vue';
import CommonHeader from '../component/header.vue';
import CommonMain from '../component/main.vue';
import TagsView from '../navBars/tagsView/index.vue';
import { mapState } from 'vuex';
export default {
	name: 'layoutClassic',
	components: {
		CommonAsides,
		CommonHeader,
		CommonMain,
		TagsView,
	},
	computed: {
		...mapState(['themeConfig']),
	},
};
</script>

<style></style>
