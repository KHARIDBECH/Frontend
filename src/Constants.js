const prod = {
    url: {
     API_URL: "https://backend-xstc.onrender.com"
     }
   }
   const dev = {
    url: {
     API_URL: "http://localhost:5000"
    }
   };

  //  https://backend-8qoa.onrender.com
  //  export const config = process.env.REACT_APP_ENV === "development" ? dev : prod

   export const config = dev;