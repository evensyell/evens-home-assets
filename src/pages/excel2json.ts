import * as XLSX from 'xlsx'

// 定义通用 Excel 行类型（替代 any，完美合规）
export type ExcelRow = Record<string, string | number | boolean | null | undefined>

/**
 * 读取上传的 Excel 文件，转换成 JSON 数组
 * @param file input[type=file] 选中的文件对象
 * @returns Promise<ExcelRow[]> JSON 数组
 */
export function excelToJson(file: File): Promise<ExcelRow[]> {
  return new Promise((resolve, reject) => {
    const excelTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ]

    if (!excelTypes.includes(file.type)) {
      reject(new Error('请上传 Excel 或 CSV 文件'))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const result = e.target?.result
        if (!result || !(result instanceof ArrayBuffer)) {
          reject(new Error('文件读取结果异常'))
          return
        }

        const data = new Uint8Array(result)
        const workbook = XLSX.read(data, { type: 'array' })

        // 安全获取工作表（彻底修复 TS 报错）
        const sheetNames = workbook.SheetNames || []
        if (sheetNames.length === 0) {
          reject(new Error('Excel 文件中没有工作表'))
          return
        }

        const firstSheetName = sheetNames[0]!
        const firstSheet = workbook.Sheets[firstSheetName]

        if (!firstSheet) {
          reject(new Error('工作表为空'))
          return
        }

        const json = XLSX.utils.sheet_to_json(firstSheet)
        resolve(json as ExcelRow[])
      } catch (err) {
        reject(new Error('Excel 解析失败：' + (err as Error).message))
      }
    }

    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsArrayBuffer(file)
  })
}
