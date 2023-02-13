<template>
	<div class="layout-navbars-tagsview">
		<el-scrollbar ref="scrollbarRef" @wheel.native.prevent="onHandleScroll">
			<ul class="layout-navbars-tagsview-ul" :class="setTagsStyle">
				<li
					v-for="(item, i) in tagsViewList"
					:key="i"
					class="layout-navbars-tagsview-ul-li"
					:data-name="item.name"
					:class="{ 'is-active': item.path === tagsRoutePath }"
					@click="onTagsClick(item, i)"
					@contextmenu.prevent="onContextmenu(item, $event)"
					ref="tagsRefs"
				>
					<i
						class="iconfont icon-webicon318 layout-navbars-tagsview-ul-li-iconfont font14"
						v-if="item.path === tagsRoutePath"
					></i>
					<i
						class="layout-navbars-tagsview-ul-li-iconfont font14 is-tagsview-icon"
						:class="item.meta.icon"
						v-if="item.path !== tagsRoutePath && themeConfig.themeConfig.isTagsviewIcon"
					></i>
					<span>{{ $t(item.meta.title) }}</span>
					<!-- 刷新 -->
					<i
						class="el-icon-refresh-right layout-navbars-tagsview-ul-li-icon ml5"
						v-if="item.path === tagsRoutePath"
						@click.stop="refreshCurrentTagsView(item.path)"
					></i>
					<!-- 关闭 -->
					<i
						class="el-icon-close layout-navbars-tagsview-ul-li-icon ml5"
						v-if="!item.meta.isAffix"
						@click.stop="closeCurrentTagsView(item.path)"
					></i>
				</li>
			</ul>
		</el-scrollbar>
		<contextmenu
			:dropdown="tagsDropdown"
			ref="tagsContextmenu"
			@currentContextmenuClick="onCurrentContextmenuClick"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { Session } from '@/utils/storage.js';
