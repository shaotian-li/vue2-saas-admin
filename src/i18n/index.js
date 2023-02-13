import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zhcnLocale from 'element-ui/lib/locale/lang/zh-CN';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhtwLocale from 'element-ui/lib/locale/lang/zh-TW';
import store from '@/store/index.js';

import nextZhcn from '@/i18n/lang/zh-cn.js';
import nextEn from '@/i18n/lang/en.js';
import nextZhtw from '@/i18n/lang/zh-tw.js';

// 使用插件
Vue.use(VueI18n);

const messages = {
	'zh-cn': {
		...zhcnLocale,
		message: {
			...nextZhcn,
		},
	},
	en: {
		...enLocale,
		message: {
			...nextEn,
		},
	},
	'zh-tw': {
		...zhtwLocale,
		message: {
			...nextZhtw,
		},
	},
};

// 导出语言国际化
export const i18n = new VueI18n({
	locale: store.state.themeConfig.themeConfig.globalI18n,
	fallbackLocale: 'zh-cn',
	messages,
});
