<template>
	<div class="error">
		<div class="error-flex">
			<div class="left">
				<div class="left-item">
					<div class="left-item-animation left-item-num">401</div>
					<div class="left-item-animation left-item-title">您未被授权，没有操作权限~</div>
					<div class="left-item-animation left-item-msg">如有不满请联系你领导</div>
					<div class="left-item-animation left-item-btn">
						<el-button type="primary" @click="onSetAuth">重新授权</el-button>
					</div>
				</div>
			</div>
			<div class="right">
				<img
					src="https://admin-tmpl-test.rencaiyoujia.cn/static/img/401.089007e7.gif?1676616233078"
					alt=""
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { Session } from '@/utils/storage';
export default {
	methods: {
		// 重新授权
		onSetAuth() {
			Session.clear();
			window.location.reload();
		},
	},
};
</script>

<style scoped lang="scss">
.error {
	height: 100%;
	background-color: white;
	display: flex;
	.error-flex {
		margin: auto;
		display: flex;
		height: 500px;
		width: 900px;
		.left {
			flex: 1;
			height: 100%;
			align-items: center;
			display: flex;

			.left-item {
				.left-item-animation {
					opacity: 0;
					animation-name: error-num;
					animation-duration: 0.5s;
					animation-fill-mode: forwards;
				}
				.left-item-num {
					color: #d6e0f6;
					font-size: 55px;
				}
				.left-item-title {
					font-size: 20px;
					color: #333333;
					margin: 15px 0 5px 0;
					animation-delay: 0.1s;
				}
				.left-item-msg {
					color: #c0bebe;
					font-size: 12px;
					margin-bottom: 30px;
					animation-delay: 0.2s;
				}
				.left-item-btn {
					animation-delay: 0.2s;
				}
			}
		}
		.right {
			flex: 1;
			opacity: 0;
			animation-name: error-img;
			animation-duration: 2s;
			animation-fill-mode: forwards;
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