import Contextmenu from './contextmenu.vue';
export default {
	name: 'tagsView',
	data() {
		return {
			userInfo: {},
			tagsViewList: [],
			tagsRoutePath: this.$route.path,
			tagsViewRoutesList: [],
			tagsRefsIndex: 0,
			tagsDropdown: {
				x: '',
				y: '',
			},
		};
	},
	components: {
		Contextmenu,
	},
	computed: {
		...mapState(['themeConfig', 'tagsViewRoute']),
		// 动态设置 tagsView 风格样式
		setTagsStyle() {
			return this.themeConfig.themeConfig.tagsStyle;
		},
	},
	created() {
		// 监听非本页面调用
		this.bus.$on('onCurrentContextmenuClick', (data) => {
			this.onCurrentContextmenuClick(data);
		});
	},
	mounted() {
		this.getTagsViewRoutes();
	},

	methods: {
		// 获取 vuex中的tagsviewroutes列表
		getTagsViewRoutes() {
			this.tagsRoutePath = this.$route.path;
			this.tagsViewList = [];
			if (!this.themeConfig.themeConfig.isCacheTagsView) Session.remove('tagsViewList');
			this.tagsViewRoutesList = this.tagsViewRoute.tagsViewRoutes;
			this.initTagsViewList();
		},
		// 初始化 tagsview数据
		initTagsViewList() {
			if (Session.get('tagsViewList') && this.themeConfig.themeConfig.isCacheTagsView) {
				this.tagsViewList = Session.get('tagsViewList');
			} else {
				this.tagsViewRoutesList.map((v) => {
					if (v.meta.isAffix && !v.meta.isHide) this.tagsViewList.push({ ...v });
				});
				this.addTagsView(this.$route.path);
			}
		},

		// 添加 tagsviews: 未设置隐藏  也添加到在 tagsView 中
		addTagsView(path, to) {
			if (this.tagsViewList.some((v) => v.path === path)) return false;
			const item = this.tagsViewRoutesList.find((v) => v.path === path);
			if (item.meta.isLink && !item.meta.isIframe) return false;
			item.query = to?.query ? to?.query : this.$route.query;
			this.tagsViewList.push({ ...item });
			this.addBrowserSetSession(this.tagsViewList);
		},

		// 存储 tagsviewList 到浏览器临时缓存中，页面刷新时，保留记录
		addBrowserSetSession(viewList) {
			Session.set('tagsViewList', viewList);
		},
		// 当前tags点击
		onTagsClick(v, k) {
			this.tagsRoutePath = v.path;
			this.tagsRefsIndex = k;
			this.$router.push(v);
		},

		// 关闭当前 tagsView
		closeCurrentTagsView(path) {
			this.tagsViewList.map((item, index, arr) => {
				if (!item.meta.isAffix) {
					if (item.path === path) {
						this.tagsViewList.splice(index, 1);
						setTimeout(() => {
							// 最后一个
							if (this.tagsViewList.length === index) {
								this.$router.push({
									path: arr[arr.length - 1].path,
									query: arr[arr.length - 1].query,
								});
							} else {
								this.$router.push({
									path: arr[index].path,
									query: arr[index].query,
								});
							}
						}, 0);
					}
				}
				// console.log(item, index, arr);
			});
			this.addBrowserSetSession(this.tagsViewList);
		},

		// 刷新当前
		refreshCurrentTagsView(path) {
			console.log(path);
		},

		// 鼠标滚轮滚动
		onHandleScroll(e) {
			this.$refs.scrollbarRef.$refs.wrap.scrollLeft += e.wheelDelta / 4;
		},

		// tagsView 横向滚动
		tagsViewmoveToCurrentTag() {
			this.$nextTick(() => {
				const tagsRefs = this.$refs.tagsRefs;
				if (tagsRefs.length <= 0) return false;
				// 当前 li 元素
				let li_dom = tagsRefs[this.tagsRefsIndex];
				// 当前 li 元素下标
				let li_index = this.tagsRefsIndex;
				// 当前 ul li元素总长度
				let li_length = tagsRefs.length;
				// 最前 li
				let li_first = tagsRefs[0];
				// 最后 li
				let li_last = tagsRefs[tagsRefs.length - 1];
				// 当前滚动条的值
				let scroll_refs = this.$refs.scrollbarRef.$refs.wrap;
				// 当前滚动条滚动宽度
				let scroll_s = scroll_refs.scrollWidth;
				// 当前滚动条便宜宽度
				let offset_w = scroll_refs.offsetWidth;
				// 当前滚动条便宜距离
				let scroll_l = scroll_refs.scrollLeft;
				// 上一个
				let li_prev_tag = tagsRefs[this.tagsRefsIndex - 1];
				// 下一个
				let li_next_tag = tagsRefs[this.tagsRefsIndex + 1];
				// 上一个偏移距离
				let before_prev_l = '';
				// 下一个 tag 偏移距离
				let after_next_l = '';
				if (li_dom === li_first) {
					// 头部
					scroll_refs.scrollLeft = 0;
				} else if (li_dom === li_last) {
					scroll_refs.scrollLeft = scroll_s - offset_w;
				} else {
					if (li_index === 0) before_prev_l = li_first?.offsetLeft - 5;
					else before_prev_l = li_prev_tag?.offsetLeft - 5;
					if (li_index === li_length) after_next_l = li_last?.offsetLeft + li_last.offsetWidth + 5;
					else after_next_l = li_next_tag?.offsetLeft + li_next_tag.offsetWidth + 5;

					if (after_next_l > scroll_l + offset_w) {
						scroll_refs.scrollLeft = after_next_l = offset_w;
					} else if (before_prev_l < scroll_l) {
						scroll_refs.scrollLeft = before_prev_l;
					}
				}
				// 更新滚动条，防止不出现
				this.updateScrollbar();
			});
		},
		// 更新滚动条显示
		updateScrollbar() {
			this.$refs.scrollbarRef.update();
		},

		// 当前菜单点击
		onCurrentContextmenuClick(data) {
			const { id, path } = data;
			console.log(data, '=======');
			let currentTag = this.tagsViewList.find((v) => v.path === path);
			switch (id) {
				case 0:
					this.refreshCurrentTagsView(path);
					this.$router.push({
						path,
						query: currentTag.query,
					});
					break;
				case 1:
					this.closeCurrentTagsView(path);
					break;
				case 2:
					this.$router.push({
						path,
						query: currentTag.query,
					});
					this.closeOtherTagsView(path);
					break;
				case 3:
					this.claseAllTagsView(path);
			}
		},

		// 右键菜单点击显示菜单列表
		onContextmenu(v, e) {
			let { clientX, clientY } = e;
			this.tagsDropdown.x = clientX;
			this.tagsDropdown.y = clientY;
			this.$refs.tagsContextmenu.openContextmenu(v);
		},

		// 关闭其他 tagsview 设置了固定(isAffix) 不进行关闭
		closeOtherTagsView(path) {
			this.tagsViewList = [];
			this.tagsViewRoutesList.map((v) => {
				if (v?.meta?.isAffix && !v?.meta?.isHide) this.tagsViewList.push({ ...v });
			});
			this.addTagsView(path);
		},
		// 关闭全部
		claseAllTagsView(path) {
			this.tagsViewList = [];
			this.tagsViewRoutesList.map((v) => {
				if (v.meta.isAffix && !v.meta.isHide) {
					this.tagsViewList.push({ ...v });
					if (this.tagsViewList.some((v) => v.path === path)) {
						this.$router.push({ path, query: this.$route.query });
					} else {
						this.$router.push({
							path: v.path,
							query: this.$route.query,
						});
					}
				}
			});
			this.addBrowserSetSession(this.tagsViewList);
		},
	},
	watch: {
		// 监听路由变化
		$route: {
			handler(to) {
				this.tagsRoutePath = to.path;
				this.addTagsView(to.path, to);
				this.tagsViewmoveToCurrentTag();
				// this.gett
			},
			deep: true,
		},
	},
};
</script>

