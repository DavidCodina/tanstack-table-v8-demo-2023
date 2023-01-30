// Third-party imports
import { useState, useEffect } from 'react'

interface IDebouncedInput
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  debounce?: number
  onChange: (value: any) => void
  value: any
}

/* ========================================================================
                              DebouncedInput              
======================================================================== */
// Imported into both GlobalFilter and ColumnFilter.

export const DebouncedInput = ({
  className = '',
  debounce = 500,
  onChange,
  style = {},
  value: initialValue,
  ...otherProps
}: IDebouncedInput) => {
  const [value, setValue] = useState(initialValue)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof onChange === 'function') {
        onChange(value)
      }
    }, debounce)

    return () => clearTimeout(timeout)
  }, [debounce, onChange, value])

  ///////////////////////////////////////////////////////////////////////////
  //
  // Gotcha! onChange initially caused infinite rerenders
  // The demo example only includes [value] in the dependency array.
  // https://codesandbox.io/s/github/tanstack/table/tree/main/examples/react/filters?from-embed=&file=/src/main.tsx:11571-11580
  // onChange no longer causes infinite rerenders in this implementation because ColumnFilter wraps it in useCallback.
  //
  // For some reason, GlobalFilter didn't have this issue (even without useCallback).
  // Why? Presumably, because setGlobalFilter is a state setter, and won't
  // trigger a rerender whereas in ColumnFilter column.setFilterValue(value)
  // is used... We could wrapped the associated handleChange function in GlobalFilter
  // in useCallback, but it just doesn't seem to need it.
  //
  ///////////////////////////////////////////////////////////////////////////

  /* ======================
          return
  ====================== */

  return (
    <input
      spellCheck={false}
      type='text'
      className={className}
      style={style}
      {...otherProps}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
