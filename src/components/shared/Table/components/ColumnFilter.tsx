// Third-party imports
import { useCallback } from 'react'
import { Column } from '@tanstack/react-table'

// Custom imports
import { DebouncedInput } from './DebouncedInput'

interface IFilterColumn {
  className?: string
  column: Column<any, unknown>
  style?: React.CSSProperties
}

/* ========================================================================
                                ColumnFilter                
======================================================================== */

export const ColumnFilter = ({
  className = '',
  column,
  style = {}
}: IFilterColumn) => {
  const columnFilterValue = column.getFilterValue()

  const handleChange = useCallback(
    (value: any) => column.setFilterValue(value),
    [column]
  )

  return (
    <DebouncedInput
      className={className}
      ///////////////////////////////////////////////////////////////////////////
      //
      // Gotcha: this will cause infinite rerenders when the onChange function
      // is passed into the useEffect within the DebouncedInput component.
      //
      //   onChange={(value) => column.setFilterValue(value)}
      //
      // The official example actually omits onChange from the dependency array:
      // https://codesandbox.io/s/github/tanstack/table/tree/main/examples/react/filters?from-embed=&file=/src/main.tsx:11571-11580
      //
      //   useEffect(() => { ... }, [value])
      //
      // But that's not really a great practice.
      // A better approach is to wrap it in useCallback
      //
      ///////////////////////////////////////////////////////////////////////////
      onChange={handleChange}
      style={{
        // Resetting user agent stylesheet margins seems to
        // necessitate using both shorthand and longhand.
        margin: 0,
        marginTop: 5,
        marginRight: 'auto',
        marginBottom: 0,
        marginLeft: 'auto',
        ...style
      }}
      value={columnFilterValue ?? ''}
    />
  )
}
