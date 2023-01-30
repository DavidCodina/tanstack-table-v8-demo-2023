// Third-party imports
import { HTMLProps, useEffect, useRef } from 'react'

interface IIndeterminateCheckbox extends HTMLProps<HTMLInputElement> {
  indeterminate?: boolean
}

/* ========================================================================
                            RowSelectCheckbox
======================================================================== */
// The TanStack table examples call this IndeterminateCheckbox,
// but it's more semantic to name it rowSelectCheckbox.

export const RowSelectCheckbox = ({
  className = '',
  indeterminate,
  style = {},
  ...otherProps
}: IIndeterminateCheckbox) => {
  // null! is a hack to avoid having to make a conditional check within useEffect().
  const ref = useRef<HTMLInputElement>(null!)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !otherProps.checked && indeterminate
    }
  }, [ref, indeterminate, otherProps.checked])

  /* ======================
          return
  ====================== */

  return (
    <input
      className={className}
      ref={ref}
      style={style}
      type='checkbox'
      {...otherProps}
    />
  )
}
