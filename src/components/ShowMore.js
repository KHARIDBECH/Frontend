import React from 'react'
import { Button } from '@mui/material';

export default function ShowMore({showMoreItems}) {
  return (
    <>
  
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
      <Button variant="outlined" color="primary" style={{
        width: '150px'
      }}>
        <span style={{ whiteSpace: 'nowrap' }} onClick={showMoreItems}>Show More</span>
      </Button>
    </div>

    </>
  )
}
