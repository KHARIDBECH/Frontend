import React from "react";
import { Carousel } from "react-responsive-carousel";
import { config } from './Constants'
export default function Slider({itemDetail}) {
  const url = config.url.API_URL
  return (
    
  <Carousel infiniteLoop>
   
    {
       itemDetail?
       itemDetail.map((data,index)=>{
        console.log("Map",data)
        return(
          <div >
          <img alt={`image-${index}`} src={`${data}`} className="slide-image"/>
        
        </div>
        )
      }):null
    }
   
      </Carousel>
)
} 
