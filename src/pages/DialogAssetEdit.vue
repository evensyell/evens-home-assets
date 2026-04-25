<template>
	<q-dialog v-model="showDialog" backdrop-filter="blur(4px)" @hide="emit('hide')" persistent>
		<q-card
			class="q-pa-md q-gutter-y-md bg-blue-grey-1"
			style="max-height: 90%; width: 500px; max-width: 90%"
		>
			<!-- 控件 -->
			<div>
				<q-btn
					unelevated
					class="bg-white radius-10 bg-red q-mt-none"
					icon="mdi-close"
					@click="emit('hide')"
				>
					<span class="q-px-sm">关闭</span>
					<q-badge class="bg-grey-4 text-bold text-grey-8">Esc</q-badge>
				</q-btn>
				<q-btn
					unelevated
					class="bg-white radius-10 bg-red q-mt-none"
					icon="mdi-close"
					@click="store.updateAsset(props.asset.id, edit)"
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
	</q-dialog>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch, reactive } from 'vue'
import type { Asset } from 'src/stores/datastore'
import { useDataStore } from 'src/stores/datastore'
const store = useDataStore()

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

const props = defineProps<{
	asset: Asset | null
	is_show_dialog: boolean
}>()

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

const emit = defineEmits(['succss', 'hide'])

const showDialog = computed({
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
	if (obj) {
		;(Object.keys(edit) as Array<keyof typeof edit>).forEach((key) => {
			edit[key] = (obj[key] as null) ?? null
		})
	} else {
		;(Object.keys(edit) as Array<keyof typeof edit>).forEach((key) => {
			edit[key] = null
		})
		edit.quantity = 1
	}
}
</script>
