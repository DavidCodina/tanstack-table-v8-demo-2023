import { SCHorizontalRuler } from './styles'

interface IHR {
  color?: string
  style?: React.CSSProperties
}

/* =============================================================================
                                    HR
============================================================================= */

export const HR = ({ color = '', style = {} }: IHR) => {
  return (
    <SCHorizontalRuler color={color} style={style}>
      {[...Array(39)].map((_value, index) => {
        return <hr key={index} />
      })}
    </SCHorizontalRuler>
  )
}
