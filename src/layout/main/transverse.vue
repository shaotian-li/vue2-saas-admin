<template>
	<el-container class="layout-container flex-center layout-backtop">
		<common-header />
		<common-main />
		<el-backtop target=".layout-backtop .el-main .el-scrollbar__wrap"></el-backtop>
	</el-container>
</template>

<script>
import CommonHeader from '../component/header.vue';
import CommonMain from '../component/main.vue';
export default {
	name: 'layoutRransverse',
	components: {
		CommonHeader,
		CommonMain,
	},
};
</script>

<style></style>
