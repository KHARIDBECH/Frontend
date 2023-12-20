import React, { useState, useEffect,useContext,AuthContext} from 'react'
import axios from 'axios';
import './AdsDetails.css'
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import Cookies from 'js-cookie'
import { config } from './Constants'
export default function AddDetails() {
    const url = config.url.API_URL
    const [formData, setformData] = useState({})
    // const [user,setuser] = useContext(AuthContext);
    const changeCurrency = (price) => {
        let temp_price = price
        let lastThree = temp_price.substring(temp_price.length - 3);
        let otherNumbers = temp_price.substring(0, temp_price.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return res
    }

    const handleChange = (e) => {
        if (e.target.name == 'images') {
            setformData({ ...formData, [`${e.target.name}`]: e.target.files })
        }
        else {
            setformData({ ...formData, [`${e.target.name}`]: e.target.value })
        }


    }


    const handleSubmit = (e) => {
        e.preventDefault()
        const finalData = new FormData();
        finalData.append('title', formData.title);
        finalData.append('description', formData.description);
        finalData.append('price', changeCurrency(formData.price));
        for (let i = 0; i < (formData.images).length; i++) {
            finalData.append(`images`, formData.images[i]);
        }

        const options = {
            url: `${url}/api/stuff/postad`,
            method: 'POST',
            data: finalData,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'authorization': 'Bearer ' + Cookies.get('Token')
            }
        };

        axios(options)
            .then(response => {
                console.log("response wala", response.data);


                alert("Your Ad posted succesfully")
            })

    };
    const currencyConverter = (e) => {


        console.log(e)
    }
    const SignupSchema = Yup.object().shape({
        title: Yup.string()
            .required('Required'),
        price: Yup.number()
            .required('Required'),
        description: Yup.string()
            .required('required')

    });

    return (
        <div className="details-container">
            <div className="form-section" style={{ width: "57%" }}>
                <Formik
                    initialValues={formData}
                    validationSchema={SignupSchema}
                    onSubmit={values => {

                        console.log(values);
                    }}>
                    {({ errors, touched }) => (
                        <form onSubmit={handleSubmit} >
                            <div className="form-content">
                                <div className="form-row">
                                    <label>Title</label>
                                    <Field name="title" type="text" id="title"
                                        value={formData.title}
                                        onChange={handleChange} />
                                    {errors.title && touched.title ? (
                                        <div>{errors.title}</div>
                                    ) : null}
                                </div>
                                <div className="form-row">
                                    <label>price</label>
                                    <Field name="price" type="number" id="number"
                                        value={formData.price}
                                        onChange={handleChange} />
                                    {errors.price && touched.price ? (
                                        <div>{errors.price}</div>
                                    ) : null}

                                </div>
                                <div className="form-row">
                                    <label>description</label>
                                    <textarea name="description" type="text" id="text"
                                        value={formData.description}
                                        onChange={handleChange} maxlength="200" />
                                    {errors.description && touched.description ? (
                                        <div>{errors.description}</div>
                                    ) : null}

                                </div>
                                <div className="form-row">
                                    <input type='file' id='file' name='images' multiple onChange={handleChange}></input>
                                </div>
                                <button type="submit">Post Ad</button>
                            </div>

                        </form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
