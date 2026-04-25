<template>
	<q-page class="full-width q-pa-md">
		<q-toolbar class="q-px-none">
			<q-file
				v-model="selectedExcelFile"
				label="从Excel导入"
				accept=".xlsx,.xls"
				outlined
				dense
				@update:model-value="loadExcelFile2Json"
			>
				<template v-slot:prepend>
					<q-icon name="mdi-microsoft-excel" color="green" />
				</template>
			</q-file>

			<!-- <q-btn label="已保存" icon="mdi-content-save-check" />
      <q-btn label="未保存" color="red" icon="mdi-content-save-alert" /> -->
		</q-toolbar>

		<!-- 资产列表 -->
		<asset-list />
	</q-page>
</template>

<script setup lang="ts">
import AssetList from './AssetList.vue'
import { onMounted, ref } from 'vue'
import { excelToJson } from './excel2json'

import { useDataStore } from 'src/stores/datastore'
const store = useDataStore()

// Quasar q-file 绑定的文件对象
const selectedExcelFile = ref<File | null>(null)

async function loadExcelFile2Json() {
	const file = selectedExcelFile.value
	if (!file) return

	try {
		const data = await excelToJson(file)
		store.loadAssets(data)
	} catch (err) {
		console.error('解析失败', err)
	}
}

onMounted(() => {})
</script>
