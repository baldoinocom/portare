import { Input } from '@/components/ui/input'
import * as React from 'react'
import ReactInputMask, { Props } from 'react-input-mask'

const InputMask = React.forwardRef<HTMLInputElement, Props>(
  ({ ...props }, ref) => {
    return (
      <ReactInputMask maskChar={props.maskChar || null} {...props}>
        {/* eslint-disable-next-line */}
        {/* @ts-ignore */}
        {(inputProps) => {
          return <Input ref={ref} {...inputProps} {...props} />
        }}
      </ReactInputMask>
    )
  },
)
InputMask.displayName = 'InputMask'

export { InputMask }
