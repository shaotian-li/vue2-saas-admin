import store from '../store';

// 递归处理每一项 component 中的路径
const dynamicRouter = (routes) => {
	return routes.map((view) => {
		if (view.component) view.component = loadView(view.component);
		if (view.children) dynamicRouter(view.children);
		return view;
	});
};

/**
 * 打包成一个 js、一个 css
 *  if (path.indexOf('layout') > -1) return () => Promise.resolve(require(`@/${path}`));
 * else return () => Promise.resolve(require(`@/views/${path}`));
 */
// 处理后端返回的 `component` 路径，拼装实现懒加载
const loadView = (path) => {
	if (path.indexOf('layout') > -1) return () => import(`@/${path}`);
	else return () => import(`@/views/${path}`);
};

// 过滤有权限的路由

// 递归过滤有权限的路由
const setFilterMenuFun = (routes, role) => {
	// console.log(routes, role);
	const menu = [];
	routes.forEach((route) => {
		const item = { ...route };
		if (hasAuth(role, item)) {
			if (item.children) item.children = setFilterMenuFun(item.children, role);
			menu.push(item);
		}
	});
	return menu;
};

// 判断路由meta.roles 中是否包含当前登录用户权限判断
const hasAuth = (roles, route) => {
	if (route.meta && route.meta.roles) return roles.some((role) => route.meta.roles.includes(role));
	else return true;
};

// 缓存多级嵌套数组处理后的一维数组
const setCacheTagsViewRoutes = (arr) => {
	// 先处理有权限的路由，否则 tagsView、菜单搜索中无权限的路由也将显示
	let rolesRoutes = setFilterMenuFun(arr, store.state.userInfo.userInfos.roles);
	store.dispatch(
		'tagsViewRoute/setTagsViewRoutes',
		formatTwoStageRoutes(formatFlatteningRoutes(rolesRoutes))
	);
};

// 多级潜逃数组处理成一维数组
const formatFlatteningRoutes = (arr) => {
	if (arr.length < 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children) {
			arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
		}
	}
	return arr;
};

const formatTwoStageRoutes = (arr) => {
	if (arr.length <= 0) return false;
	const newArr = [];
	const cacheList = [];
	arr.forEach((item) => {
		newArr.push({ ...item });
		cacheList.push(item.name);
		store.dispatch('keepAliveName/setCacheKeepAlive', cacheList);
	});

	return newArr;
};

export { dynamicRouter, setFilterMenuFun, setCacheTagsViewRoutes };
