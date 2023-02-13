<template>
	<div class="layout-search-dialog">
		<el-dialog
			:visible.sync="isShowSearch"
			width="300px"
			destroy-on-close
			:modal="false"
			fullscreen
			:show-close="false"
		>
			<el-autocomplete
				v-model="menuQuery"
				:placeholder="$t('message.user.searchPlaceholder')"
				prefix-icon="el-icon-search"
				ref="layoutMenuAutocompleteRef"
				:fetch-suggestions="menuSearch"
				@select="onHandleSelect"
				@blur="onSearchBlur"
			>
				<template slot-scope="{ item }">
					<div><i :class="item.meta.icon" class="mr10"></i>{{ $t(item.meta.title) }}</div>
				</template>
			</el-autocomplete>
		</el-dialog>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'layoutSearch',
	data() {
		return {
			isShowSearch: false,
			menuQuery: '',
			tagsViewList: [],
		};
	},
	computed: {
		...mapGetters({
			setTagsViewRoutes: 'tagsViewRoute/getTagsRoutes',
		}),
	},
	methods: {
		// 打开弹窗
		openSearch() {
			this.menuQuery = '';
			this.isShowSearch = true;
			this.initTageView();
			this.$nextTick(() => {
				this.$refs.layoutMenuAutocompleteRef.focus();
			});
		},

		// 初始化菜单
		initTageView() {
			if (this.tagsViewList.length > 0) return false;
			this.setTagsViewRoutes.map((v) => {
				if (!v.meta.isHide) this.tagsViewList.push({ ...v });
			});
		},

		// 搜索弹窗关闭
		closeSearch() {
			setTimeout(() => {
				this.isShowSearch = false;
			}, 150);
		},
		// 菜单搜索数据过滤
		menuSearch(queryString, cb) {
			let results = queryString
				? this.tagsViewList.filter(this.createFilter(queryString))
				: this.tagsViewList;
			cb(results);
		},

		// 菜单搜索过滤
		createFilter(string) {
			return (restaurant) => {
				return (
					restaurant.path.toLowerCase().indexOf(string.toLowerCase()) > -1 ||
					restaurant.meta.title.toLowerCase().indexOf(string.toLowerCase()) > -1 ||
					this.$t(restaurant.meta.title).toLowerCase().indexOf(string.toLowerCase()) > -1
				);
			};
		},

		// 当前菜单选中
		onHandleSelect(item) {
			const { path, redirect } = item;
			if (item?.meta?.isLink && !item.meta.isIframe) {
				window.open(item.meta.isLink);
			} else if (redirect) {
				this.$router.push(redirect);
			} else {
				this.$router.push(path);
			}
			this.closeSearch();
		},
		// input 失去焦点时
		onSearchBlur() {
			this.closeSearch();
		},
	},
};
</script>

<style scoped lang="scss">
.layout-search-dialog {
	::v-deep .el-dialog {
		box-shadow: unset !important;
		border-radius: 0 !important;
		background: rgba(0, 0, 0, 0.5);
	}
	::v-deep .el-autocomplete {
		width: 560px;
		position: absolute;
		top: 100px;
		left: 50%;
		transform: translateX(-50%);
	}
}
</style>
