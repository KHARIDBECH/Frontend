import React from 'react';
import { Card } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { config } from './Constants'



export default function ProductCard({ data }) {

  const [expanded, setExpanded] = React.useState(false);
  const url = config.url.API_URL
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // const date = new Date(data.postedAt);
  // const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(date);

  //  console.log(typeof(data.postedAt))

  return (

    <Card sx={{
      maxWidth: 345,
      position: "relative",
      maxWidth: "270px",
      minWidth: '260px',
      maxHeight: '330px',
      boxShadow: '-1px -2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
    }}>
       <CardHeader
        sx={{ position:"absolute",right:"0px" }} // Shorter way to set right position (optional)
        action={
          <IconButton aria-label="add to favorites" sx={{ background: "white" }}>
            <FavoriteIcon />
          </IconButton>
        }
      />
      <CardMedia
      component="img"
        sx={{
          height: '170px',
          marginTop: "10px"
         
        }}
        image={data.images ? `${data.images[0]?.url}` : null}
       

      />
      <CardContent sx={{ padding: "16px 16px 0px 16px" }}>
        <Typography variant='body2' >

          <Typography variant="h6" color="textSecondary" component="p">
            ₹ {data.price}
          </Typography>
          <Typography variant="body1" sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: "5px"
          }}>
            {data.title}
          </Typography>
        </Typography>

      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", margin: "0px 16px 0px 16px" }}>
        <Typography variant="caption" display="flex" sx={{
          letterSpacing: "0.002em"
        }}>
          {data.location?.city},{data.location?.state} 
        </Typography>
        <Typography variant="caption" >
          {data?.postedAt && new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(new Date(Number(data.postedAt)))}
        </Typography>
      </Box>
    </Card>

  );
}


