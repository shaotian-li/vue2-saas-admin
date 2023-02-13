<template>
	<div>
		<template v-for="item in chilData">
			<el-submenu
				:index="item.path"
				:key="item.path"
				v-if="item.children && item.children.length > 0"
			>
				<template slot="title">
					<i :class="item.meta.icon"> </i>
					<span>{{ $t(item.meta.title) }}</span>
				</template>
				<sub-item :chilData="item.children" />
			</el-submenu>
			<template v-else>
				<el-menu-item :index="item.path" :key="item.path">
					<template v-if="!item.meta.isLink || (item.meta.isLink && item.meta.isIframe)">
						<i :class="item.meta.icon ? item.meta.icon : ''"></i>
						<span>{{ $t(item.meta.title) }}</span>
					</template>
					<template v-else>
						<a :href="item.meta.isLink" target="_blank">
							<i :class="item.meta.icon ? item.meta.icon : ''"></i>
							{{ $t(item.meta.title) }}
						</a>
					</template>
				</el-menu-item>
			</template>
		</template>
	</div>
</template>

<script>
export default {
	name: 'subItem',
	props: {
		chilData: {
			type: Array,
			default() {
				return [];
			},
		},
	},
};
</script>

<style></style>
