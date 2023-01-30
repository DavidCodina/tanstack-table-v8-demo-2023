import './Switch.scss'

/* ========================================================================
                                Switch
======================================================================== */

export const Switch = ({
  checked = false,
  formGroupClassName = '',
  formGroupStyle = {},
  id,
  labelClassName = '',
  labelStyle = {},
  onChange,
  text
}: any) => {
  const handleChange = (e: any) => {
    if (typeof onChange === 'function') {
      onChange(e)
    }
  }

  // The containing <div> will be display: block by default. If you want Switches
  // to be inline, then use a flex box to wrap them or change the display property
  // using formGroupClassName or formGroupStyle
  return (
    <div className={formGroupClassName} style={{ ...formGroupStyle }}>
      <input
        checked={checked}
        className='switch-input'
        id={id}
        name={id}
        onChange={handleChange}
        type='checkbox'
      />
      <label
        className={`switch-label${labelClassName ? ` ${labelClassName}` : ''}`}
        htmlFor={id}
        style={labelStyle}
      >
        {text}
      </label>
    </div>
  )
}
