import Dexie, { Table } from 'dexie'

// ===================== 数据类型定义 =====================

export interface Asset {
	id: string
	name: string

	type: string
	note: null | string
	tag: null | string
	status: string

	price: number
	quantity: number
	unit: null | string

	date_in: string
	date_maintenance: null | string
	date_die: null | string
	date_discard: null | string
}

export interface Account {
	id: string
	name: string
	balance: number
	currency: string
	note: string
}

// ===================== 数据库实例 =====================
export class Database extends Dexie {
	// 声明表类型（TS 强制约束）
	assets!: Table<Asset, string>
	accounts!: Table<Account, string>

	constructor() {
		super('EvensHomeAssets') // 数据库名称

		// 数据库版本 & 表结构/索引定义
		this.version(1).stores({
			assets:
				'id, name, type, note, tag, status, price, quantity, unit, date_in, date_maintenance, date_die, date_discard',
			accounts: 'id, name, balance, currency, note',
		})
	}
}

// 导出全局单例
export const db = new Database()
