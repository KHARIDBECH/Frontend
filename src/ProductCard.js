import React from 'react';

import clsx from 'clsx';
import { Card } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { config } from './Constants'



export default function ProductCard({data}) {

  const [expanded, setExpanded] = React.useState(false);
  const url = config.url.API_URL
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  console.log("image wala",url,data.image)
  return (
    
    <Card sx={{maxWidth: 345,
      boxShadow:'-1px -2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'}}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" sx={{backgroundColor: red[500]}}>
            R
          </Avatar>
        }
        action={
            <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        }
        title={data.title}
        subheader="September 14, 2016"
      />
      <CardMedia
        sx={{ height: 0,
          paddingTop: '56.25%',}}
        image={data.image?`${data.image[0]}`:null}
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
        <span className="itemPrice">₹ {data.price}</span>
        </Typography>
      </CardContent>
      
    </Card>
  
  );
}


