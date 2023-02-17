<template>
	<div>
		<el-card shadow="hover" header="在线签名演示">
			<el-button type="primary" size="small" icon="el-icon-edit" @click="onSignCanvasClick"
				>点击进行签名</el-button
			>
		</el-card>
		<el-dialog
			title="在线签名"
			:visible.sync="signVisible"
			:close-on-click-modal="true"
			:close-on-press-escape="true"
			:width="dialogWidth"
		>
			<sign-canvas
				class="sign-canvas"
				ref="SignCanvas"
				:options="options"
				v-model="value"
			></sign-canvas>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="onCancel">取消</el-button>
				<el-button type="danger" size="small" @click="onClear">清空</el-button>
				<el-button type="primary" size="small" @click="onSaveAsImg">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import SignCanvas from 'sign-canvas';
export default {
	name: 'funSignCanvas',
	components: {
		SignCanvas,
	},
	data() {
		return {
			signVisible: false,
			dialogWidth: '',
			value: '',
			options: {
				// isDpr: false, //是否使用dpr兼容高倍屏 [Boolean] 可选
				lastWriteSpeed: 1, //书写速度 [Number] 可选
				lastWriteWidth: 2, //下笔的宽度 [Number] 可选
				lineCap: 'round', //线条的边缘类型 [butt]平直的边缘 [round]圆形线帽 [square]	正方形线帽
				lineJoin: 'bevel', //线条交汇时边角的类型  [bevel]创建斜角 [round]创建圆角 [miter]创建尖角。
				canvasWidth: 730, //canvas宽高 [Number] 可选
				canvasHeight: 460, //高度  [Number] 可选
				isShowBorder: false, //是否显示边框 [可选]
				bgColor: '#e6e6e6', //背景色 [String] 可选
				borderWidth: 1, // 网格线宽度  [Number] 可选
				borderColor: '#ff787f', //网格颜色  [String] 可选
				writeWidth: 5, //基础轨迹宽度  [Number] 可选
				maxWriteWidth: 30, // 写字模式最大线宽  [Number] 可选
				minWriteWidth: 5, // 写字模式最小线宽  [Number] 可选
				writeColor: '#101010', // 轨迹颜色  [String] 可选
				isSign: true, //签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
				imgType: 'png', //下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的
			},
		};
	},
	mounted() {
		this.initSignConfig();
		window.addEventListener('resize', this.initSignConfig);
	},
	methods: {
		// 初始化配置信息
		initSignConfig() {
			this.dialogWidth = `${document.body.offsetWidth / 2 + 40}px`;
			this.options.canvasWidth = document.body.offsetWidth / 2;
			this.options.canvasHeight = document.body.offsetHeight / 2;
		},
		// 打开弹窗
		onSignCanvasClick() {
			this.signVisible = true;
		},
		// 取消签名
		onCancel() {
			this.signVisible = false;
			this.onClear();
		},
		// 清空签名
		onClear() {
			this.$refs.SignCanvas.canvasClear();
		},
		// 保存
		onSaveAsImg() {
			const img = this.$refs.SignCanvas.saveAsImg();
			console.log(img);
			this.signVisible = false;
		},
	},
	destroyed() {
		window.removeEventListener('resize', this.initSignConfig);
	},
};
</script>

<style></style>
