import 'core-js'
import React, { useEffect } from 'react'
import { ConfigContext } from '../config-provider'
import classnames from 'classnames'

interface S {
  a: string
}

export interface ButtonProps {
  prefixCls: string
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
  } = props
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('btn', customizePrefixCls);
  useEffect(() => {
    const t = new Promise((resolve) => {
      setTimeout(() => {
        resolve(2)
      }, 1000)
    })
  }, [])

  return (
    <button
      onClick={props.onClick}
      className={classnames(
        prefixCls
      )}
    >
      button
    </button>
  )
}

export default Button