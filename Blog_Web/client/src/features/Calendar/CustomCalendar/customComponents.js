import React from 'react'

const customComponents = {
  dateCellWrapper: (dateCellWrapperProps) => {
    return (
      <div style={style}>
        {dateCellWrapperProps.children}
      </div>
    )
  },
}

export default customComponents