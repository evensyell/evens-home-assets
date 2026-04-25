<template>
	<div class="">
		<!-- 筛选区 -->
		<!-- <div>
			<q-btn-dropdown color="primary" :label="filters.tag_select || '标签筛选'" flat>
				<q-list dense>
					<q-item
						v-for="i in store.getAllTags"
						:key="i.tag_name"
						clickable
						@click="filters.tag_select = i.tag_name"
					>
						{{ i.tag_name }} ({{ i.tag_counter }})
					</q-item>
				</q-list>
			</q-btn-dropdown>

			<q-select
				borderless
				dense
				style="max-width: 150px"
				v-model="filters.tag_select"
				:options="[
					{ label: '全部标签', value: '' },
					...store.getAllTags.map((i) => ({
						label: `${i.tag_name}(${i.tag_counter})`,
						value: i.tag_name,
					})),
				]"
				emit-value
				map-options
			/>

			<q-select
				borderless
				dense
				v-model="filters.status_select"
				:options="[
					{ label: '全部状态', value: '' },
					...['在用', '闲置', '断舍离'].map((i) => ({ label: i, value: i })),
				]"
				emit-value
				map-options
				:display-value="filters.status_select || '全部状态'"
			/>
		</div> -->

		<q-tabs
			v-model="filters.tag_select"
			dense
			align="left"
			outside-arrows
			active-color="primary"
			indicator-color="transparent"
			:breakpoint="0"
		>
			<q-tab name="" label="全部标签" />
			<q-tab
				v-for="i in store.getAllTags"
				:name="i.tag_name"
				:label="`${i.tag_name}(${i.tag_counter})`"
			/>
		</q-tabs>

		<q-tabs
			v-model="filters.status_select"
			dense
			align="left"
			outside-arrows
			active-color="primary"
			indicator-color="transparent"
			:breakpoint="0"
		>
			<q-tab name="" label="全部状态" />
			<q-tab name="在用" label="在用" />
			<q-tab name="闲置" label="闲置" />
		</q-tabs>

		<q-tabs
			v-model="filters.sort"
			dense
			align="left"
			outside-arrows
			active-color="primary"
			indicator-color="transparent"
			:breakpoint="0"
		>
			<q-tab name="" label="默认排序" />
			<q-tab name="date" label="购入日期" />
			<q-tab name="price" label="购入价格" />
		</q-tabs>

		<!-- 资产展示区 -->
		<div class="q-col-gutter-md q-mt-none row" flat bordered>
			<q-intersection
				v-for="i in filter_data"
				class="col-6 col-sm-4 col-md-3 col-lg-2"
				transition="slide-up"
				once
			>
				<asset-card :asset="i" />
			</q-intersection>
		</div>
	</div>
</template>

<script setup lang="ts">
import AssetCard from './AssetCard.vue'
import { computed, reactive } from 'vue'
import { useDataStore } from 'src/stores/datastore'
const store = useDataStore()

const filters = reactive({
	tag_select: '',
	status_select: '',
	sort: '',
})

const filter_data = computed(() => {
	return store.assets
		.filter((i) => {
			return (
				(i.tag?.includes(filters.tag_select) || !filters.tag_select) &&
				(i.status === filters.status_select || !filters.status_select)
			)
		})
		.sort((a, b) => {
			if (filters.sort === 'price') return (b.price || 0) - (a.price || 0)
			if (filters.sort === 'date')
				return new Date(b.date_in || 0).getTime() - new Date(a.date_in || 0).getTime()
			return 0
		})
})
</script>
