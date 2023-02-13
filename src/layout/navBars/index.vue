<template>
	<div class="layout-navbars-container">
		<breadcrumb-index />
		<tags-view v-if="setShowTags" />
	</div>
</template>

<script>
import BreadcrumbIndex from './breadcrumb/index.vue';
import TagsView from './tagsView/index.vue';
import { mapState } from 'vuex';
export default {
	name: 'layoutNavBar',
	components: {
		BreadcrumbIndex,
		TagsView,
	},
	computed: {
		// 设置是否显示
		...mapState(['themeConfig']),
		// 是否显示tags
		setShowTags() {
			const { layout, isTagsview } = this.themeConfig.themeConfig;
			return layout !== 'classic' && isTagsview;
		},
	},
};
</script>

<style lang="scss" scoped>
.layout-navbars-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
</style>
