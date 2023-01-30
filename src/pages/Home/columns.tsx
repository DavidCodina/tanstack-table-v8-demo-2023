import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// What's new in v8? columns used to have an accessor property. Now it's called accessorKey.
// See here: https://tanstack.com/table/v8/docs/api/core/column-def
//
// Also, header and footer need not be capitalized.
// We can still write out the columns manually, but now there's a createColumnHelper() function
// that is designed to help us and maximize type safety. Personally, I don't really like this
// because it makes it more difficult to see what's going on. In any case, you can log the
// output to see what it's actually generating:
//
///////////////////////////////////////////////////////////////////////////

type Person = {
  id: number
  first_name: string
  last_name: string
  date_of_birth: string
  country: string
  phone: string
  email: string
  age: number
  isCool: boolean
}

const columnHelper = createColumnHelper<Person>()

export const columns /* : ColumnDef<Person, any>[] */ = [
  columnHelper.accessor('id', {
    // cell: (info) => info.getValue(),
    cell: (info: any) => (
      // In previous examples, I used renderValue(), but the docs use getValue().
      // I'm  not sure what the difference is.
      <span style={{ fontWeight: 'bold' }}>{info.renderValue()}</span>
    ),
    header: (_info) => {
      // Putting a log statement here is a good place to check for infinite
      // rerenders that might result from accidentally forgetting to memoize
      // an array, object, function, etc.
      return <span>ID</span>
    },
    footer: (_info) => <span>ID</span>,
    enableSorting: false // Use this to disable sorting on a column
  }),

  ///////////////////////////////////////////////////////////////////////////
  //
  // Gotcha: Boolean values always need to be formatted.
  // Default sorting works well because they are treates as 0 and 1.
  // However, filtering won't work. This means that we don't actually
  // want to use cell to format the value:
  //
  // columnHelper.accessor('isCool', {
  //   cell: (info) => {
  //     return info.getValue() === true ? 'true' : 'false'
  //   },
  //   header: (_info) => 'Is Cool',
  //   footer: (_info) => 'Is Cool'
  // }),
  //
  // Instead use the accessor. In this case, the string 'false' just so happens to
  // be lower in sort order than 'true', so the default sorter still works
  // correctly against boolean values when they are converted to strings.
  // Thus, unlike ISO date formatting, booleans do not need to implement:
  //
  //   sortingFn: 'sortByRawValue' as any
  //
  // You could, but it wouldn't make a difference in th outcome.
  //
  ///////////////////////////////////////////////////////////////////////////

  columnHelper.accessor(
    (row) => {
      const isCool = row.isCool
      return isCool === true ? 'true' : 'false'
    },
    {
      id: 'isCool',
      header: (_info) => 'Is Cool',
      footer: (_info) => 'Is Cool'
    }
  ),

  columnHelper.accessor('first_name', {
    cell: (info) => info.getValue(),
    header: (_info) => 'First Name',
    footer: (_info) => 'First Name'
  }),

  // This is merely demonstrating a different approach to implementation.
  columnHelper.accessor((row) => row.last_name, {
    id: 'last_name',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (_info) => 'Last Name'
  }),

  ///////////////////////////////////////////////////////////////////////////
  //
  // If we modified the cell output, then the filter function would still
  // filter by the original value:
  //
  // columnHelper.accessor('date_of_birth', {
  //   cell: (info) => {
  //     let value: any = info.getValue()
  //     if (typeof value === 'string') {
  //       value = new Date(value)
  //       return format(value, 'MM/dd/yyyy')
  //     }
  //     return value
  //   },
  //   header: (_info) => 'Date of Birth',
  //   footer: (_info) => 'Date of Birth',
  //   enableColumnFilter: true
  // }),
  //
  // That could be confusing for the end user. Initially, I thought the solution
  // was to  return the formatted value from accessorFn. This makes it so the
  // formatted value is also used for filtering.
  //
  // https://tanstack.com/table/v8/docs/guide/column-defs#accessor-functions
  // columnHelper.accessor(
  //   (row) => {
  //     const DOB = row.date_of_birth
  //     const formatted = format(new Date(DOB), 'MM/dd/yyyy')
  //     return formatted
  //   },
  //   {
  //     id: 'date_of_birth',
  //     header: (_info) => 'Date of Birth',
  //     footer: (_info) => 'Date of Birth',
  //     enableColumnFilter: true
  //   }
  // ),
  //
  // But now the filtering works as expected, but the sorting will be broken.
  // So... What do we do? The solution is to also use a custom sorting function.
  // Why not use a custom filter function? Because we also want the global filter
  // to work with the formatted value.
  //
  ///////////////////////////////////////////////////////////////////////////

  // https://tanstack.com/table/v8/docs/guide/column-defs#accessor-functions
  columnHelper.accessor(
    (row) => {
      const DOB = row.date_of_birth
      const formatted = format(new Date(DOB), 'MM/dd/yyyy')
      return formatted
    },
    {
      id: 'date_of_birth',
      header: (_info) => 'Date of Birth',
      footer: (_info) => 'Date of Birth',
      enableColumnFilter: true,
      ///////////////////////////////////////////////////////////////////////////
      //
      // Typescript will complain if you don't give it a built-in sortingFn.
      // https://tanstack.com/table/v8/docs/api/features/sorting
      // The docs indicate that: the final list of sorting functions
      // available for the columnDef.sortingFn use the following type:
      //
      // export type SortingFnOption<TData extends AnyData> =
      //   | 'auto'
      //   | SortingFns
      //   | BuiltInSortingFns
      //   | SortingFn<TData>
      //
      // I'm not sure if there's anything that can currently be done for this
      // other than setting it to any. There's not really a way that Typescript
      // COULD automatically know what the custom sorters are. This data gets
      // passed in to the table instance at the same time as the sortingFn does.
      //
      ///////////////////////////////////////////////////////////////////////////
      sortingFn: 'sortByRawValue' as any
    }
  ),

  // Gotcha: Using columnHelper.display({ ... }) breaks the sorting feature.
  // https://tanstack.com/table/v8/docs/guide/column-defs#column-helpers
  // Display columns do not have a data model which means they cannot be sorted,
  // filtered, etc, but they can be used to display arbitrary content in the table, eg.
  // a row actions button, checkbox, expander, etc.
  columnHelper.accessor('country', {
    cell: (info) => info.getValue(),
    header: (_info) => 'Country',
    footer: (_info) => 'Country'
  }),

  columnHelper.accessor('phone', {
    cell: (info) => info.getValue(),
    header: (_info) => 'Phone',
    footer: (_info) => 'Phone'
  }),
  columnHelper.accessor('email', {
    cell: (info) => info.getValue(),
    header: (_info) => 'Email',
    footer: (_info) => 'Email'
  }),

  // Strangely, the default sorting function will do desc, asc, none for numbers.
  // However, it will to asc, desc, none for strings.
  // Ultimately, the results are consistent but it's odd that the order isn't.
  // This may be because the table core reconizes type number and uses a different
  // built-in sorter on it.
  columnHelper.accessor('age', {
    cell: (info) => info.getValue(),
    header: (_info) => 'Age',
    footer: (_info) => 'Age'
  })
]

