import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import Box from '@material-ui/core/Box';
import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import { config } from './Constants'
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(8),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0px 2px 1px'

  },
}));




function Showmore({ showMoreItems }) {
  return (
    <Button variant="outlined" color="primary" style={{
      marginTop: '5%',
      marginLeft: '42%', marginRight: '47%', paddingLeft: '59px',
      paddingRight: '50px'
    }}>
      <span style={{ whiteSpace: 'nowrap' }} onClick={showMoreItems}>Show More</span>
    </Button>
  )
}


export default function Content({ searchVal}) {
  const url = config.url.API_URL
  // const url = "http://localhost:5000"

  const classes = useStyles();
  const [data, setdata] = useState([{}])
  const [visible, setvisible] = useState(4)
  const [lengthTrack, setlengthTrack] = useState(4)

  //url logic
  // let splitTitle = productUrl.title.split(" ")
  // productUrl.title = splitTitle.join('-')
  // let dataValue = Object.values(productUrl)
  // let formatedProductUrl = dataValue.join('-')
  // console.log("Formatted",formatedProductUrl)

  //

  useEffect(() => {
    fetch(`${url}/api/stuff/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        if (response.status === 400) {
          throw Error(response.statusText);
        }

        return response.json();
      }
      )
      .then((data) => {
        //url logic
        console.log(data)
        data.map((value) => {
         
          let splitTitle = value.title.split(" ")
          value.title = splitTitle.join('-')
          let idValue = Object.values(value['iid'])
          let modifiedId = idValue.join('')
          value.productUrl = value.title + "id-" + modifiedId
        
        })
        setdata(data)
        console.log(data)

      })
      .catch((err) => {
        console.log("err", err)
      })
  }, [])

  const showMoreItems = () => {
    setvisible((prevValue) => prevValue + 4)
    setlengthTrack((prevValue) => prevValue + 4)
  }
  return (
    <Box pt={20} style={{
      position: 'relative',
      top: '288px'
    }}>

      <Container fixed >
        <div className={classes.root}>

          <Grid container spacing={2} direction="row" justify="space" alignItems="stretch">

            {
              
              data.slice(0,visible).map((data, index) => (
                  <Grid item xs={3}>
                    <Link to={`/item/${data.productUrl}`}>
                      <ProductCard key={index} className={classes.paper} data={data} ></ProductCard>
                    </Link>
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
