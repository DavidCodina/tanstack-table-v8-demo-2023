import React from 'react'

export interface ITable {
  // Info: className & style props for basic table elements.
  /** There is no internal default value here, so you can add a className without it overwriting a default. */
  containerClassName?: string
  containerStyle?: React.CSSProperties
  /** There is no internal default value here, so you can add a className without it overwriting a default.
   * The className is only applied when the value of title is a string.
   */
  titleContainerClassName?: string
  titleContainerStyle?: React.CSSProperties
  /** There is no internal default value here, so you can add a className without it overwriting a default.
   * The className is only applied when the value of subtitle is a string.
   */
  titleClassName?: string
  /** The styles are only applied when the value of title is a string. */
  titleStyle?: React.CSSProperties
  /** There is no internal default value here, so you can add a className without it overwriting a default. */
  subtitleClassName?: string
  /** The styles are only applied when the value of subtitle is a string. */
  subtitleStyle?: React.CSSProperties
  /** There is no internal default value here, so you can add a className without it overwriting a default. */
  controlsClassName?: string
  controlsStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table-responsive'. Adding this prop will overwrite the internal default. */
  tableContainerClassName?: string
  tableContainerStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table'. Adding this prop will overwrite the internal default. */
  tableClassName?: string
  tableStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table-thead'. Adding this prop will overwrite the internal default. */
  headerClassName?: string
  headerStyle?: React.CSSProperties
  /** There is no internal default value here, so you can add a className without it overwriting a default. */
  thClassName?: string
  thStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table-tbody'. Adding this prop will overwrite the internal default. */
  bodyClassName?: string
  bodyStyle?: React.CSSProperties
  /** There is no internal default value here, so you can add a className without it overwriting a default. */
  tdClassName?: string
  tdStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table-tfoot'. Adding this prop will overwrite the internal default. */
  footerClassName?: string
  footerStyle?: React.CSSProperties

  // Info: className & style props for global/column text input search filters.
  /** Internally, this defaults to 'ms-table-form-control'. Adding this prop will overwrite the internal default. */
  globalFilterClassName?: string
  globalFilterStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table-form-control'. Adding this prop will overwrite the internal default. */
  columnFilterClassName?: string
  columnFilterStyle?: React.CSSProperties

  // Info: className & style props for row/column selection checkboxes.
  /** Internally, this defaults to 'ms-table-form-check-input'. Adding this prop will overwrite the internal default. */
  rowSelectCheckboxClassName?: string
  rowSelectCheckboxStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table-form-check'. Adding this prop will overwrite the internal default. */
  columnSelectCheckboxGroupClassName?: string
  columnSelectCheckboxGroupStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table-form-check-input'. Adding this prop will overwrite the internal default. */
  columnSelectCheckboxClassName?: string
  columnSelectCheckboxStyle?: React.CSSProperties

  // Info: className & style props for pagination.
  /** Internally, this defaults to 'ms-table-pagination'. Adding this prop will overwrite the internal default. */
  paginationClassName?: string
  paginationStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table-page-item'. Adding this prop will overwrite the internal default. */
  paginationItemClassName?: string
  paginationItemStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table-page-link'. Adding this prop will overwrite the internal default. */
  paginationButtonClassName?: string
  paginationButtonStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table-form-control'. Adding this prop will overwrite the internal default. */
  pageNumberInputClassName?: string
  pageNumberInputStyle?: React.CSSProperties
  /** Internally, this defaults to 'ms-table-form-select'. Adding this prop will overwrite the internal default. */
  pageSizeSelectClassName?: string
  pageSizeSelectStyle?: React.CSSProperties

  // Info: className & style props for ExportCSVButton.
  exportCSVButtonClassName?: string
  exportCSVButtonStyle?: React.CSSProperties

  // Info: Table feature style props (akin to Bootstrap table features)
  tableSize?: 'sm' | 'small'
  tableBordered?: boolean
  tableBorderless?: boolean
  tableFlush?: boolean
  tableStriped?: boolean
  tableHover?: boolean
  /** Has precedence over tableHover. The associated .ms-table-hover-primary is hardcoded to use MainStem's soft primary color. */
  tableHoverPrimary?: boolean
  tableHighlightSelectedRows?: boolean

  // Info: TanStack table configuration props.
  columns: Record<string, any>[]
  columnOrder?: string[]
  columnVisibility?: Record<string, boolean>
  data: Record<any, any>[]
  onSelectionChange?: (selectedData: Record<any, any>[]) => void
  onColumnVisibilityChange?: (newColumnVisibility: any) => void
  pageIndex?: number
  pageSize?: number
  pageSizes?: number[]

  // Info: Boolean props for conditionally rendering various UI.
  showControls?: boolean
  showGlobalFilter?: boolean
  /** By default showColumnFilters is set to true. This allows one to dynamically show/hide columen filters.
   * A column filter must first be enabled within the column definition file. This prop merely
   * gives the consumer another layer of control, such that they can hide that feature if desired.
   */
  showColumnFilters?: boolean
  showPagination?: boolean
  showExportCSVButton?: boolean
  showColumnSelectCheckboxes?: boolean
  showFooter?: boolean

  // Info: Random props
  title?: React.ReactNode
  /** A subtitle will only be rendered if a title was also provided. */
  subtitle?: React.ReactNode
  /** Defaults to exported-data.csv */
  csvExportFileName?: string
  /** Passing in csvHeaders allows one to limit what fields are exported.
   * It also allows one to relabel the properties when being exported. */
  csvHeaders?: any[]
}

export interface IControls {
  // Info: className & style props.
  controlsClassName: string
  controlsStyle: React.CSSProperties
  globalFilterClassName: string
  globalFilterStyle: React.CSSProperties
  paginationClassName: string
  paginationStyle: React.CSSProperties
  paginationItemClassName: string
  paginationItemStyle: React.CSSProperties
  paginationButtonClassName: string
  paginationButtonStyle: React.CSSProperties
  pageNumberInputClassName: string
  pageNumberInputStyle: React.CSSProperties
  pageSizeSelectClassName: string
  pageSizeSelectStyle: React.CSSProperties
  exportCSVButtonClassName: string
  exportCSVButtonStyle: React.CSSProperties
  columnSelectCheckboxGroupClassName?: string
  columnSelectCheckboxGroupStyle?: React.CSSProperties
  columnSelectCheckboxClassName: string
  columnSelectCheckboxStyle: React.CSSProperties
  // Info: Other...
  atLeastOneVisibleColumn: boolean
  noControlsShown: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  pageSize: number
  pageSizes: number[]
  showControls: boolean
  showGlobalFilter: boolean
  showPagination: boolean
  showExportCSVButton: boolean
  showColumnSelectCheckboxes: boolean
  /** The table instance returned from useReactTable. */
  table: any
  /** Defaults to exported-data.csv */
  csvExportFileName: string
  /** Passing in csvHeaders allows one to limit what fields are exported.
   * It also allows one to relabel the properties when being exported. */
  csvHeaders?: any[]
}