/* ======================
    columnsAlternate
====================== */

export const columnsAlternate = [
  {
    header: 'Id', // This is the label for the <th> in the <thead> / 'Header'
    footer: 'Id', // This is the label for the <th> in the <tfoot> / 'Footer'

    // https://tanstack.com/table/v8/docs/guide/column-defs#column-formatting--rendering
    // If you want, you can customize the cell JSX.
    // The same can be done with header and footer.
    cell: (props: any) => {
      // return <span style={{ fontWeight: 'bold' }}>{props.row.original.id}</span>
      // return <span style={{ fontWeight: 'bold' }}>{props.cell.getValue()}</span>

      return <span style={{ fontWeight: 'bold' }}>{props.renderValue()}</span>
    },

    // This is the object key for the value that we want to output in <td> / 'Cell'
    // It corresponds to object property names in MOCK_DATA.
    accessorKey: 'id',
    disableSort: true
  },
  {
    header: 'First Name',
    footer: 'First Name',
    accessorKey: 'first_name',
    // This is a custom property that allows us to opt in to column filtering,
    // rather than opting out each time in the column definition. The table
    // looks for this property and then only renders the column filter as needed.
    enableFilter: true
    // I'm not sure why, but we don't seem to need to include the
    // filter function. It may actually default to the globalFilterFn
    // filterFn: includesString
  },
  {
    header: 'Last Name',
    footer: 'Last Name',
    accessorKey: 'last_name'
  },
  {
    header: 'Date of Birth',
    footer: 'Date of Birth',
    accessorKey: 'date_of_birth',
    enableFilter: true,
    accessorFn: (originalRow: any, _index: any) => {
      const DOB = originalRow.date_of_birth
      const formatted = format(new Date(DOB), 'MM/dd/yyyy')
      return formatted
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // If we modified the cell output, then the filter function would still
    // filter by the original value. Generally, that's probably not what we
    // want to do because it would confuse the end user. Instead, we can
    // return the formatted value from accessorFn. This makes it so the
    // formatted value is also used for filtering (and presumably sorting).
    // Thus, don't do this:
    //
    //   cell: (info) => {
    //     let value = info.getValue()
    //     if (typeof value === 'string') {
    //       value = new Date(value)
    //       return format(value, 'MM/dd/yyyy')
    //     }
    //    return value
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////
  },
  {
    header: 'Country',
    footer: 'Country',
    accessorKey: 'country'
  },
  {
    header: 'Phone',
    footer: 'Phone',
    accessorKey: 'phone'
  },
  {
    header: 'Email',
    footer: 'Email',
    accessorKey: 'email'
  },
  {
    header: 'Age',
    footer: 'Age',
    accessorKey: 'age'
  }
]
