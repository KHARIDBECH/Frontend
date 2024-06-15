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
      maxHeight: '280px',
      boxShadow: '-1px -2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
    }}>
      <CardHeader
        sx={{ position: "absolute", right: "6px" }}

        action={
          <IconButton aria-label="add to favorites" sx={{ background: "white", width: "100%" }}>
            <FavoriteIcon />
          </IconButton>
        }
      // title={data.title}
      // subheader="May 14"
      />
      <CardMedia
        sx={{
          height: 0,
          paddingTop: '56.25%', marginTop: "6px"
        }}
        image={data.image ? `${data.image[0]}` : null}
        title="Paella dish"

      />
      <CardContent sx={{padding:"16px 16px 0px 16px"}}>
        <Box >

          <Typography variant="h6" color="textSecondary" component="p">
            ₹ {data.price}
          </Typography>
          <Typography variant="body1" sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: "5px"
          }}>
            {data.description}
          </Typography>
        </Box>
       
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between",margin: "0px 16px 0px 16px" }}>
          <Typography variant="caption" display="flex" sx={{
            letterSpacing: "0.002em"
          }}>
            NewDelhi, India
          </Typography>
          <Typography variant="caption" >
            {data?.postedAt && new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(new Date(Number(data.postedAt)))}
          </Typography>
        </Box>
    </Card>

  );
}


