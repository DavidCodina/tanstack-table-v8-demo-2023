// Custom imports
import { DebouncedInput } from './DebouncedInput'

interface IGlobalFilter {
  className?: string
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  style?: React.CSSProperties
}

/* ========================================================================
                              GlobalFilter                  
======================================================================== */

export const GlobalFilter = ({
  className = '',
  globalFilter,
  setGlobalFilter,
  style = {}
}: IGlobalFilter) => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // Unlike in ColumnFilter, GlobalFilter's handleChange doesn't seem to need to
  // be wrapped in a useCallback:
  //
  //   const handleChange = useCallback(
  //     (value) => { setGlobalFilter(String(value)) }, [setGlobalFilter]
  //   )
  //
  // Why? Presumably, because setGlobalFilter is a state setter, and won't
  // trigger a rerender whereas in ColumnFilter column.setFilterValue(value)
  // is used...
  //
  ///////////////////////////////////////////////////////////////////////////

  const handleChange = (value: any) => {
    setGlobalFilter(String(value))
  }

  return (
    <DebouncedInput
      className={className}
      onChange={handleChange}
      placeholder='Search all columns...'
      style={style}
      value={globalFilter ?? ''}
    />
  )
}
