import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Carousel from './Carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Avatar from '@material-ui/core/Avatar';
import './ItemDetails.css'
import { makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';
import { config } from './Constants'
const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        borderRadius: "34px",
        backgroundColor: "#bb0467"
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        width: theme.spacing(7),
        height: theme.spacing(7)
    },
}));
export default function ItemDetails() {
    const url = config.url.API_URL
    const [itemDetail, setitemDetail] = useState({})
    const classes = useStyles();
    const { productUrl } = useParams();
    let itemId = productUrl.slice(productUrl.lastIndexOf("-") + 1)
    useEffect(() => {
        fetch(`${url}/api/stuff/itemdetail/${itemId}`)
            .then((res) => res.json())
            .then((data) => {
                setitemDetail(data[0])
                console.log("pakad betichod",data[0])
            })
            .catch((err) => { console.log(err) })
    }, [])
    return (
        <div className="item-detail-container">
            <div className="item-content-section">
                <div className="item-details">
                    <Carousel itemDetail={itemDetail.image}/>
                    <div className="item-detail-description">
                        <div className="details" >
                            <span>Details</span>
                            <div className="detail-attributes">
                             <div className="description">
                                 {itemDetail.description}
                             </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="user-details">
                    <div className="product-detail">
                        <div className="product-content">
                            <h2 style={{ marginTop: '12px' }}>Rs {itemDetail.price}</h2>
                            <p style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: '18px'
                            }}>
                                {/* <span>2017 - 35,818</span> */}
                                <span style={{ marginTop: '7px' }}>{itemDetail.title}</span>
                            </p>
                            {/* <span style={{ marginTop: '18px' }}>Rohini,Delhi Delhi</span> */}
                        </div>
                        <div className="seller-detail">
                            <h2 style={{ marginTop: '19px' }}>Seller description</h2>
                            <div className="profile-detail">
                                <Avatar alt="Remy Sharp" src="/broken-image.jpg" className={classes.orange} />
                                <p className="user-profile-name" style={{ display: 'flex', flexDirection: 'column', marginLeft: '12px' }}><span>Ravi Kumar-OLX auto</span>
                                    <span>Member since Feb 2017</span>
                                </p>
                            </div>
                            <div className="seller-contact"><span>Chat with Seller</span></div>
                            {/* <div className="seller-contact-number"><CallIcon /><span>6390081011</span></div> */}
                        </div>
                    </div>

                </div>

            </div>
        </div >

    )
};



