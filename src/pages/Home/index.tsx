// Third-party imports
import { useState } from 'react'

// Custom imports
import { HR, Switch, Table, TerminalButton, Waves } from 'components'
import data from './data.json' // https://mockaroo.com
import { columns } from './columns'

/* ========================================================================
                                Home
======================================================================== */
//! Oddly, toggling pagination changes the width of the columns... Not sure why...

const Home = () => {
  // Test potential rerenders of Table. Expected behavior: Table rerenders once
  // for each time count updates, but no useEffect fnctions within Table are triggered.
  const [count, setCount] = useState(0)

  const [titleInfo, setTitleInfo] = useState({
    title: 'An amazing title here!',
    subtitle: "This is an amazing table! It can do lot's of stuff!"
  })

  const [columnOrder, setColumnOrder] = useState<string[]>([])

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({ select: false })

  const [showControls, setShowControls] = useState(true)
  const [showGlobalFilter, setShowGlobalFilter] = useState(true)
  const [showPagination, setShowPagination] = useState(true)

  const [showExportCSVButton, setShowExportCSVButton] = useState(true)

  const [showVisibilityChecks, setShowVisibilityChecks] = useState(false)

  const [showColumnFilters, setShowColumnFilters] = useState(true)
  const [showFooter, setShowFooter] = useState(false)

  /* ======================
     toggleColumnOrder() 
  ====================== */

  const toggleColumnOrder = () => {
    if (columnOrder.length === 0) {
      // An arbitrary ordering for demo purposes.
      // Unknown elements are ignored. Unlisted elements fallback
      // to their default order at the end of the list.
      setColumnOrder(['select', 'id', 'age', 'abc123', 'email'])
    } else {
      setColumnOrder([])
    }
  }

  /* ======================
    toggleSelectColumn() 
  ====================== */

  const toggleSelectColumn = () => {
    setColumnVisibility((previousColumnVisibility) => {
      // The select property could be omitted, which means it is true,
      // assuming onSelectionChange prop has been passed in, thereby
      // enabling the feature.
      if (
        !previousColumnVisibility.hasOwnProperty('select') ||
        previousColumnVisibility.select === true
      ) {
        return {
          ...previousColumnVisibility,
          select: false
        }
      }
      return {
        ...previousColumnVisibility,
        select: true
      }
    })
  }

  /* ======================
    renderDemoControls()
  ====================== */

  const renderDemoControls = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 15,
          justifyContent: 'center',
          marginBottom: 15
        }}
      >
        {/* 

        const [titleInfo, setTitleInfo] = useState({
    title: 'An amazing title here!',
    subtitle: "This is an amazing table! It can do lot's of stuff!"
  })
        
        */}

        <Switch
          checked={showControls}
          id='toggle-title-info'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            if (titleInfo?.title === '') {
              setTitleInfo({
                title: 'An amazing title here!',
                subtitle: "This is an amazing table! It can do lot's of stuff!"
              })
            } else {
              setTitleInfo({
                title: '',
                subtitle: ''
              })
            }

            setShowControls((v) => !v)
          }}
          text='Toggle Title Info'
        />

        <Switch
          checked={showControls}
          id='toggle-controls'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowControls((v) => !v)
          }}
          text='Toggle Controls'
        />

        <Switch
          checked={showGlobalFilter}
          id='toggle-global-filter'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowGlobalFilter((v) => !v)
          }}
          text='Toggle Global Filter'
        />

        <Switch
          id='toggle-pagination'
          checked={showPagination}
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowPagination((v) => !v)
          }}
          text='Toggle Pagination'
        />

        {/*  const [showExportCSVButton, setShowExportCSVButton] = useState(true) */}

        <Switch
          id='toggle-csv-button'
          checked={showExportCSVButton}
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowExportCSVButton((v) => !v)
          }}
          text='Toggle CSV Button'
        />

        <Switch
          id='toggle-column-selection'
          checked={showVisibilityChecks}
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowVisibilityChecks((v) => !v)
          }}
          text='Toggle Column Selection'
        />

        <Switch
          checked={showColumnFilters}
          id='toggle-column-filters'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowColumnFilters((v) => !v)
          }}
          text='Toggle Column Filters'
        />

        <Switch
          checked={columnVisibility?.select !== false}
          id='toggle-select-column'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={toggleSelectColumn}
          text='Toggle Select Column'
        />

        <Switch
          id='toggle-footer'
          checked={showFooter}
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowFooter((v) => !v)
          }}
          text='Toggle Footer'
        />

        <Switch
          checked={columnOrder.length !== 0}
          id='toggle-column-order'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={toggleColumnOrder}
          text='Toggle Column Order'
        />
      </div>
    )
  }

  /* ======================
      renderTable()
  ====================== */

  const renderTable = () => {
    return (
      <Table
        // containerClassName and containerStyle are useful for setting like width, margin, etc.
        // The container element wraps controlsContainer and the tableContainer.
        containerClassName=''
        containerStyle={{
          backgroundColor: '#fff',
          border: '1px solid #409',
          borderRadius: 15,
          boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}
        titleContainerClassName=''
        titleContainerStyle={{ textAlign: 'center' }}
        titleClassName='outline-strong outline-secondary outline-width-1 outline-shadow'
        subtitleClassName=''
        subtitleStyle={{ color: '#409' }}
        titleStyle={{ fontSize: 20 }}
        controlsClassName=''
        controlsStyle={{}}
        // tableContainer is the div that wraps the actual <table> element.
        // Think of this clike the <div className='table-responsive'> wrapper
        // that is often implemented with bootstrap.
        tableContainerClassName=''
        tableStyle={{ fontSize: 12 }}
        tableContainerStyle={{}}
        tableClassName=''
        tableSize='sm' // 'sm' / 'small'
        tableBordered // Adds column lines
        tableBorderless={false} // Removes row lines (tableBordered has precedence).
        // Removes the outer border of the table (has precedence over tableBordered).
        // tableFlush is generally not needed if already using tableBorderless. Generally,
        // you'd want to remove the border from the actual table, and instead pass in a
        // custom border style to the top-level container using containerStyle
        tableFlush
        tableStriped
        // tableHover
        tableHoverPrimary // Has precedence over tableHover - hardcoded to use MainStem's soft primary color.
        tableHighlightSelectedRows // Default: false
        headerClassName=''
        headerStyle={{
          textAlign: 'center',
          verticalAlign: 'middle'
        }}
        thClassName=''
        thStyle={{ color: '#444' }}
        tdClassName=''
        tdStyle={{}}
        // globalFilterClassName='form-control form-control-sm'
        globalFilterStyle={{}}
        // columnFilterClassName='form-control form-control-sm'
        columnFilterStyle={{}}
        // className & style props for pagination.
        // paginationClassName='pagination pagination-sm'
        paginationStyle={{}}
        // paginationItemClassName='page-item'
        paginationItemStyle={{}}
        // paginationButtonClassName='page-link'
        paginationButtonStyle={{}}
        // pageNumberInputClassName='form-control form-control-sm'
        pageNumberInputStyle={{}}
        // pageSizeSelectClassName='form-select form-select-sm'
        pageSizeSelectStyle={{}}
        // exportCSVButtonClassName='btn btn-outline-primary btn-sm'
        // exportCSVButtonStyle={{}}
        // rowSelectCheckboxClassName='form-check-input'
        rowSelectCheckboxStyle={{}}
        // columnSelectCheckboxGroupClassName='form-check'
        columnSelectCheckboxGroupStyle={{}}
        // columnSelectCheckboxClassName='form-check-input'
        columnSelectCheckboxStyle={{}}
        //! bodyClassName='ms-table-group-divider' // Available as CSS class in Table.css, but not as prop.
        bodyStyle={{
          textAlign: 'center',
          verticalAlign: 'middle'
        }}
        //! footerClassName='ms-table-group-divider' // Available as CSS class in Table.css, but not as prop.
        footerStyle={{ textAlign: 'center', verticalAlign: 'middle' }}
        data={data}
        // columnOrder is an optional prop that allows the consumer to
        // dynamically modify the default order of the columns. It works
        // on mount, and anytime thereafter. columnOrder is never set from
        // within, so there's no need to have a callback prop like
        // to update the external state.
        columnOrder={columnOrder}
        // columnVisibility is an optional prop that allows the consumer to
        // dynamically modify the default visibility of the columns. It works
        // on mount, and anytime thereafter.
        columnVisibility={columnVisibility}
        // If one is controlling visibility externally AND also showing the built-in
        // visibility check UI, then it's best to also pass in an onColumnVisibilityChange
        // callback. That way if the internal visibility state changes, we can pass
        // it back to the consuming environment, so the two states remain in sync.
        onColumnVisibilityChange={(newColumnVisibility: any) => {
          setColumnVisibility(newColumnVisibility)
        }}
        pageIndex={1} // Default: 0. Only used during initialization.
        pageSize={10} // Default: 10. Only used during initialization.
        showGlobalFilter={showGlobalFilter} // Default: true.
        // pageSize will revert to the default pageSize when
        // changing showPagination from false to true.
        showPagination={showPagination} // Default: true.
        // Optional: Boolean that allows consumer to opt-in to showing the built-in column
        // select (visibility) checkboxes. Note: it's also possible to build an external
        // checkbox implementation that modifies the external columnVisibility state.
        showExportCSVButton={showExportCSVButton}
        showColumnSelectCheckboxes={showVisibilityChecks} // Default: true
        // If showGlobalFilter, showPagination and showVisibilityChecks are all false,
        // the controls will be hidden. However, a better approach is to use showControls.
        showControls={showControls}
        showColumnFilters={showColumnFilters}
        // If Table does not detect a footer property on the first column in the column
        // definition (i.e., !hasFooter), then showFooter will essentially be disabled.
        showFooter={showFooter} // Default: true
        columns={columns}
        ///////////////////////////////////////////////////////////////////////////
        //
        // Unlike with the global filter and visibility checkboxes,
        // the presence of the row selection column/feature is not determined
        // by a boolean value. Rather, when the onSelectionChange prop
        // is passed in, this indicates to Table that the 'select' column/feature
        // should be implemented. This process occurs at initialization, and
        // therefore can't be dynamically updated.
        //
        // That said, if you want to implement the feature, but not show the column,
        // then you can pass { select: false } to the columnVisibility prop.
        //
        // Internally, table takes the onSelectionChange prop and wraps it in a ref
        // before passing it into useEffect(). This means that there's no need to
        // wrap it in a useCallback() from the consuming environment.
        //
        ///////////////////////////////////////////////////////////////////////////
        onSelectionChange={(selectedData: Record<any, any>[]) => {
          console.log('Selected data:', selectedData)
        }}
        title={titleInfo?.title}
        subtitle={titleInfo?.subtitle}
        // Provide an optional name for the CSV export. Otherwise it defaults to exported-data.csv
        csvExportFileName='mainstem-export'
        // https://github.com/react-csv/react-csv#nested-json-data
        // Passing in csvHeaders allows you to limit what fields are exported.
        // It also allows you to relabel the properties when being exported.
        csvHeaders={[
          { label: 'id', key: 'id' },
          { label: 'First Name', key: 'first_name' },
          { label: 'Last Name', key: 'last_name' }
        ]}
      />
    )
  }

  /* ======================
  renderClickCounterButton()
  ====================== */

  const renderClickCounterButton = () => {
    return (
      <TerminalButton
        // className=''
        onClick={() => setCount((v) => v + 1)}
        style={{ display: 'block', margin: '15px auto' }}
        title='Count button used to test table rerender optimization.'
      >
        COUNT:{count}
      </TerminalButton>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <div style={{ minHeight: '100vh', padding: 25 }}>
      <h1
        className='outline-strong outline-primary outline-width-1 outline-shadow'
        style={{
          fontSize: 50,
          fontWeight: 900,
          lineHeight: 1,
          margin: '0px auto 50px auto',
          textAlign: 'center'
        }}
      >
        Table Demo
      </h1>

      <HR style={{ marginBottom: 50 }} />

      {renderDemoControls()}
      {/* {renderClickCounterButton()} */}
      {renderTable()}

      <Waves />
    </div>
  )
}

export default Home
