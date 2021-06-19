import React,{useState} from 'react'
import axios from 'axios';
import { useForm } from "react-hook-form";
import './formstyle.css'
export default function AddDetails(){
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const changeCurrency = (price)=>{
        let temp_price = price
        let lastThree = temp_price.substring(temp_price.length-3);
        let otherNumbers = temp_price.substring(0,temp_price.length-3);
        if(otherNumbers != '')
            lastThree = ',' + lastThree;
        let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return res
    }
    const onSubmit = (data) => {
   
        data.price  =  changeCurrency(data.price)
   
        const options = {
            url: 'http://localhost:5000/api/stuff/postad',
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8'
            },
            data: data
          };
          
          axios(options)
            .then(response => {
              console.log(response.data);
             
             
              alert("Your Ad posted succesfully")
            })
          
    }; // your form submit function which will invoke after successful validation

    // you can watch individual input by pass the name of the input
    
   const currencyConverter = (e)=>{
       

console.log(e)
  }
    return (
        <div className="details-container">
            <div className="form-section" style={{ width: "57%" }}>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-content">
                        <label>Title</label>
                        <input
                            {...register("title", {
                                required: true,
                                maxLength: 35,
                                pattern: /^[A-Za-z]+/i
                            })}
                        />
                    </div>
                    {errors?.title?.type === "required" && <p>This field is required</p>}
                    {errors?.title?.type === "maxLength" && (
                        <p>Title name cannot exceed 20 characters</p>
                    )}
                    {errors?.title?.type === "pattern" && (
                        <p>Alphabetical characters only</p>
                    )}
                    <div className="form-content">
                        <label>Price</label>
                        <input {...register("price", { required: true, min: 0 })} type="number" onChange={currencyConverter}/>
                    </div>
                    {errors?.price?.type === "min" && (
                        <p>Min 0 required</p>
                    )}
                    {errors.price?.type === "required" && (
                        <p>Must provide price</p>
                    )}
                    <div className="form-content">
                        <label>ImageUrl</label>
                        <input {...register("imageUrl", { required: true })}/>
                    </div>
                    {errors.imageUrl?.type === "required" && (
                        <p>Must provide Image URL</p>
                    )}
                    <div className="form-content">
                        <label>Description</label>
                        <textarea {...register("description", {
                            required: true,
                            maxLength: 200,
                        })} style={{
                            resize: "none", height: "93px"
                        }} />
                    </div>
                    {errors.description && (
                        <p>Must provide description about your item</p>
                    )}
                    <div className="form-content">
                        <input type="submit" />
                    </div>
                </form>
            </div>
        </div>
    )
}