<style scoped lang="scss">
.layout-navbars-tagsview {
	flex: 1;
	background-color: var(--prev-bg-white);
	border-bottom: 1px solid var(--prev-border-color-lighter);
	& ::v-deep .is-vertical {
		display: none !important;
	}
	&-ul {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 34px;
		display: flex;
		align-items: center;
		white-space: nowrap;
		color: var(--prev-color-text-regular);
		font-size: 12px;
		padding: 0 15px;
		&-li {
			height: 26px;
			line-height: 26px;
			display: flex;
			align-items: center;
			border: 1px solid var(--prev-border-color-lighter);
			padding: 0 12px 0 15px;
			margin-right: 5px;
			border-radius: 2px;
			position: relative;
			z-index: 0;
			cursor: pointer;
			justify-content: space-between;
			transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1);
			&::before {
				content: '';
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				background: var(--prev-color-primary);
				z-index: -1;
				opacity: 0;
				transform: scale3d(0.7, 1, 1);
				transition: transform 0.3s, opacity 0.3s;
				transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
			}
			&:hover {
				color: var(--prev-color-text-white);
				transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1);
				border-color: transparent;
				&::before {
					opacity: 1;
					transform: translate3d(0, 0, 0);
					border-radius: 2px;
				}
				.is-tagsview-icon {
					color: var(--prev-color-text-white);
					transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1);
				}
			}
			&-iconfont {
				position: relative;
				left: -5px;
				top: 1px;
				color: var(--prev-color-text-white);
			}
			&-icon {
				border-radius: 100%;
				position: relative;
				height: 14px;
				width: 14px;
				text-align: center;
				line-height: 14px;
				top: 1px;
			}
			.is-tagsview-icon {
				color: var(--prev-color-text-regular);
				transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1);
			}
		}
		.is-active {
			color: var(--prev-color-text-white);
			transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1);
			border-color: transparent;
			&::before {
				opacity: 1;
				transform: translate3d(0, 0, 0);
				border-radius: 2px;
			}
		}
	}
	& ::-webkit-scrollbar {
		display: none !important;
	}
}
</style>
