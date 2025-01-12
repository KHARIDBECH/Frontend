const prod = {
    url: {
     API_URL: "https://backend-1-q12v.onrender.com"
     }
   }
   const dev = {
    url: {
     API_URL: "http://localhost:5000"
    }
   };

 
   export const config = process.env.REACT_APP_ENV === "development" ? dev : prod
