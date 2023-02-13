export function formatDate(date, format) {
	let we = date.getDay(); // 星期
	let qut = Math.floor((date.getMonth() + 3) / 3).toString(); // 季度
	const opt = {
		'Y+': date.getFullYear().toString(), // 年
		'm+': (date.getMonth() + 1).toString(), // 月(月份从0开始，要+1)
		'd+': date.getDate().toString(), // 日
		'H+': date.getHours().toString(), // 时
		'M+': date.getMinutes().toString(), // 分
		'S+': date.getSeconds().toString(), // 秒
		'q+': qut, // 季度
	};
	const week = {
		// 中文数字 (星期)
		0: '日',
		1: '一',
		2: '二',
		3: '三',
		4: '四',
		5: '五',
		6: '六',
	};
	const quarter = {
		// 中文数字（季度）
		1: '一',
		2: '二',
		3: '三',
		4: '四',
	};
	if (/(W+)/.test(format)) {
		format = format.replace(RegExp.$1, RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' + week[we] : '周' + week[we]) : week[we]);
	}
	if (/(Q+)/.test(format)) {
		// 输入一个Q，只输出一个中文数字，输入4个Q，则拼接上字符串
		format = format.replace(RegExp.$1, RegExp.$1.length == 4 ? '第' + quarter[qut] + '季度' : quarter[qut]);
	}
	for (let k in opt) {
		let r = new RegExp('(' + k + ')').exec(format);
		if (r) {
			// 若输入的长度不为1，则前面补零
			format = format.replace(r[1], RegExp.$1.length == 1 ? opt[k] : opt[k].padStart(RegExp.$1.length, '0'));
		}
	}
	return format;
}
