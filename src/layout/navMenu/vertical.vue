<template>
	<el-menu
		router
		background-color="transparent"
		:default-active="defaultActive"
		:collapse="setIsCollapse"
	>
		<template v-for="item in menuList">
			<el-submenu
				:index="item.path"
				v-if="item.children && item.children.length > 0"
				:key="item.path"
			>
				<template slot="title">
					<i :class="item.meta.icon ? item.meta.icon : ''"></i>
					<span>{{ $t(item.meta.title) }}</span>
				</template>
				<SubItem :chilData="item.children" />
			</el-submenu>

			<template v-else>
				<el-menu-item :index="item.path" :key="item.path">
					<i :class="item.meta.icon ? item.meta.icon : ''"></i>
					<template
						slot="title"
						v-if="!item.meta.isLink || (item.meta.isLink && item.meta.isIframe)"
					>
						<span>{{ $t(item.meta.title) }}</span>
					</template>
					<template slot="title" v-else>
						<a :href="item.meta.isLink" target="_blank">{{ $t(item.meta.title) }}</a>
					</template>
				</el-menu-item>
			</template>
		</template>
	</el-menu>
</template>

<script>
import { mapState } from 'vuex';
import SubItem from './subItem.vue';
export default {
	name: 'menuVertical',
	data() {
		return {
			defaultActive: this.$route.path,
		};
	},
	props: {
		menuList: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	components: {
		SubItem,
	},
	computed: {
		...mapState(['themeConfig']),
		// 设置左侧菜单是否展开/收起
		setIsCollapse() {
			return document.body.clientWidth < 1000 ? false : this.themeConfig.themeConfig.isCollapse;
		},
	},
	watch: {
		// 监听路由的变化
		$route: {
			handler(to) {
				this.defaultActive = to.path;
				const clientWidth = document.body.clientWidth;
				if (clientWidth < 1000) this.$store.state.themeConfig.themeConfig.isCollapse = false;
			},
			deep: true,
		},
	},
};
</script>

<style></style>
