import request from '@/utils/request';

export function useMenuApi() {
	return {
		getMenuAdmin: (params) => {
			// 本地数据，路径：`/public/xxx.json`
			return request({
				url: './admin.json',
				method: 'get',
				params,
			});
			// 模拟跨域
			// return request({
			// 	url: '/gitee/lyt-top/vue-next-admin-images/raw/master/vue2/admin.json',
			// 	method: 'get',
			// });
		},
		getMenuTest: (params) => {
			// 本地数据，路径：`/public/xxx.json`
			return request({
				url: './test.json',
				method: 'get',
				params,
			});
			// 模拟跨域
			// return request({
			// 	url: '/gitee/lyt-top/vue-next-admin-images/raw/master/vue2/test.json',
			// 	method: 'get',
			// });
		},
	};
}
