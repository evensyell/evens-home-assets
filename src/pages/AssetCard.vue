<template>
	<q-card class="cursor-pointer" style="height: 150px" @click="is_show_dialog = true">
		<!-- <q-avatar rounded style="width: 100px; height: 100px" class="absolute-top-right q-ma-sm">
			<img src="https://cdn.quasar.dev/img/avatar.png" />
		</q-avatar> -->

		<!-- 名称与标签 -->
		<q-card-section>
			<div class="ellipsis text-bold">
				<q-badge
					v-if="props.asset.status"
					rounded
					:color="{ 在用: 'light-green', 闲置: 'grey', 断舍离: 'red' }[props.asset.status]"
				/>
				{{ asset.name || '-' }}

				<q-tooltip>({{ asset.status }}) {{ asset.name || '-' }}</q-tooltip>
			</div>

			<q-separator class="q-mt-xs" />

			<div v-if="props.asset.tag" class="q-gutter-xs q-py-sm">
				<q-badge
					v-for="(i, index) in props.asset.tag.split(' ')"
					:key="index"
					:label="i"
					:color="tag_colors[index % tag_colors.length]"
				/>
			</div>
		</q-card-section>

		<!-- 时间与价格 -->
		<q-card-section class="absolute-bottom">
			<q-item-label class="text-caption text-bold">
				{{ `⌛服役 ${cal_daily_cost.days} 天` }}
			</q-item-label>
			<q-item-label class="text-caption">
				{{ `￥${props.asset.price} · ￥${cal_daily_cost.daily_cost}/天` }}
			</q-item-label>
		</q-card-section>
	</q-card>

	<dialog-asset-edit
		:asset="props.asset"
		:is_show_dialog="is_show_dialog"
		@hide="is_show_dialog = false"
	/>
</template>

<script setup lang="ts">
import DialogAssetEdit from './DialogAssetEdit.vue'
import { onMounted, computed, ref } from 'vue'
import type { Asset } from 'src/stores/datastore'

import { date as QDate } from 'quasar'

const is_show_dialog = ref(false)

const tag_colors = [
	'green-3',
	'blue-3',
	'amber-3',
	'purple-3',
	'cyan-3',
	'orange-3',
	'pink-3',
	'teal-3',
	'indigo-3',
	'brown-3',
	'lime-3',
	'violet-3',
]

const props = defineProps<{ asset: Asset }>()

const cal_daily_cost = computed(() => {
	if (!props.asset.date_in || !props.asset.price) return { days: 'N/A', daily_cost: 'N/A' }

	const start = QDate.extractDate(props.asset.date_in.toString(), 'YYYYMMDD')
	const today = new Date() // 获取今天
	// console.log(start, ' - ', props.asset.date_in)

	// 计算相差天数（Quasar 内置方法，干净！）
	const useDays = Math.abs(QDate.getDateDiff(start, today, 'days')) // 日均花费
	const averageCost =
		useDays > 0 ? (props.asset.price / useDays).toFixed(1) : props.asset.price.toFixed(2)

	return { days: useDays, daily_cost: averageCost }
})
</script>
<style lang="scss" scoped>
.q-card,
.q-banner,
.q-table__card.q-btn {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
	&:hover {
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}
}
</style>
