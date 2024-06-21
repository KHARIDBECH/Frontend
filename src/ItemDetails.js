import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Carousel from './Carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './ItemDetails.css'
import { deepOrange } from '@mui/material/colors';
import { config } from './Constants'
import { Grid, Container, Typography, Avatar } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import { Button } from '@mui/material';

export default function ItemDetails() {
    const url = config.url.API_URL
    // const url = "http://localhost:5000"
    const [itemDetail, setitemDetail] = useState({})
    const { productUrl } = useParams();
    let itemId = productUrl.slice(productUrl.lastIndexOf("-") + 1)
    useEffect(() => {
        fetch(`${url}/api/stuff/itemdetail/${itemId}`)
            .then((res) => res.json())
            .then((data) => {
                setitemDetail(data[0])
                console.log("pakad betichod", data[0])
            })
            .catch((err) => { console.log(err) })
    }, [])
    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <Carousel itemDetail={itemDetail.image} />

                    <Paper elevation={3} sx={{
                        minHeight: "100px",
                        padding: "15px",
                        width: "100%",
                        boxSizing: "border-box"
                    }}>
                        <Typography variant="h6">Details</Typography>
                        <Typography variant="body2">{itemDetail.description}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container direction="column" spacing={2}>
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ padding: "20px" }}>
                                <Typography variant="h5">Rs {itemDetail.price}</Typography>
                                <Typography variant="body2">{itemDetail.title}</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{
                                padding: "20px", display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "140px"
                            }}>
                                <Typography variant="h6">Seller description</Typography>
                                <Box display="flex" gap={2}>
                                    <Avatar alt="Remy Sharp" src="/broken-image.jpg" />
                                    <Typography variant="body2">
                                        <span>Ravi Kumar-OLX auto</span>
                                        <br />
                                        <span>Member since Feb 2017</span>
                                    </Typography>
                                </Box>
                                <Button variant="outlined" color="primary" fullWidth={true}>Chat with Seller</Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>

    )
};



