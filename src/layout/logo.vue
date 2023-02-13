<template>
	<div class="layout-logo" v-if="setShowLogo" @click="onThemeConfigChange">
		<img
			src="https://ts1.cn.mm.bing.net/th/id/R-C.a896225210163db675dfa39e77901140?rik=j8oUNGOj3REDQQ&riu=http%3a%2f%2fpic1.nipic.com%2f2008-10-27%2f2008102715429376_2.jpg&ehk=JOob0RLmKrGnYD2rkNPxYDlb%2fdJXOFDBDiGcKvPKumY%3d&risl=&pid=ImgRaw&r=0"
			class="layout-logo-medium-img"
		/>
		<span>{{ themeConfig.themeConfig.globalTitle }}</span>
	</div>
	<div v-else class="layout-logo-size">
		<img
			src="https://ts1.cn.mm.bing.net/th/id/R-C.a896225210163db675dfa39e77901140?rik=j8oUNGOj3REDQQ&riu=http%3a%2f%2fpic1.nipic.com%2f2008-10-27%2f2008102715429376_2.jpg&ehk=JOob0RLmKrGnYD2rkNPxYDlb%2fdJXOFDBDiGcKvPKumY%3d&risl=&pid=ImgRaw&r=0"
			class="layout-logo-size-img"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'layoutLogo',
	computed: {
		...mapState(['themeConfig']),
		// 设置 logo 是否显示
		setShowLogo() {
			let { isCollapse, layout } = this.themeConfig.themeConfig;

			return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
		},
	},

	methods: {
		// logo 点击实现菜单展示 / 收起
		onThemeConfigChange() {
			if (this.themeConfig.themeConfig.layout === 'transverse') return false;
			this.$store.state.themeConfig.themeConfig.isCollapse =
				!this.$store.state.themeConfig.themeConfig.isCollapse;
		},
	},
};
</script>

<style scoped lang="scss">
.layout-logo {
	width: 220px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
	color: var(--prev-color-primary);
	font-size: 16px;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	&:hover {
		span {
			opacity: 0.9;
		}
	}
	&-medium-img {
		width: 20px;
		margin-right: 5px;
		position: relative;
		top: 2px;
	}
}
.layout-logo-size {
	width: 100%;
	height: 50px;
	display: flex;
	cursor: pointer;
	&-img {
		width: 20px;
		margin: auto;
		animation: logoAnimation 0.3s ease-in-out;
	}
}
</style>
