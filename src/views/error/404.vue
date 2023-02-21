<template>
	<div class="error-container">
		<div class="error-404">
			<div class="pic-404">
				<img
					class="pic-404__parent"
					src="https://admin-tmpl-test.rencaiyoujia.cn/static/img/404.a57b6f31.png"
					alt=""
				/>
			</div>
			<div class="text-404">
				<div class="text-404__oops">OOPS!</div>
				<div class="text-404__info">All rights reserved</div>
				<div class="text-404__headline">404 Page Not Found</div>
				<div class="text-404__info">
					Please check that the URL you entered is correct, or click the button below to return to
					the homepage.
				</div>
				<div @click="onGoHome" class="text-404__return-home">返回首页</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	methods: {
		onGoHome() {
			this.$router.push('/');
		},
	},
};
</script>

<style scoped lang="scss">
.error-container {
	transform: translate(-50%, -50%);
	position: absolute;
	top: 40%;
	left: 50%;
	.error-404 {
		position: relative;
		width: 1200px;
		padding: 0 50px;
		overflow: hidden;
		.pic-404 {
			position: relative;
			float: left;
			width: 600px;
			overflow: hidden;
			.pic-404__parent {
				width: 100%;
			}
		}
		.text-404 {
			position: relative;
			float: left;
			width: 300px;
			padding: 30px 0;
			overflow: hidden;
			.text-404__oops {
				font-size: 32px;
				line-height: 40px;
				color: #1482f0;
				margin-bottom: 20px;
			}
			.text-404__info {
				font-size: 13px;
				line-height: 21px;
				color: grey;
				margin-bottom: 30px;
			}
			.text-404__headline {
				font-size: 20px;
				line-height: 24px;
				color: #222;
				margin-bottom: 10px;
			}
			.text-404__return-home {
				display: block;
				float: left;
				width: 110px;
				height: 36px;
				background: #1482f0;
				border-radius: 100px;
				text-align: center;
				color: #fff;
				font-size: 14px;
				line-height: 36px;
				cursor: pointer;
			}
		}
	}
}
</style>
