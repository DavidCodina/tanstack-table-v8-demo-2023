// Third-party imports
import { Fragment } from 'react'

// Custom imports
import { GlobalFilter } from './GlobalFilter'
import { ExportCSVButton } from './ExportCSVButton'
import { IControls } from '../types'

/* ========================================================================
                              Controls
======================================================================== */
// None of the props below are given default values here.
// Instead, all default values are set on Table props.

export const Controls = ({
  // className & style props.
  controlsClassName,
  controlsStyle,
  globalFilterClassName,
  globalFilterStyle,
  paginationClassName,
  paginationStyle,
  paginationItemClassName,
  paginationItemStyle,
  paginationButtonClassName,
  paginationButtonStyle,
  pageNumberInputClassName,
  pageNumberInputStyle,
  pageSizeSelectClassName,
  pageSizeSelectStyle,
  exportCSVButtonClassName,
  exportCSVButtonStyle,
  columnSelectCheckboxGroupClassName,
  columnSelectCheckboxGroupStyle,
  columnSelectCheckboxClassName,
  columnSelectCheckboxStyle,
  // Other...
  atLeastOneVisibleColumn,
  noControlsShown,
  globalFilter,
  setGlobalFilter,
  pageSize: pageSizeProp,
  pageSizes, // Note: pageSize will also added to the page size <select> during the mapping process.
  showControls,
  showGlobalFilter,
  showPagination,
  showExportCSVButton,
  showColumnSelectCheckboxes,
  table,
  csvExportFileName,
  csvHeaders
}: IControls) => {
  /* ======================
    renderGlobalFilter()
  ====================== */

  const renderGlobalFilter = () => {
    if (!showGlobalFilter) {
      return null
    }

    return (
      <GlobalFilter
        className={globalFilterClassName || 'ms-table-form-control'}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        style={{ flex: 1, width: 'auto', ...globalFilterStyle }}
      />
    )
  }

  /* ======================
  getPaginationItemClassName()
  ====================== */

  const getPaginationItemClassName = (mode?: 'previous' | 'next') => {
    const canPreviousPage = table.getCanPreviousPage()
    const canNextPage = table.getCanNextPage()
    let classes = paginationItemClassName || 'ms-table-page-item'

    if (mode === 'previous' && !canPreviousPage) {
      classes = `${classes} disabled`
    } else if (mode === 'next' && !canNextPage) {
      classes = `${classes} disabled`
    }

    return classes
  }

  /* ======================
    renderPagination()
  ====================== */

  const renderPagination = () => {
    if (showPagination === false) {
      return null
    }

    return (
      <ul
        className={paginationClassName || 'ms-table-pagination'}
        style={{ margin: 0, ...paginationStyle }}
      >
        {/* First */}
        <li
          className={getPaginationItemClassName('previous')}
          style={paginationItemStyle}
        >
          <button
            className={paginationButtonClassName || 'ms-table-page-link'}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            style={paginationButtonStyle}
            type='button'
          >
            {'«'}
          </button>
        </li>

        {/* Previous */}
        <li
          className={getPaginationItemClassName('previous')}
          style={paginationItemStyle}
        >
          <button
            className={paginationButtonClassName || 'ms-table-page-link'}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            style={paginationButtonStyle}
            type='button'
          >
            {'‹'}
          </button>
        </li>

        {/* In react-pagination-2023 repo I had an elaborate system that enabled numbered
        items to be shown such that there were always a set amount of numbered items
        (e.g., 1, 3, 5, 7). That type of implementation is a bit more complex, and not
        particularly necessary. If we wanted to do that, we would need the following
        two pieces of information.

          - table.getState().pagination.pageIndex (0 based)
          - table.getPageCount()
        
        That said, I'm not really inclined to build it out unless requested... */}

        {/* Show current page: x of n */}
        <li
          className={paginationItemClassName || 'ms-table-page-item'}
          style={paginationItemStyle}
        >
          <div
            className={paginationButtonClassName || 'ms-table-page-link'}
            style={{
              alignItems: 'center',
              backgroundColor: '#fff',
              display: 'flex',
              gap: 5,
              ...paginationButtonStyle
            }}
          >
            <div style={{ color: '#777', flex: '1 0 auto', fontSize: 12 }}>
              <strong className=''>
                {table.getState().pagination.pageIndex + 1}{' '}
              </strong>{' '}
              <span style={{ color: '#999' }}>of</span>{' '}
              <strong className=''>{table.getPageCount()}</strong>
            </div>

            <span style={{ color: '#999', margin: '0 5px' }}>|</span>

            {/* Manually input the page number */}
            <input
              className={pageNumberInputClassName || 'ms-table-form-control'}
              min={1}
              max={table.getPageCount()}
              type='number'
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              placeholder='Page #'
              style={{
                display: 'inline-block',
                fontSize: 10,
                lineHeight: 1,
                margin: 0,
                minHeight: 0,
                padding: 2,
                width: 64,
                ...pageNumberInputStyle
              }}
            />

            {/* Select the pageSize */}
            <select
              className={pageSizeSelectClassName || 'ms-table-form-select'}
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              style={{
                fontSize: 10,
                margin: 0,
                minHeight: 21,
                padding: '2px 2px 2px 6px',
                width: 50,
                ...pageSizeSelectStyle
              }}
            >
              {pageSizes.map((pageSize: number, index: number) => {
                // Include the pageSizeProp, just in case it was not part of
                // pageSizes array. Otherwise, it won't show it on mount.
                const initialPageSize = pageSizeProp

                if (
                  typeof initialPageSize === 'number' &&
                  initialPageSize > pageSize &&
                  initialPageSize < pageSizes[index + 1]
                ) {
                  return (
                    <Fragment>
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                      <option key={initialPageSize} value={initialPageSize}>
                        {initialPageSize}
                      </option>
                    </Fragment>
                  )
                }

                return (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                )
              })}
            </select>
          </div>
        </li>

        {/* Next */}
        <li
          className={getPaginationItemClassName('next')}
          style={paginationItemStyle}
        >
          <button
            className={paginationButtonClassName || 'ms-table-page-link'}
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            style={paginationButtonStyle}
            type='button'
          >
            {'›'}
          </button>
        </li>

        {/* Last */}
        <li
          className={getPaginationItemClassName('next')}
          style={paginationItemStyle}
        >
          <button
            className={paginationButtonClassName || 'ms-table-page-link'}
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            style={paginationButtonStyle}
            type='button'
          >
            {'»'}
          </button>
        </li>
      </ul>
    )
  }

  /* ======================
    renderExportCSVButton()
  ====================== */

  const renderExportCSVButton = () => {
    if (showExportCSVButton === false) {
      return null
    }

    // Get data
    const data = table?.options?.data

    // Get selected data
    const flatRows = table.getSelectedRowModel().flatRows
    const selectedData = flatRows.map((flatRow: any) => {
      return flatRow.original
    })

    const isSelectedData =
      Array.isArray(selectedData) && selectedData.length > 0

    // Set data to selectedData if it exists. Otherwise, default to entire dataset.
    const csvData = isSelectedData ? selectedData : data

    return (
      <ExportCSVButton
        className={exportCSVButtonClassName || 'ms-table-export-csv-button'}
        csvHeaders={csvHeaders}
        data={csvData}
        disabled={false}
        fileName={csvExportFileName}
        style={exportCSVButtonStyle}
      />
    )
  }

  /* ======================
  renderColumnSelectCheckboxes()
  ====================== */

  const renderColumnSelectCheckboxes = () => {
    if (!showColumnSelectCheckboxes) {
      return null
    }

    return (
      <div
        //# Do we want the consumer to be able to modify this?
        // className=''
        style={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: 4,
          display: 'flex',
          flexWrap: 'wrap',
          fontSize: 12,
          gap: 10,
          justifyContent: 'center',
          // Gives it height of 31px, which matches global search and pagination.
          // However, the final height may vary based on font, etc.
          padding: 5.5,
          userSelect: 'none',
          width: '100%'
        }}
      >
        <div
          className={
            columnSelectCheckboxGroupClassName || 'ms-table-form-check'
          }
          style={{
            margin: 0,
            minHeight: 0,
            ...columnSelectCheckboxGroupStyle
          }}
        >
          <input
            className={
              columnSelectCheckboxClassName || 'ms-table-form-check-input'
            }
            id='toggle-all'
            style={{ cursor: 'pointer', ...columnSelectCheckboxStyle }}
            {...{
              type: 'checkbox',
              checked: table.getIsAllColumnsVisible(),
              onChange: table.getToggleAllColumnsVisibilityHandler()
            }}
          />
          <label
            className='form-check-label' //# What about this ??? .............................
            htmlFor='toggle-all'
            style={{ cursor: 'pointer' }}
          >
            Toggle All
          </label>
        </div>

        {table.getAllLeafColumns().map((column: any) => {
          return (
            <div
              className={
                columnSelectCheckboxGroupClassName || 'ms-table-form-check'
              }
              key={column.id}
              style={{
                cursor: 'pointer',
                margin: 0,
                minHeight: 0,
                ...columnSelectCheckboxGroupStyle
              }}
            >
              <input
                id={column.id}
                className={
                  columnSelectCheckboxClassName || 'ms-table-form-check-input'
                }
                style={{ cursor: 'pointer', ...columnSelectCheckboxStyle }}
                {...{
                  type: 'checkbox',
                  checked: column.getIsVisible(),
                  onChange: column.getToggleVisibilityHandler()
                }}
              />{' '}
              <label
                className='ms-table-form-check-label' //# What about this ??? .............................
                htmlFor={column.id}
                style={{ cursor: 'pointer' }}
              >
                {/* 
                This exposes the actual data keys to the end user. This may not be ideal.
                The Table --> Controls component could receive a visibilityCheckLabels 
                array that provides transformations for each associated label. For example:
                [ { id: 'first_name', formatted: 'First Name' }, { id: 'last_name', formatted: 'Last Name'}, ... ]
                */}
                {column.id}
              </label>
            </div>
          )
        })}
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  if (!showControls || noControlsShown) {
    return null
  }

  return (
    <div
      className={controlsClassName}
      style={{
        alignItems: 'flex-start',
        //! Hardcoding the border color will lead to problems if the user ever wants to change the table border color.
        borderBottom: atLeastOneVisibleColumn ? '1px solid #dee2e6' : '',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        padding: 10,
        ...controlsStyle
      }}
    >
      {renderGlobalFilter()}
      {renderPagination()}
      {renderExportCSVButton()}
      {renderColumnSelectCheckboxes()}
    </div>
  )
}
