import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import { Session } from '@/utils/storage';
import { PrevLoading } from '@/utils/loading.js';
import { useMenuApi } from '@/api/menu';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { dynamicRouter, setFilterMenuFun, setCacheTagsViewRoutes } from './formatRoute';

const menuApi = useMenuApi();

// 解决 `element ui` 导航栏重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

// 动态路由
const dynamicRoute = [
	{
		path: '/',
		name: '/',
		component: 'layout/index',
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [],
	},
];

// 静态路由
const staticRoutes = [
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login'),
		meta: {
			title: '登录',
		},
	},
	{
		path: '/404',
		name: 'notFound',
		component: () => import('@/views/error/404.vue'),
		meta: {
			title: 'message.staticRoutes.notFound',
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('@/views/error/401.vue'),
		meta: {
			title: 'message.staticRoutes.noPower',
		},
	},
];

//加载静态路由
const createRouter = () =>
	new VueRouter({
		routes: staticRoutes,
	});

const router = createRouter();

// 加载 loading
PrevLoading.start();

// 延迟关闭进度条
const delayNProgressDone = (time = 300) => {
	setTimeout(() => {
		NProgress.done();
	}, time);
};

// 重置路由
export function resetRouter() {
	router.matcher = createRouter().matcher;
}

// 处理多余的layout  需要访问组建保持在第一层
//  keep-alive 只能缓存二级路由
// 默认初始化就执行
const keepAliveSplice = (to) => {
	if (to.matched && to.matched.length > 2) {
		to.matched.map((v, k) => {
			if (v.components.default instanceof Function) {
				v.components.default().then((component) => {
					if (component.default.name === 'parent') {
						to.matched.splice(k, 1);
						router.push({ path: to.path, query: to.query });
						keepAliveSplice(to);
					}
				});
			} else {
				if (v.components.default.name === 'parent') {
					to.matched.splice(k, 1);
					keepAliveSplice(to);
				}
			}
		});
	}
};

// 动态加载返回后端返回路由数据
const getRouterList = (router, to, next) => {
	if (!Session.get('userInfo')) return false;
	if (Session.get('userInfo').userName === 'admin') adminUser(router, to, next);
};

// 添加动态路由
const adminUser = (router, to, next) => {
	resetRouter();
	menuApi
		.getMenuAdmin()
		.then(async (res) => {
			// 读取用户信息，获取对应权限进行判断
			store.dispatch('userInfo/setUserInfos');
			store.dispatch(
				'routesList/setRoutesList',
				setFilterMenuFun(res.data, store.state.userInfo.userInfos.roles)
			);
			dynamicRoute[0].children = res.data;
			const awaitRoute = await dynamicRouter(dynamicRoute);
			// console.log(awaitRoute, '=====adminUser');
			[...awaitRoute, { path: '*', redirect: '/404' }].forEach((route) => {
				router.addRoute({ ...route });
			});
			setCacheTagsViewRoutes(JSON.parse(JSON.stringify(res.data)));
			next({ ...to, replace: true });
		})
		.catch((err) => {
			console.log(err);
		});
};

// 路由加载前
router.beforeEach((to, form, next) => {
	keepAliveSplice(to);
	NProgress.configure({ showSpinner: false });
	if (to.meta.title && to.path !== '/login') NProgress.start();
	let token = Session.get('token');
	if (to.path === '/login' && !token) {
		NProgress.start();
		next();
		delayNProgressDone();
	} else {
		if (!token) {
			NProgress.start();
			next('/login');
			Session.clear();
			delayNProgressDone();
		} else if (token && to.path === '/login') {
			next('/home');
			delayNProgressDone();
		} else {
			// console.log(store.state.routesList.routesList);
			if (Object.keys(store.state.routesList.routesList).length <= 0) {
				getRouterList(router, to, next);
			} else {
				next();
				delayNProgressDone(0);
			}
		}
	}
});

// 路由加载后
router.afterEach(() => {
	PrevLoading.done(); // 关闭loading
	delayNProgressDone();
});

// console.log(router);
// 导出路由
export default router;
