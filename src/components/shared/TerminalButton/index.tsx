import './TerminalButton.scss'

/* ========================================================================
                          TerminalButton
======================================================================== */
// https://css-tricks.com/old-timey-terminal-styling/

export const TerminalButton = ({
  children,
  className,
  onClick,
  ...otherProps
}: any) => {
  const handleClick = (e: any) => {
    if (typeof onClick === 'function') {
      onClick(e)
    }
  }

  return (
    <button
      className={`terminal-button${className ? ` ${className}` : ''}`}
      onClick={handleClick}
      {...otherProps}
    >
      {children}
    </button>
  )
}
