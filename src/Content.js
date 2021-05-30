import {useState,useEffect} from 'react'
import ProductCard from './ProductCard'
import Box from '@material-ui/core/Box';
import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(8),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow:'0px 2px 1px'
    
  },
}));




 function Showmore({showMoreItems}) {
    return (
        <Button variant="outlined" color="primary" style={{marginTop: '5%',
            marginLeft: '42%', marginRight: '47%',paddingLeft: '59px',
    paddingRight:'50px'
           }}>
       <span style={{whiteSpace:'nowrap'}} onClick={showMoreItems}>Show More</span>
      </Button>
    )
}


export default function FixedContainer() {
  const classes = useStyles();
  const [data, setdata] = useState([{}])
  const [visisble, setvisisble] = useState(4)
  const [lengthTrack, setlengthTrack] = useState(4)

      useEffect(() => {
          fetch("http://localhost:5000/api/stuff/",{
          method: 'GET',
          headers: {'Content-Type':'application/json'}
        })
        .then(response=>{
          if (response.status===400) {
            throw Error(response.statusText);
        }
        
        return response.json();
      }
        )
        .then((data)=>{
          
          console.log(data.length)
          setdata(data)
          
        })
        .catch((err)=>{
          console.log("err",err)
        })
             }, [])

     const showMoreItems = ()=>{
    setvisisble((prevValue) => prevValue + 4)
    setlengthTrack((prevValue) => prevValue + 4)
     }        
  return (
    <Box pt={20} style={{position: 'relative',
      top:'288px'
  }}>
      
      <Container fixed >
      <div className={classes.root}>
      
      <Grid container spacing={2} direction="row" justify="space" alignItems="stretch">
       
       {
           data.slice(0,visisble).map((data,index)=>(
            <Grid item xs={3}>
            <ProductCard key = {index} className={classes.paper} data = {data}></ProductCard>
            </Grid>
           ))
       }
       
       
       
      </Grid>
      {
        (lengthTrack<data.length)?<Showmore showMoreItems={showMoreItems}/>:null
      }
      
      
      
    </div>
  
     
      </Container>
     
    </Box>
    
 
  );
}
