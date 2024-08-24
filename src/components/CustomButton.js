import React from 'react'
import { Button } from '@mui/material';

export default function CustomButton({ onClick, text, variant = "outlined",style}){
  return (
    <div style={style}>
      <Button 
        variant={variant}
        style={{
          width: '150px'
        }}
        onClick={onClick}
      >
        <span style={{ whiteSpace: 'nowrap' }} >{text}</span>
      </Button>
     </div>
  );
}
