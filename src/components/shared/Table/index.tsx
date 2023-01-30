// Third-party imports
import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  InitialTableState,
  ColumnOrderState
} from '@tanstack/react-table'

// Custom imports
import { ColumnFilter, RowSelectCheckbox, Controls } from './components'
import { includesString, fuzzyFilter } from './filters'
import { SCTableContainer } from './styles'
import { ITable } from './types'

/* ========================================================================
                                Table
======================================================================== */

export const Table = ({
  // className & style props for basic table elements.
  containerClassName = '',
  containerStyle = {},
  titleContainerClassName = '',
  titleContainerStyle = {},
  titleClassName = '',
  titleStyle = {},
  subtitleClassName = '',
  subtitleStyle = {},
  controlsClassName = '',
  controlsStyle = {},
  tableContainerClassName = '',
  tableContainerStyle = {},
  tableClassName = '',
  tableStyle = {},
  headerClassName = '',
  headerStyle = {},
  thClassName = '',
  thStyle = {},
  bodyClassName = '',
  bodyStyle = {},
  tdClassName = '',
  tdStyle = {},
  footerClassName = '',
  footerStyle = {},

  // className & style props for global/column text input search filters.
  globalFilterClassName = '',
  globalFilterStyle = {},
  columnFilterClassName = '',
  columnFilterStyle = {},

  // className & style props for row/column selection checkboxes.
  rowSelectCheckboxClassName = '',
  rowSelectCheckboxStyle = {},
  columnSelectCheckboxGroupClassName = '',
  columnSelectCheckboxGroupStyle = {},
  columnSelectCheckboxClassName = '',
  columnSelectCheckboxStyle = {},

  // className & style props for pagination.
  paginationClassName = '',
  paginationStyle = {},
  paginationItemClassName = '',
  paginationItemStyle = {},
  paginationButtonClassName = '',
  paginationButtonStyle = {},
  pageNumberInputClassName = '',
  pageNumberInputStyle = {},
  pageSizeSelectClassName = '',
  pageSizeSelectStyle = {},

  // className & style props for ExportCSVButton.
  exportCSVButtonClassName = '',
  exportCSVButtonStyle = {},

  // Table feature style props (akin to Bootstrap table features)
  tableSize,
  tableBordered = false,
  tableBorderless = false,
  tableFlush = false,
  tableStriped = false,
  tableHover = false,
  tableHoverPrimary = false,
  tableHighlightSelectedRows = false,

  // TanStack table configuration props.
  columns,
  columnOrder: columnOrderProp = [],
  columnVisibility: columnVisibilityProp = {},
  data,
  onSelectionChange,
  onColumnVisibilityChange,
  pageIndex = 0,
  pageSize: pageSizeProp = 10,
  pageSizes = [10, 20, 30, 40, 50], // Note: pageSize will also added to the page size <select> during the mapping process.

  // Boolean props for conditionally rendering various UI.
  showControls = true,
  showGlobalFilter = true,
  showColumnFilters = true,
  showPagination = true,
  showExportCSVButton = true,
  showColumnSelectCheckboxes = true,
  showFooter = true,

  // Random
  title = '',
  subtitle = '',
  csvExportFileName = '',
  csvHeaders
}: ITable) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  // Initialize columnVisibility using columnVisibilityProp.
  // Otherwise default to {}. columnVisibility is always an object columnIds
  // keys and boolean values. A column is visible if the key/value is omitted
  // or if it is set to true. A column is not visible when it's key is listed
  // and the associated value is set to false
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(() => {
    if (typeof columnVisibilityProp === 'object') {
      return columnVisibilityProp
    }
    return {}
  })

  // Initialize columnOrder using columnOrderProp. Otherwise default to [].
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(() => {
    if (Array.isArray(columnOrderProp)) {
      return columnOrderProp
    }
    return []
  })

  // Check the first column to see if it has a footer property.
  // If so, we can assume that all columns have a footer property.
  const firstColumn = Array.isArray(columns) && columns[0] ? columns[0] : {}

  // Used to determine if a footer <th> should be created when building selectableColumn.
  // Also used as part of conditional statement that determines whether or not to render <tfoot>.
  const hasFooter = firstColumn.hasOwnProperty('footer')

  // The presence of the onSelectionChange function is used
  // as a flag to conditionally render a selection column
  const selectable = typeof onSelectionChange === 'function'

  // Wrap onSelectionChange in a ref. Why? it will be used in a useEffect(),
  // but we don't want to rely on the consumer to always wrap it in a useCallback().
  // A hack to get around the useEffect() dependency array is to wrap it in a ref.
  // Ultimately, the goal is to avoid triggering useEffect() when some state in the
  // consuming environment changes, thereby passing in a new instance of
  // onSelectionChange, which would otherwise trigger the useEffecct().
  const onSelectionChangeRef = useRef<any>(onSelectionChange)

  const onColumnVisibilityChangeRef = useRef<any>(onColumnVisibilityChange)

  // Used to return early from useEffect() on mount.
  const firstRenderRef = useRef(true)

  const stringifiedColumnOrderProp = Array.isArray(columnOrderProp)
    ? JSON.stringify(columnOrderProp)
    : JSON.stringify([])

  const stringifiedColumnVisibilityProp =
    typeof columnVisibilityProp === 'object'
      ? JSON.stringify(columnVisibilityProp)
      : JSON.stringify({})

  const dataLength = data.length

  const noControlsShown =
    !showGlobalFilter &&
    !showPagination &&
    !showExportCSVButton &&
    !showColumnSelectCheckboxes

  /* ======================
        Pagination
  ====================== */
  // If showPagination is false, then set pageSize to the length of data.
  // This will work during initialization. However, in order to make
  // the showPagination prop dynamically update, we also do this below
  // the table initialization: if (!showPagination) { table.setPageSize(data.length) }

  const pageSize = showPagination === true ? pageSizeProp : dataLength

  // If showPagination is false, then set pageIndex to 0.
  pageIndex = 0

  /* ======================
      getTableClasses()
  ====================== */
  // This function builds the className string for the <table>
  // element based off of the values from associated props.

  const getTableClasses = () => {
    let classes = tableClassName || 'ms-table'

    // Set table size class (There is no 'lg'/'large')
    if (tableSize === 'sm' || tableSize === 'small') {
      classes = `${classes} ms-table-sm`
    }

    // Set bordered or borderless class
    if (tableBordered === true) {
      classes = `${classes} ms-table-bordered`
    } else if (tableBorderless === true) {
      classes = `${classes} ms-table-borderless`
    }

    if (tableFlush === true) {
      classes = `${classes} ms-table-flush`
    }

    if (tableStriped === true) {
      classes = `${classes} ms-table-striped`
    }

    if (tableHoverPrimary === true) {
      classes = `${classes} ms-table-hover-primary`
    } else if (tableHover === true) {
      classes = `${classes} ms-table-hover`
    }

    return classes
  }

  /* ======================
      Memoize Columns
  ====================== */
  // We can't assume that columns has been memoized, has been stored in state, or
  // is being imported from a static file. For that reason, we still need to wrap
  // it in useMemo() before passing it into the table instance.

  const cols = useMemo(() => {
    return columns
  }, [columns])

  // Because rowSelectCheckboxStyle is an object (i.e., reference type),
  // we have to stringify it before passing it into the useMemo()
  // dependency array. Otherwise, it will cause an infinite rerender.
  const stringifiedRowSelectCheckboxStyle =
    typeof rowSelectCheckboxStyle === 'object'
      ? JSON.stringify(rowSelectCheckboxStyle)
      : JSON.stringify({})

  const colsPlusSelectable = useMemo(() => {
    // Parse stringifiedRowSelectCheckboxStyle back to an object.
    const parsedRowSelectCheckboxStyle = JSON.parse(
      stringifiedRowSelectCheckboxStyle
    )

    const selectableColumn: any = {
      id: 'select',
      header: ({ table }: any) => {
        return (
          <RowSelectCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              className:
                rowSelectCheckboxClassName || 'ms-table-form-check-input',

              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
              style: { cursor: 'pointer', ...parsedRowSelectCheckboxStyle }
            }}
          />
        )
      },
      cell: ({ row }: any) => {
        return (
          <RowSelectCheckbox
            {...{
              checked: row.getIsSelected(),
              className:
                rowSelectCheckboxClassName || 'ms-table-form-check-input',
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
              style: { cursor: 'pointer', ...parsedRowSelectCheckboxStyle }
            }}
          />
        )
      },
      enableSorting: false,
      enableFilter: false
    }

    if (hasFooter) {
      selectableColumn.footer = ({ table }: any) => (
        <RowSelectCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            className:
              rowSelectCheckboxClassName || 'ms-table-form-check-input',
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
            style: { cursor: 'pointer', ...parsedRowSelectCheckboxStyle }
          }}
        />
      )
    }

    return [selectableColumn, ...columns]
  }, [
    columns,
    hasFooter,
    rowSelectCheckboxClassName,
    stringifiedRowSelectCheckboxStyle
  ])

  /* ======================
      Initialize Table
  ====================== */
  // https://tanstack.com/table/v8/docs/api/core/table
  // useReactTable (not useTable) is the new hook for creating a table instance.
  // It now also requires passing in getCoreRowModel. However, beyond
  // that there doesn't seem to be any usage for getCoreRowModel

  const initialState: InitialTableState = {
    pagination: {
      pageIndex: pageIndex,
      pageSize: pageSize
    }
  }

  const table = useReactTable({
    data,
    // If you add an array in here, then it will cause an infinite rerender.
    columns: selectable ? colsPlusSelectable : cols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: { fuzzy: fuzzyFilter },

    // Note: when a change occurs, it usually entails two renders. Why?
    // Presumably, the table updates its internal state causing a render, then
    // it calls the associated setter. I'm not sure if this is actually the
    // case, but I wittled the Table all the way down to just the sorting feature,
    // and it still double-rendered. Thus, it's not an optimization issue related
    // to how I implemented it. Rather, it's just the way it works with Tanstack table.
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    // Unlike with the old react-table (v7), we seem to need
    // to explicitly define the filter function. We should also
    // be able to pass in one of the built-in strings.
    globalFilterFn: includesString,

    // The type defs define this as: sortingFns?: Record<string, SortingFn<any>>
    // However, if we add a custom sortingFn, it will work when used by a
    // column definition, but Typescript seems not to recognize it.
    sortingFns: {
      ///////////////////////////////////////////////////////////////////////////
      //
      // https://tanstack.com/table/v8/docs/api/features/sorting#sorting-functions
      // This is the type signature for every sorting function:
      //
      //   export type SortingFn<TData extends AnyData> = {
      //     (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number
      //   }
      //
      // sortByRawValue is used when the associated value has been transformed from an
      // ISO string to a formatted date, and that new value is being used as the
      // accessor. Why? would it be used as the accesor? Because then global and
      // column filtering will work as expected. However, we need to then fix the
      // sorting such that it uses the original ISO string value.
      //
      // This function will now be accessible from the column definition by
      // using the following property:
      //
      //  sortingFn: 'sortByRawValue' as any
      //
      // It's unlikely that we'll be sorting actual date objects, but if that's the
      // case, there's actually a built-in 'datetime' sorting function.
      //
      ///////////////////////////////////////////////////////////////////////////
      sortByRawValue: (rowA: any, rowB: any, columnId: any): number => {
        ///////////////////////////////////////////////////////////////////////////
        //
        // Strangely, both in the default sorting function and in this one it
        // begins with the desc for numbers, but asc for strings.
        // It will still sort the values correctly (i.e, asc will still be lowest to highest, etc.).
        // It's just the order of the processes is different for different primitives.
        // This is definitely a tanstack table thing, and not coming from the implementation.
        // In any case, sortByRawValue will handle numbers and strings correctly.
        //
        // Where it will struggle is with stringified numbers such that '100' will be considered
        // lower than '20'. This is the expected behavior and also occurs within tanstack table's
        // default sorter. In cases where your data has numbers as string values, the best approach
        // is to probably transform them into numbers from within the accessor function.
        // However, another approach might be to have a specific sorter for them: sortStringAsNumber
        //
        ///////////////////////////////////////////////////////////////////////////
        const valueA = rowA.original[columnId]
        const valueB = rowB.original[columnId]
        return valueA < valueB ? -1 : 1
      },

      // Use this sorter when number values are stored as strings, but you want to sort them
      // as numbers. Alternatively, use the accessor to function to transform the function.
      sortStringAsNumber: (rowA: any, rowB: any, columnId: any): number => {
        // null values are treated as 0.
        // undefined values seem to break the ordering.
        // Basically, Number('') and Number(null) evaluate to 0,
        // but Number(undefined) evaluates to NaN as would Number('sadf').
        //
        // For this reason, I've added a failsafe that converts anything
        // that doesn't convert successfully to a number to 0.
        const isNum = (v: any): v is Number => {
          return typeof v === 'number' && !isNaN(v)
        }

        const valueA = rowA.original[columnId]
        const valueB = rowB.original[columnId]

        let numberA: any = Number(valueA)
        let numberB: any = Number(valueB)

        if (!isNum(numberA)) {
          numberA = 0
        }

        if (!isNum(numberB)) {
          numberA = 0
        }

        return numberA < numberB ? -1 : 1
      }
    },
    ///////////////////////////////////////////////////////////////////////////
    //
    // When the pagination changes, I want to reset the 'go to page' input.
    // However, if we were to use onPaginationChange it would nullify all of
    // the built-in logic and we would have to implement controlled pagination.
    //
    //   https://github.com/TanStack/table/discussions/3898
    //   https://codesandbox.io/s/github/tanstack/table/tree/main/examples/react/pagination-controlled?from-embed=&file=/src/main.tsx:2485-2528
    //   onPaginationChange: setPagination,
    //
    // Fortunately, we don't have to do that, instead we only need to watch
    // pageCount with a useEffect().
    //
    ///////////////////////////////////////////////////////////////////////////
    state: {
      columnFilters,
      globalFilter,
      sorting,
      rowSelection,
      columnVisibility,
      columnOrder
    },
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,

    // https://tanstack.com/table/v8/docs/api/core/table#initialstate
    initialState: initialState
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: false
  })

  /* ======================
     Column Visibility
  ====================== */

  const visibleLeafColumns = table.getVisibleLeafColumns() // => [ ... ]

  // If no columns are visible then we return null in the JSX instead of showing the table.
  const atLeastOneVisibleColumn =
    Array.isArray(visibleLeafColumns) && visibleLeafColumns.length > 0

  const tableSetColumnVisibility = table.setColumnVisibility

  ///////////////////////////////////////////////////////////////////////////
  //
  // This useEffect watches for changes to stringifiedColumnVisibilityProp
  // such that on change, it will call table.setColumnVisibility(). This
  // allows changes to the visible columns to be dynamically passed in
  // from the consuming environment.
  //
  ///////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const parsedColumnVisibilityProp = JSON.parse(
      stringifiedColumnVisibilityProp
    )
    tableSetColumnVisibility(parsedColumnVisibilityProp)
  }, [stringifiedColumnVisibilityProp, tableSetColumnVisibility])

  ///////////////////////////////////////////////////////////////////////////
  //
  // This useEffect() watches for changes to local columnVisibility state.
  // If it changes AND there is a columnVisibilityChange prop, then
  // it executes that callback, passing the internal columnVisibility state
  // back out to the consuming environment. This allows an externally controlled
  // implementation to stay in sync with any internal state changes. The use
  // of a ref here is merely a hack to bypass the useEffect's dependency array
  // such that the function prop doesn't trigger the useEffect on each rerender.
  //
  ///////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (typeof onColumnVisibilityChangeRef.current !== 'function') {
      return
    }

    const handleColumnVisibilityChange = onColumnVisibilityChangeRef.current
    handleColumnVisibilityChange?.(columnVisibility)
  }, [columnVisibility])

  /* ======================
        useEffect()
  ====================== */
  // This useEffect() watches flatRows such that on change it
  // calls the onSelectionChange() prop. Technically, it calls
  // the onSelectionChangeRef.current function if it exists.

  const flatRows = table.getSelectedRowModel().flatRows

  useEffect(() => {
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }

    if (typeof onSelectionChangeRef.current !== 'function') {
      return
    }
    const selectedData = flatRows.map((flatRow) => {
      return flatRow.original
    })
    const handleSelectionChange = onSelectionChangeRef.current
    handleSelectionChange?.(selectedData)
  }, [flatRows])

  /* ======================
        useEffect()
  ====================== */
  // This useEffect() watches changes to columnOrder.
  // columnOrder is passed in as an array, but then gets turned into JSON
  // prior to being passed into the useEffect(). Once inside the useEffect(),
  // it gets parsed back to an array. This is another hack to avoid triggering
  // the dependency array on every render.

  const tableSetColumnOrder = table.setColumnOrder
  useEffect(() => {
    const parsedColumnOrderProp = JSON.parse(stringifiedColumnOrderProp)
    tableSetColumnOrder(parsedColumnOrderProp)
  }, [stringifiedColumnOrderProp, tableSetColumnOrder])

  /* ======================
        useEffect()
  ====================== */
  // This useEffect() watches the showPagination prop.

  const setPageSize = table.setPageSize
  useEffect(() => {
    if (!showPagination) {
      setPageSize(dataLength)
    } else {
      setPageSize(pageSizeProp)
    }
  }, [dataLength, pageSizeProp, showPagination, setPageSize])

  /* ======================
        renderTitle()
  ====================== */

  const renderTitle = () => {
    if (!title) {
      return null
    }

    const titleJSX =
      typeof title === 'string' ? (
        <h2
          className={titleClassName}
          style={{
            fontSize: 16,
            fontWeight: 700,
            lineHeight: 1,
            margin: 0,
            padding: 0,
            textTransform: 'uppercase',
            ...titleStyle
          }}
        >
          {title}
        </h2>
      ) : (
        title
      )

    const subtitleJSX =
      typeof subtitle === 'string' ? (
        <h6
          className={subtitleClassName}
          style={{
            fontSize: 12,
            lineHeight: 1,
            margin: '5px 0px 0px 0px',
            padding: 0,
            ...subtitleStyle
          }}
        >
          {subtitle}
        </h6>
      ) : (
        subtitle
      )

    return (
      <div
        className={titleContainerClassName}
        style={{
          borderBottom: '1px solid #dee2e6',
          padding: 10,
          ...titleContainerStyle
        }}
      >
        {titleJSX}
        {subtitle && subtitleJSX}
      </div>
    )
  }

  /* ======================
    renderTableHeader()
  ====================== */

  const renderTableHeader = () => {
    return (
      <thead
        className={headerClassName || 'ms-table-thead'}
        style={headerStyle}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const columnFilter = (
                <ColumnFilter
                  className={columnFilterClassName || 'ms-table-form-control'}
                  column={header.column}
                  style={{
                    fontSize: 10,
                    lineHeight: 1,
                    margin: 0,
                    maxWidth: 150,
                    minHeight: 0,
                    padding: 2,
                    ...columnFilterStyle
                  }}
                />
              )

              const isSorted = header.column.getIsSorted() // => 'asc' | 'desc' | false

              // The enableSorting prop will not exist if it hasn't been explicitly defined
              // within the column definition. For that reason, we are checking if the value
              // is exactly false. In that case, we set disableSort to true. Otherwise, we
              // assume that column is sortable and set disableSort to false.
              const disableSort =
                header?.column?.columnDef?.enableSorting === false
                  ? true
                  : false

              // The enableColumnFilter property will not exist if it hasn't been
              // explicitly defined within the column definition file.
              const enableFilter =
                header?.column?.columnDef?.enableColumnFilter === true
                  ? true
                  : false

              // If disableSort exists and is true, then render non-sortable <th>.
              if (disableSort) {
                return (
                  <th
                    className={thClassName}
                    colSpan={header.colSpan}
                    key={header.id}
                    style={thStyle}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                    {/* Conditionally render a column filter input. */}
                    {showColumnFilters &&
                    enableFilter &&
                    header.column.getCanFilter() ? (
                      <div>{columnFilter}</div>
                    ) : null}
                  </th>
                )
              }

              // Otherwise, render the clickable/sortable <th> (with optional filtering).
              return (
                <th
                  className={thClassName}
                  colSpan={header.colSpan}
                  key={header.id}
                  style={thStyle}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      // This is a normal react pattern for conditionally rendering props in JSX.
                      {...{
                        style: header.column.getCanSort()
                          ? { cursor: 'pointer', userSelect: 'none' }
                          : {},
                        onClick: header.column.getToggleSortingHandler()
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {{
                        asc: (
                          <div
                            style={{
                              fontSize: 8,
                              margin: '2px 0px 0px 0px',
                              textAlign: 'center'
                            }}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='12'
                              height='12'
                              fill='currentColor'
                              viewBox='0 0 16 16'
                            >
                              <path
                                fillRule='evenodd'
                                d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z'
                              />
                            </svg>
                          </div>
                        ),

                        desc: (
                          <div
                            style={{
                              fontSize: 10,
                              margin: '2px 0px 0px 0px',
                              textAlign: 'center'
                            }}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='12'
                              height='12'
                              fill='currentColor'
                              viewBox='0 0 16 16'
                            >
                              <path
                                fillRule='evenodd'
                                d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z'
                              />
                            </svg>
                          </div>
                        )
                      }[isSorted as string] ?? (
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 'normal',
                            margin: '2px 0px 0px 0px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='12'
                            height='12'
                            fill='currentColor'
                            viewBox='0 0 16 16'
                          >
                            <path d='M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 1 0 1 0V6.435a4.9 4.9 0 0 1 .106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 0 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.035a.5.5 0 0 1-.416-.223l-1.433-2.15a1.5 1.5 0 0 1-.243-.666l-.345-3.105a.5.5 0 0 1 .399-.546L5 8.11V9a.5.5 0 0 0 1 0V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z' />
                          </svg>{' '}
                          Sort
                        </div>
                      )}
                    </div>
                  )}

                  {/* Conditionally render a column filter input. */}
                  {showColumnFilters &&
                  enableFilter &&
                  header.column.getCanFilter() ? (
                    <div>{columnFilter}</div>
                  ) : null}
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
    )
  }

  /* ======================
      renderTableBody()
  ====================== */

  const renderTableBody = () => {
    return (
      <tbody className={bodyClassName || 'ms-table-tbody'} style={bodyStyle}>
        {table.getRowModel().rows.map((row) => {
          const isSelected = row.getIsSelected()

          return (
            <tr
              key={row.id}
              className={
                isSelected && tableHighlightSelectedRows
                  ? 'ms-table-selected-row'
                  : ''
              }
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <td className={tdClassName} key={cell.id} style={tdStyle}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    )
  }

  /* ======================
    renderTableFooter()
  ====================== */

  const renderTableFooter = () => {
    // Return null when no footer is detected in the column definition, or
    // when the showFooter prop is set to false.
    if (!hasFooter || !showFooter) {
      return null
    }

    return (
      <tfoot
        className={footerClassName || 'ms-table-tfoot'}
        style={footerStyle}
      >
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th
                className={thClassName}
                colSpan={header.colSpan}
                key={header.id}
                style={thStyle}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    )
  }

  /* ======================
        renderTable()
  ====================== */

  const renderTable = () => {
    if (!atLeastOneVisibleColumn) {
      return null
    }

    if (!Array.isArray(data) || dataLength === 0) {
      return null
    }

    return (
      <div
        className={tableContainerClassName || 'ms-table-responsive'}
        style={tableContainerStyle}
      >
        <table
          className={getTableClasses()}
          style={{ margin: 0, ...tableStyle }}
        >
          {renderTableHeader()}
          {renderTableBody()}
          {renderTableFooter()}
        </table>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  // If no controls are show and all data columns have been deselected,
  // then Table (table/controls) will be entirely removed from UI.
  if ((!showControls || noControlsShown) && !atLeastOneVisibleColumn) {
    return null
  }

  return (
    <SCTableContainer className={containerClassName} style={containerStyle}>
      {renderTitle()}

      <Controls
        // className & style props.
        controlsClassName={controlsClassName}
        controlsStyle={controlsStyle}
        globalFilterClassName={globalFilterClassName}
        globalFilterStyle={globalFilterStyle}
        paginationClassName={paginationClassName}
        paginationStyle={paginationStyle}
        paginationItemClassName={paginationItemClassName}
        paginationItemStyle={paginationItemStyle}
        paginationButtonClassName={paginationButtonClassName}
        paginationButtonStyle={paginationButtonStyle}
        pageNumberInputClassName={pageNumberInputClassName}
        pageNumberInputStyle={pageNumberInputStyle}
        pageSizeSelectClassName={pageSizeSelectClassName}
        pageSizeSelectStyle={pageSizeSelectStyle}
        exportCSVButtonClassName={exportCSVButtonClassName}
        exportCSVButtonStyle={exportCSVButtonStyle}
        columnSelectCheckboxGroupClassName={columnSelectCheckboxGroupClassName}
        columnSelectCheckboxGroupStyle={columnSelectCheckboxGroupStyle}
        columnSelectCheckboxClassName={columnSelectCheckboxClassName}
        columnSelectCheckboxStyle={columnSelectCheckboxStyle}
        // Other...
        atLeastOneVisibleColumn={atLeastOneVisibleColumn}
        noControlsShown={noControlsShown}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        pageSize={pageSizeProp}
        pageSizes={pageSizes}
        showControls={showControls}
        showGlobalFilter={showGlobalFilter}
        showPagination={showPagination}
        showExportCSVButton={showExportCSVButton}
        showColumnSelectCheckboxes={showColumnSelectCheckboxes}
        table={table}
        csvExportFileName={csvExportFileName}
        csvHeaders={csvHeaders}
      />

      {renderTable()}
    </SCTableContainer>
  )
}
