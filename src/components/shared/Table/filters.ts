import { rankItem } from '@tanstack/match-sorter-utils'

export const fuzzyFilter = (
  row: any,
  columnId: any,
  value: any,
  addMeta: any
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank }) // Store the itemRank info
  return itemRank.passed // Return if the item should be filtered in/out
}

// Unlike fuzzyFilter, this function filters in a more exact manner.
export const includesString = (row: any, columnId: any, value: any) => {
  const search = value.toLowerCase()
  let rowValue = row.getValue(columnId)
  if (typeof rowValue !== 'string') {
    rowValue = rowValue.toString()
  }
  return rowValue.toLowerCase().includes(search)
}
