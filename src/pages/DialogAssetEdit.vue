<template>
	<dialog-layout-full
		:is_show_dialog="is_show_dialog"
		backdrop-filter="blur(4px)"
		@hide="emit('hide')"
		persistent
	>
		<q-card
			class="q-pa-md q-gutter-y-md bg-blue-grey-1"
			style="max-height: 90%; width: 500px; max-width: 90%"
		>
			<!-- 控件 -->
			<div class="q-gutter-md justify-between row">
				<q-btn
					v-if="props.asset"
					unelevated
					class="text-white radius-10 bg-primary q-mt-none"
					label="提交"
					@click="store.patchAsset(props.asset.id, edit)"
				/>
				<q-btn
					v-else
					unelevated
					class="text-white radius-10 bg-positive q-mt-none"
					label="添加"
					@click="store.addAsset(edit)"
				/>
			</div>

			<q-form class="q-gutter-md">
				<!-- 基础资料 -->
				<q-card class="q-pa-md">
					<q-item-label class="text-caption q-pb-sm text-grey">基础资料</q-item-label>

					<q-input
						v-for="i in [
							{ label: '物品名称', key: 'name' },
							{ label: '备注', key: 'note' },
							{ label: '状态', key: 'status' },
							{ label: '标签', key: 'tag', hint: '*多个标签请用空格分隔' },
						] as { label: string; key: keyof Asset; hint: string }[]"
						v-model="edit[i.key]"
						input-class="text-right"
						dense
						:hide-bottom-space="!i.hint"
						:hint="i.hint || ''"
					>
						<template #prepend>
							<div class="text-body2 text-grey-8">{{ i.label }}</div>
						</template>
					</q-input>
				</q-card>
				<!-- 价值与数量 -->
				<q-card class="q-pa-md">
					<q-item-label class="text-caption q-pb-sm text-grey">价值与数量</q-item-label>

					<q-input
						v-for="i in [
							{ label: '购入单价', key: 'price' },
							{ label: '库存数量', key: 'quantity' },
							{ label: '单位', key: 'unit' },
						] as { label: string; key: keyof Asset }[]"
						v-model="edit[i.key]"
						input-class="text-right"
						dense
					>
						<template #prepend>
							<div class="text-body2 text-grey-8">{{ i.label }}</div>
						</template>
					</q-input>
				</q-card>

				<!-- 时间与生命周期 -->
				<q-card class="q-pa-md">
					<q-item-label class="text-caption q-pb-sm text-grey">
						生命周期 (日期格式：YYYYMMDD)
					</q-item-label>

					<!-- <q-item-label class="text-caption q-pb-sm text-red">
						{{
							[edit.date_in, edit.date_maintenance, edit.date_die, edit.date_discard].every(
								(item) => !item || item.length === 8,
							) || '*有日期不符合格式要求：YYYYMMDD'
						}}
					</q-item-label> -->

					<q-input
						v-for="i in [
							{ label: '购入日期', key: 'date_in' },
							{ label: '质保到期', key: 'date_maintenance' },
							{ label: '变质到期', key: 'date_die' },
							{ label: '断舍离日期', key: 'date_discard' },
						] as { label: string; key: keyof Asset }[]"
						v-model="edit[i.key]"
						input-class="text-right"
						dense
						:maxlength="8"
						:rules="[(val) => !val || val.length == 8 || '*不符合格式要求：YYYYMMDD']"
						lazy-rules
						hide-bottom-space
					>
						<template #prepend>
							<div class="text-body2 text-grey-8">{{ i.label }}</div>
						</template>
					</q-input>
				</q-card>
			</q-form>
		</q-card>
	</dialog-layout-full>
</template>

<script setup lang="ts">
import DialogLayoutFull from 'src/components/DialogLayoutFull.vue'
import { onMounted, computed, ref, watch, reactive } from 'vue'
import { useDataStore } from 'src/stores/assetstore'
const store = useDataStore()
import type { Asset } from 'src/db/db'

// const props = defineProps({
// 	asset: {
// 		type: Asset | null,
// 		default: null,
// 	},
// 	is_show_dialog: {
// 		type: Boolean,
// 		default: false,
// 	},
// })

const edit: Asset = reactive({
	id: null,
	name: null,
	type: null,
	note: null,
	tag: null,
	status: null,

	price: null,
	quantity: null,
	unit: null,

	date_in: null,
	date_maintenance: null,
	date_die: null,
	date_discard: null,

	daily_consumption: null,
})

const props = defineProps<{
	asset: Asset | null
	is_show_dialog: boolean
}>()

const emit = defineEmits(['succss', 'hide'])

const is_show_dialog = computed({
	get() {
		return props.is_show_dialog
	},
	set(val) {
		emit('hide', val)
	},
})

watch(
	() => props.is_show_dialog,
	() => {
		if (props.is_show_dialog) init(props.asset || null)
	},
)

// 初始化
const init = (obj: Asset | null) => {
	console.log('init')

	if (obj) {
		// 修改资产详情初始化
		;(Object.keys(edit) as Array<keyof typeof edit>).forEach((key) => {
			edit[key] = (obj[key] as null) ?? null
		})
	} else {
		// 新增资产初始化
		console.log('null')

		// ;(Object.keys(edit) as Array<keyof typeof edit>).forEach((key) => {
		// 	edit[key] = null
		// })
		edit.quantity = 1
	}
}
</script>
