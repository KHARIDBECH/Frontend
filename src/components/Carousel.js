import React from "react";
import { Carousel } from "react-responsive-carousel";

export default function Slider({ itemDetail }) {
  if (!itemDetail || itemDetail.length === 0) return null;

  return (
    <Carousel
      infiniteLoop
      showStatus={false}
      showIndicators={itemDetail.length > 1}
      showThumbs={itemDetail.length > 1}
    >
      {itemDetail.map((data, index) => (
        <div key={index} style={{ aspectRatio: '16/10', backgroundColor: '#f1f5f9' }}>
          <img
            alt={`Product view ${index + 1}`}
            src={data.url}
            className="slide-image"
            style={{ objectFit: 'cover', height: '100%' }}
            fetchpriority={index === 0 ? "high" : "auto"}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
    </Carousel>
  );
}
