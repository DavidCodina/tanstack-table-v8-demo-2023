import { rankItem } from '@tanstack/match-sorter-utils' // https://www.npmjs.com/package/@tanstack/match-sorter-utils

///////////////////////////////////////////////////////////////////////////
//
// Initially, fuzzyFilter didn't seem to handle numbers well. In case you're wondering where this
// came from, it's the example used by the docs and the code sandbox:
//
//   https://tanstack.com/table/v8/docs/api/features/filters#filter-meta
//   https://codesandbox.io/s/github/tanstack/table/tree/main/examples/react/filters?from-embed=&file=/src/main.tsx:3580-4279
//
//   const fuzzyFilter = (row, columnId, value, addMeta) => {
//     const itemRank = rankItem(row.getValue(columnId), value)
//     addMeta({ itemRank })  // Store the itemRank info
//     return itemRank.passed // Return if the item should be filtered in/out
//   }
//
// For example, using 54 somehow includes the David Codina row becuase of it's date:
// "date_of_birth":"1978-05-09T23:04:32Z"
// The issue seems to be that 51234 satisfies the criteria of 54, which is not what we want.
// The same happens with letters...
//
// Currently, I can't get the built in functions to work. This is likely because
// of an internal bug. However, I have been able to grab one of them, redefine it
// here, and fix the bug.
// https://github.com/TanStack/table/blob/main/packages/table-core/src/filterFns.ts
//
// https://tanstack.com/table/v8/docs/api/features/filters
// Every filter function receives:
// The row to filter
// The columnId to use to retrieve the row's value
// The filter value
//
// Update 01/15/2023: fuzzyFilter seems to be working okay now...
//
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
//
// Something about fuzzyFilter is really weird. Maybe I just don't understand
// what it's intended to do. In any case, suppose we filtered for 'dav'
// This would actually respond back with the following records:
//
//   -	1  David	daveman@gmail.com
//   - 39 Denice	dpieroni12@bravesites.com
//
// It's unclear to me why record 39 is being returned. It seems to be because
// it has 'rav'. Maybe that's the fuzzy part. Ultimately, I need to learn more
// about fuzzy searches: https://www.geeksforgeeks.org/fuzzy-search-in-javascript/
//
// It turns out that fuzzy search is exactly that: https://www.geeksforgeeks.org/fuzzy-search-in-javascript/
// Fuzzy searching matches the meaning, not necessarily the precise wording or specified phrases.
// It performs something the same as full-text search against data to see likely misspellings
// and approximate string matching. it’s a very powerful tool that takes into consideration
// the context of the phrase you wish to look.
//
// So it's a feature not a bug. Nonetheless, I prefer an exact search.
//
///////////////////////////////////////////////////////////////////////////

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
