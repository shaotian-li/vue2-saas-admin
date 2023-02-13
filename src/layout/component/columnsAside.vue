<template>
	<div class="layout-columns-aside">
		<el-scrollbar>
			<ul>
				<li
					v-for="(item, index) in columnsAsideList"
					:key="index"
					@click="onColumnsAsideMenuClick(item, index)"
					:title="$t(item.meta.title)"
					ref="columnsAsideOffsetTopRefs"
					:class="{ 'layout-columns-active': liIndex === index }"
				>
					<div
						:class="setColumnsAsidelayout"
						v-if="!item.meta.isLink || (item.meta.isLink && item.meta.isIframe)"
					>
						<i :class="item.meta.icon"></i>
						<div class="font12">
							{{
								$t(item.meta.title) && $t(item.meta.title).length >= 4
									? $t(item.meta.title).substr(
											0,
											setColumnsAsidelayout === 'columns-vertical' ? 4 : 3
									  )
									: $t(item.meta.title)
							}}
						</div>
					</div>
					<div :class="setColumnsAsidelayout" v-else>
						<a :href="item.meta.isLink" target="_blank">
							<i :class="item.meta.icon"></i>
							<div class="font12">
								{{
									$t(item.meta.title) && $t(item.meta.title).length >= 4
										? $t(item.meta.title).substr(
												0,
												setColumnsAsidelayout === 'columns-vertical' ? 4 : 3
										  )
										: $t(item.meta.title)
								}}
							</div>
						</a>
					</div>
				</li>
				<div ref="columnsAsideActiveRef" :class="setColumnsAsideStyle"></div>
			</ul>
		</el-scrollbar>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
	name: 'layoutColumnsAside',
	data() {
		return {
			columnsAsideList: [],
			liIndex: 2,
			difference: 0,
			routeSplit: [],
		};
	},
	computed: {
		...mapState(['themeConfig']),
		...mapGetters({
			setRoutesData: 'routesList/getRoutesData',
		}),
		// 设置分栏高亮风格
		setColumnsAsideStyle() {
			return this.themeConfig.themeConfig.columnsAsideStyle;
		},
		// 设置分栏布局风格
		setColumnsAsidelayout() {
			return this.themeConfig.themeConfig.columnsAsideLayout;
		},
	},
	mounted() {
		this.setFilterRoutes();
	},

	methods: {
		// 设置/过滤（非晶态路由/是否显示在菜单中）
		setFilterRoutes() {
			if (this.setRoutesData.length <= 0) return false;
			this.columnsAsideList = this.filterRoutesFun(this.setRoutesData);
			const resData = this.setSendChildren(this.$route.path);
			console.log(resData, '===res');
			if (Object.keys(resData).length <= 0) return false;
			this.onColumnsAsideDown(resData.item[0].i);
			this.bus.$emit('setSendColumnsChildren', resData);
		},

		// 设置高亮动态位置
		onColumnsAsideDown(k) {
			this.$nextTick(() => {
				this.setColumnsAsideMove(k);
			});
		},
		// 设置菜单高亮移动位置
		setColumnsAsideMove(k) {
			const els = this.$refs.columnsAsideOffsetTopRefs;
			this.liIndex = k;
			// console.log(this.$refs.columnsAsideOffsetTopRefs.style.top, '=====');
			this.$refs.columnsAsideActiveRef.style.top = `${els[k].offsetTop + this.difference}px`;
		},

		// 传递当前子级数据到菜单
		setSendChildren(path) {
			const currentPathSplit = path.split('/');
			let currentData = {};
			this.columnsAsideList.map((v, i) => {
				if (v.path === `/${currentPathSplit[1]}`) {
					v['i'] = i;
					currentData['item'] = [{ ...v }];
					currentData['children'] = [{ ...v }];
					if (v.children) currentData['children'] = v.children;
				}
			});
			return currentData;
		},

		onColumnsAsideMenuClick(v, k) {
			this.setColumnsAsideMove(k);
			let { path, redirect } = v;
			if (redirect) this.$router.push(redirect);
			else this.$router.push(path);
		},

		// 路由过滤递归函数
		filterRoutesFun(arr) {
			return arr
				.filter((item) => !item.meta.isHide)
				.map((item) => {
					item = Object.assign({}, item);
					if (item.children) item.children = this.filterRoutesFun(item.children);
					return item;
				});
		},
		setColumnsMenuHighlight(path) {
			this.routeSplit = path.split('/');
			this.routeSplit.shift();
			const routeFirst = `/${this.routeSplit[0]}`;
			const currentSplitRoute = this.columnsAsideList.find((v) => v.path === routeFirst);
			if (!currentSplitRoute) return false;
			// 延迟拿值，防止取不到
			setTimeout(() => {
				this.onColumnsAsideDown(currentSplitRoute.k);
			}, 0);
		},
	},
	watch: {
		// 监听 vuex 数据变化
		'$store.state': {
			handler(val) {
				val.themeConfig.themeConfig.columnsAsideStyle === 'columnsRound'
					? (this.difference = 3)
					: (this.difference = 0);
				if (val.routesList.routesList.length === this.columnsAsideList.length) return false;
				this.setFilterRoutes();
			},
			deep: true,
		},
		// 监听路由的变化
		$route: {
			handler(to) {
				this.setColumnsMenuHighlight(to.path);
				this.bus.$emit('setSendColumnsChildren', this.setSendChildren(to.path));
			},
			deep: true,
		},
	},
};
</script>

<style scoped lang="scss">
.layout-columns-aside {
	width: 70px;
	height: 100%;
	background: var(--prev-bg-columnsMenuBar);
	ul {
		position: relative;
		li {
			color: var(--prev-bg-columnsMenuBarColor);
			width: 100%;
			height: 50px;
			text-align: center;
			display: flex;
			cursor: pointer;
			position: relative;
			z-index: 1;
			.columns-vertical {
				margin: auto;
				.columns-vertical-title {
					padding-top: 1px;
				}
			}
			.columns-horizontal {
				display: flex;
				height: 50px;
				width: 100%;
				align-items: center;
				padding: 0 5px;
				i {
					margin-right: 3px;
				}
				a {
					display: flex;
					.columns-horizontal-title {
						padding-top: 1px;
					}
				}
			}
			a {
				text-decoration: none;
				color: var(--prev-bg-columnsMenuBarColor);
			}
		}
		.layout-columns-active {
			color: var(--prev-color-text-white);
			transition: 0.3s ease-in-out;
		}
		.columns-round {
			background: var(--prev-color-primary);
			color: var(--prev-color-text-white);
			position: absolute;
			left: 50%;
			top: 2px;
			height: 50px;
			width: 65px;
			transform: translateX(-50%);
			z-index: 0;
			transition: 0.3s ease-in-out;
			border-radius: 5px;
		}
		.columns-card {
			@extend .columns-round;
			top: 0;
			height: 50px;
			width: 100%;
			border-radius: 0;
		}
	}
}
</style>
