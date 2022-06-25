import React from 'react'

const SelectButton = ({props,onClick,selected}) => {
  return (
    <span onClick={onClick} style={{
        cursor: 'pointer',
        caretColor: 'transparent',
        fontSize: '18px',
        fontFamily:'Ubuntu',
        fontWeight: '600',
        border:'2px solid #FFC300',
        padding:'8px',
        borderRadius: '8px',
        backgroundColor: selected ? '#FFC300' : '#000814',
        color: selected ? '#000814' : '#fff',
        '&:hover' : {
            backgroundColor: '#FFD60A',
            color: '#000814'
        }
    }}>{props}</span>
  )
}

export default SelectButton