import { forwardRef } from 'react'
import clsx from 'clsx'

const VARIANT_CLASS = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  icon: 'btn-icon',
}

const Button = forwardRef(function Button({ variant = 'primary', className, children, ...props }, ref) {
  return (
    <button ref={ref} className={clsx(VARIANT_CLASS[variant], className)} {...props}>
      {children}
    </button>
  )
})

export default Button
