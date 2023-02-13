<template>
	<Defaults v-if="themeConfig.themeConfig.layout === 'defaults'" />
	<Classic v-else-if="themeConfig.themeConfig.layout === 'classic'" />
	<Transverse v-else-if="themeConfig.themeConfig.layout === 'transverse'" />
	<Columns v-else-if="themeConfig.themeConfig.layout === 'columns'" />
</template>

<script>
import Defaults from './main/defaults.vue';
import Classic from './main/classic.vue';
import Transverse from './main/transverse.vue';
import Columns from './main/columns.vue';
import { mapState } from 'vuex';
import { Local } from '@/utils/storage.js';
export default {
	name: 'layout',
	data() {
		return {};
	},
	computed: {
		...mapState(['themeConfig']),
	},

	components: {
		Defaults,
		Classic,
		Transverse,
		Columns,
	},

	created() {
		// console.log(
		// 	this.themeConfig.themeConfig,
		// 	'this.themeConfig.themeConfig',
		// 	this.themeConfig.themeConfig.layout
		// );
		this.onLayoutResize();
		window.addEventListener('resize', this.onLayoutResize);
	},

	methods: {
		// 窗口大小改变（）
		onLayoutResize() {
			if (!Local.get('oldLayout')) {
				Local.set('oldLayout', this.themeConfig.themeConfig.layout);
			}
			const clientWidth = document.body.clientWidth;
			if (clientWidth < 1000) {
				this.$store.state.themeConfig.themeConfig.isCollapse = false;
				this.bus.$emit('layoutMobileResize', {
					layout: 'defaults',
					clientWidth,
				});
			} else {
				this.bus.$emit('layoutMobileResize', {
					layout: Local.get('oldLayout')
						? Local.get('oldLayout')
						: this.themeConfig.themeConfig.layout,
					clientWidth,
				});
			}
		},
		distroyed() {
			window.removeEventListener('resize', this.onLayoutResize);
		},
	},
};
</script>

<style></style>
