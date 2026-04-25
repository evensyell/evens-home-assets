import { defineStore } from 'pinia'

import { db } from 'src/db/db'

export const useDataStore = defineStore('data', {
	persist: true,

	state: () => ({
		assets: [],
		accounts: [],
		// records: [],
		// plans: [],
		// 全局状态管理
		loading: false,
	}),

	getters: {
		totalAssets: (s) => s.assets.reduce((t, i) => t + (i.price || 0), 0), //总资产价值
		totalAccounts: (s) => s.accounts.reduce((t, i) => t + (+i.balance || 0), 0), //总账户余额
		//整理全部tags，并统计数量
		getAllTags: (s) => {
			const tagMap = new Map<string, number>()

			s.assets.forEach((asset) => {
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
		async fetchCategories() {
			this.loading = true
			try {
				this.categoryList = await db.categories.orderBy('id').toArray()
			} finally {
				this.loading = false
			}
		},

		/** 新增分类 */
		async addCategory(category: Omit<ICategory, 'id'>) {
			const id = await db.categories.add(category)
			await this.fetchCategories()
			return id
		},

		/** 更新分类 */
		async updateCategory(id: number, data: Partial<Omit<ICategory, 'id'>>) {
			await db.categories.update(id, data)
			await this.fetchCategories()
		},

		/** 删除分类 */
		async deleteCategory(id: number) {
			await db.categories.delete(id)
			await this.fetchCategories()
		},
	},
})
