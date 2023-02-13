const keepAliveNamesModule = {
	namespaced: true,
	state: {
		keepAliveNameList: [],
	},
	getters: {
		getKeepAliveNameList(state) {
			return state.keepAliveNameList;
		},
	},
	mutations: {
		// 设置路由缓存（name字段）
		getCacheKeepAlive(state, data) {
			state.keepAliveNameList = data;
		},
	},
	actions: {
		// 设置路由缓存（name字段）
		async setCacheKeepAlive({ commit }, data) {
			commit('getCacheKeepAlive', data);
		},
	},
};

export default keepAliveNamesModule;
