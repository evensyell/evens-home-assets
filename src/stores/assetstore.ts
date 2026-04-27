import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { db, Asset, Account } from 'src/db/db'

export const useDataStore = defineStore('data', {
	persist: true,

	state: () => ({
		asset_list: [] as Asset[],
		asset_total_worth: 0,

		filteredAssets: [] as Asset[],
		account_list: [] as Account[],
		// records: [],
		// plans: [],
		// 全局状态管理
		loading: false,
	}),

	getters: {
		assetCount: (state) => state.asset_list.length,
		// 高价值资产
		totalAccounts: (s) => s.account_list.reduce((t, i) => t + (+i.balance || 0), 0), //总账户余额
		//整理全部tags，并统计数量
		getAllTags: (s) => {
			const tagMap = new Map<string, number>()

			s.asset_list.forEach((asset) => {
				// 分割并过滤空标签
				const tagList = asset.tag?.split(' ').filter((t) => t.trim() !== '') || []

				tagList.forEach((tag) => {
					tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
				})
			})

			// 转换成你要求的数组格式
			return (
				Array.from(tagMap.entries())
					.map(([tag_name, tag_counter]) => ({ tag_name, tag_counter }))
					// 核心：降序排序（次数多的在前）
					.sort((a, b) => b.tag_counter - a.tag_counter)
			)
		},
	},

	actions: {
		/** 获取所有资产 */
		async fetchAssets() {
			this.loading = true
			try {
				this.asset_list = await db.assets.orderBy('price').reverse().toArray()
				this.filteredAssets = this.asset_list
				await this.calculateTotalWorth()
			} finally {
				this.loading = false
			}
		},

		/** 计算总资产价值 */
		async calculateTotalWorth() {
			const assets = await db.assets.toArray()
			this.asset_total_worth = assets.reduce(
				(sum, item) => sum + (item.price * item.quantity || 0),
				0,
			)
		},

		/** 按分类筛选资产 */
		async filterByCategory(categoryId: number | null) {
			if (!categoryId) {
				this.filteredAssets = this.asset_list
				return
			}
			this.filteredAssets = await db.assets.where('categoryId').equals(categoryId).toArray()
		},

		/** 关键词搜索资产 */
		async searchAssets(keyword: string) {
			if (!keyword.trim()) {
				this.filteredAssets = this.asset_list
				return
			}
			const key = keyword.trim().toLowerCase()
			this.filteredAssets = await db.assets
				.filter((asset) => asset.name.toLowerCase().includes(key))
				.toArray()
		},

		/** 新增资产 */
		async addAsset(asset: Asset) {
			asset.id = uuidv4()
			await db.assets.add(asset)
			await this.fetchAssets()
		},

		/** 更新资产 */
		async patchAsset(id: string, data: Partial<Omit<Asset, 'id'>>) {
			await db.assets.update(id, data)
			await this.fetchAssets()
		},

		/** 删除资产 */
		async deleteAsset(id: string) {
			await db.assets.delete(id)
			await this.fetchAssets()
		},
	},
})
