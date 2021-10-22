import React from "react";
import { Carousel } from "react-responsive-carousel";

export default ({itemDetail}) => (
  <Carousel infiniteLoop>
   
    {
       itemDetail?
       itemDetail.map((data,index)=>{
        console.log("Map",data)
        return(
          <div >
          <img alt={`image-${index}`} src={data} className="slide-image"/>
        
        </div>
        )
      }):null
    }
   
      </Carousel>
);
