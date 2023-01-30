// Third-party imports
import { Fragment, useRef } from 'react'
// https://www.youtube.com/watch?v=c_pJCw8mLOE
import { CSVLink } from 'react-csv'

/* ========================================================================
                              ExportCSVButton
======================================================================== */

interface IExportCSVButton {
  className?: string
  // https://github.com/react-csv/react-csv#nested-json-data
  csvHeaders?: any[]
  data: any[]
  disabled?: boolean
  fileName?: string
  style?: React.CSSProperties
}

export const ExportCSVButton = ({
  className = '',
  csvHeaders,
  data,
  disabled = false,
  fileName = '',
  style = {}
}: IExportCSVButton) => {
  const csvLinkRef = useRef<any>(null)

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <CSVLink
        data={data}
        // If fileName is provided, but doesn't end in .csv, the package appends it.
        filename={fileName || 'exported-data.csv'}
        // If headers is undefined, then it exports the entire data set.
        headers={csvHeaders}
        ref={csvLinkRef}
        style={{ display: 'none' }}
        target='_blank'
      >
        Hidden CSV Export Link
      </CSVLink>

      <button
        className={className}
        disabled={disabled}
        onClick={() => {
          if (csvLinkRef?.current && csvLinkRef?.current?.link) {
            csvLinkRef.current.link.click()
          }
        }}
        style={style}
        type='button'
      >
        Export To CSV
      </button>
    </Fragment>
  )
}
