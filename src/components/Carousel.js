import React from "react";
import { Carousel } from "react-responsive-carousel";
export default function Slider({ itemDetail }) {
  return (

    <Carousel infiniteLoop>

      {
        itemDetail ?
          itemDetail.map((data, index) => {
            return (
              <div >
                <img alt={`image-${index}`} src={`${data.url}`} className="slide-image" />
              </div>
            )
          }) : null
      }

    </Carousel>
  )
} 
