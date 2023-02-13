const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
	productionSourceMap: false,
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	lintOnSave: false,
	devServer: {
		open: process.env.VUE_APP_OPEN === 'false' ? false : true, // 自动打开浏览器
		port: process.env.VUE_APP_PORT, // 前台代理端口号
		// https: false, // https： {type: Booleam}
		// hotOnly: false, // 热更新
		proxy: {
			// 设置代理
			'/gitee': {
				target: 'https://gitee.com',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/gitee': '',
				},
			},
		},
	},
});
