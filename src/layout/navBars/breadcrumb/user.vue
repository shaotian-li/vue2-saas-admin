<template>
	<div class="layout-navbars-breadcrumb-user" :style="{ flex: userFlexNum }">
		<!-- 字体大小 -->
		<el-dropdown
			:show-timeout="70"
			:hide-timeout="50"
			@command="onComponentSizeChange"
			trigger="click"
		>
			<div class="layout-navbars-breadcrumb-user-icon">
				<i class="iconfont icon-ziti" :title="$t('message.user.title0')"></i>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="" :disabled="disabledSize === ''">
						{{ $t('message.user.dropdownDefault') }}
					</el-dropdown-item>
					<el-dropdown-item command="medium" :disabled="disabledSize === 'medium'">
						{{ $t('message.user.dropdownMedium') }}
					</el-dropdown-item>
					<el-dropdown-item command="small" :disabled="disabledSize === 'small'">
						{{ $t('message.user.dropdownSmall') }}
					</el-dropdown-item>
					<el-dropdown-item command="mini" :disabled="disabledSize === 'mini'"
						>{{ $t('message.user.dropdownMini') }}
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
		<!-- 切换语言 -->
		<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onLanguageChange">
			<div class="layout-navbars-breadcrumb-user-icon">
				<i
					class="iconfont"
					:class="disabledI18n === 'en' ? 'icon-fuhao-yingwen' : 'icon-fuhao-zhongwen'"
					:title="$t('message.user.title1')"
				>
				</i>
			</div>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="zh-cn" :disabled="disabledI18n === 'zh-cn'">
					简体中文
				</el-dropdown-item>
				<el-dropdown-item command="en" :disabled="disabledI18n === 'en'">English</el-dropdown-item>
				<el-dropdown-item command="zh-tw" :disabled="disabledI18n === 'zh-tw'">
					繁體中文
				</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<!-- 搜索 -->
		<div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
			<i class="el-icon-search" :title="$t('message.user.title2')"></i>
		</div>
		<!-- 换肤 -->
		<div class="layout-navbars-breadcrumb-user-icon" @click="onLayoutSetingClick">
			<i class="icon-skin iconfont" :title="$t('message.user.title3')"></i>
		</div>
		<!-- 消息 -->
		<div class="layout-navbars-breadcrumb-user-icon">
			<el-popover
				placement="bottom"
				trigger="click"
				v-model="isShowUserNewsPopover"
				:width="300"
				popper-class="el-popover-pupop-user-news"
			>
				<el-badge
					:is-dot="newsIcon"
					@click.stop="isShowUserNewsPopover = !isShowUserNewsPopover"
					slot="reference"
				>
					<i class="el-icon-bell" :title="$t('message.user.title4')"> </i>
				</el-badge>
				<transition name="el-zoom-in-top">
					<user-news
						v-show="isShowUserNewsPopover"
						@allReadClick="onAllReadClick"
						:newsList="newsList"
					/>
				</transition>
			</el-popover>
		</div>
		<!-- 全屏 -->
		<div class="layout-navbars-breadcrumb-user-icon mr10" @click="onScreenfullClick">
			<i
				class="iconfont"
				:title="isScreenfull ? $t('message.user.title6') : $t('message.user.title5')"
				:class="!isScreenfull ? 'icon-fullscreen' : 'icon-tuichuquanping'"
			></i>
		</div>
		<!-- 员工信息 -->
		<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onDropdownClick">
			<span class="layout-navbars-breadcrumb-user-link">
				<img
					:src="userInfo.userInfos.photo"
					class="layout-navbars-breadcrumb-user-link-photo mr5"
					alt=""
				/>
				{{ userInfo.userInfos.userName === '' ? 'test' : userInfo.userInfos.userName }}
				<i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="/home">{{ $t('message.user.dropdown1') }}</el-dropdown-item>
				<el-dropdown-item command="wareHouse">{{ $t('message.user.dropdown6') }}</el-dropdown-item>
				<el-dropdown-item command="/personal">{{ $t('message.user.dropdown2') }}</el-dropdown-item>
				<el-dropdown-item command="/404">{{ $t('message.user.dropdown3') }}</el-dropdown-item>
				<el-dropdown-item command="/401">{{ $t('message.user.dropdown4') }}</el-dropdown-item>
				<el-dropdown-item divided command="logOut">{{
					$t('message.user.dropdown5')
				}}</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<Search ref="searchRef" />
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { Local, Session } from '@/utils/storage.js';
import screenfull from 'screenfull';
import UserNews from './userNews.vue';
import Search from './search.vue';
export default {
	name: 'User',
	data() {
		return {
			disabledI18n: 'zh-cn',
			isShowUserNewsPopover: false,
			isScreenfull: false,
			disabledSize: '',
			newsIcon: true,
			newsList: [
				{
					label: '版本发布通知',
					value: '基于 vue2 + element ui vueadmin发布时间：2023年2月8日',
					time: '2023-2-8',
				},
			],
		};
	},
	components: {
		UserNews,
		Search,
	},
	computed: {
		...mapState(['themeConfig', 'userInfo']),
		// 设置弹性盒子
		userFlexNum() {
			const { layout, isClassicSplitMenu } = this.themeConfig.themeConfig;
			let num = '';
			if (
				layout === 'defaults' ||
				(layout === 'classic' && !isClassicSplitMenu) ||
				layout === 'columns'
			)
				num = 1;
			else num = null;
			return num;
		},
	},
	mounted() {
		if (Local.get('themeConfigPrev')) {
			this.initI18n();
			this.initComponentSize();
		}
	},
	methods: {
		// 初始化全局组件大小
		initComponentSize() {
			switch (Local.get('themeConfigPrev').globalComponentSize) {
				case '':
					this.disabledSize = '';
					break;
				case 'medium':
					this.disabledSize = 'medium';
					break;
				case 'small':
					this.disabledSize = 'small';
					break;
				case 'mini':
					this.disabledSize = 'mini';
					break;
			}
		},
		// 字体大小
		onComponentSizeChange(size) {
			Local.remove('themeConfigPrev');
			this.$store.state.themeConfig.themeConfig.globalComponentSize = size;
			Local.set('themeConfigPrev', this.themeConfig.themeConfig);
			this.initComponentSize();
			window.location.reload();
		},

		// 初始化语言国际化
		initI18n() {
			switch (Local.get('themeConfigPrev').globalI18n) {
				case 'zh-cn':
					this.disabledI18n = 'zh-cn';
					break;
				case 'en':
					this.disabledI18n = 'en';
					break;
				case 'zh-tw':
					this.disabledI18n = 'zh-tw';
					break;
			}
		},

		// 搜索点击
		onSearchClick() {
			this.$refs.searchRef.openSearch();
		},
		// 切换中英文
		onLanguageChange(lang) {
			Local.remove('themeConfigPrev');
			this.$store.state.themeConfig.themeConfig.globalI18n = lang;
			Local.set('themeConfigPrev', this.themeConfig.themeConfig);
			this.$i18n.locale = lang;
			this.initI18n();
		},

		// 已读全部消息通知
		onAllReadClick() {
			this.newsList = [];
			this.newsIcon = false;
		},

		// 全屏
		onScreenfullClick() {
			if (!screenfull.isEnabled) {
				this.$message.warning('暂不不支持全屏');
				return false;
			}
			screenfull.toggle();
			screenfull.on('change', () => {
				if (screenfull.isFullscreen) this.isScreenfull = true;
				else this.isScreenfull = false;
			});
			// 监听菜单 horizontal.vue 滚动条高度更新
			this.bus.$emit('updateElScrollBar');
		},

		// 布局配置
		onLayoutSetingClick() {
			this.bus.$emit('openSetingsDrawer');
		},

		// 下拉菜单 当前点击
		onDropdownClick(path) {
			if (path === 'logOut') {
				this.logOut();
			} else if (path === 'wareHouse') {
				window.open('https://github.com/shaotian-li/vue2-saas-admin');
			} else {
				this.$router.push(path);
			}
		},

		// 退出登陆
		logOut() {
			setTimeout(() => {
				this.$msgbox({
					closeOnClickModal: false,
					closeOnPressEscape: false,
					title: this.$t('message.user.logOutTitle'),
					message: this.$t('message.user.logOutMessage'),
					showCancelButton: true,
					confirmButtonText: this.$t('message.user.logOutConfirm'),
					cancelButtonText: this.$t('message.user.logOutCancel'),
					beforeClose: (action, instance, done) => {
						if (action === 'confirm') {
							instance.confirmButtonLoading = true;
							instance.confirmButtonText = this.$t('message.user.logOutExit');
							setTimeout(() => {
								done();
								setTimeout(() => {
									instance.confirmButtonLoading = false;
								}, 300);
							}, 700);
						} else {
							done();
						}
					},
				})
					.then(() => {
						// 清除缓存
						Session.clear();
						window.location.reload();
					})
					.catch(() => {});
			}, 300);
		},
	},
};
</script>

<style lang="scss" scoped>
.layout-navbars-breadcrumb-user {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	&-link {
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		&-photo {
			width: 25px;
			height: 25px;
			border-radius: 100%;
		}
	}
	&-icon {
		padding: 0 10px;
		cursor: pointer;
		color: var(--prev-bg-topBarColor);
		height: 50px;
		line-height: 50px;
		display: flex;
		align-items: center;
		&:hover {
			background: var(--prev-color-hover);
			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}
	& ::v-deep .el-dropdown {
		color: var(--prev-bg-topBarColor);
	}
	& ::v-deep .el-badge {
		height: 40px;
		line-height: 40px;
		display: flex;
		align-items: center;
	}
	& ::v-deep .el-badge__content.is-fixed {
		top: 12px;
	}
}
</style>
