import { useState, useEffect } from 'react'
import Banner from '../../components/Banner';
import React from 'react';
import Container from '@mui/material/Container';
import Cards from '../../components/Cards';
import { config } from '../../Constants'
import CustomButton from '../../components/CustomButton';
import Cookies from 'js-cookie';
export default function Home({ searchVal }) {
  const url = config.url.API_URL
  const token = Cookies.get('token')

  const [data, setData] = useState([])
  const [error, setError] = useState([{}])
  const [visible, setvisible] = useState(4)
  const [loading, setLoading] = useState(false)
  const [lengthTrack, setlengthTrack] = useState(4)


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${url}/api/product`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
          });

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  const showMoreItems = () => {
    setvisible((prevValue) => prevValue + 4)
    setlengthTrack((prevValue) => prevValue + 4)
  }
  return (
    <>
      <Container >
        <Banner />
        <Cards data={data} visible={visible} loading={loading} />
        {
          (lengthTrack < data?.length) ? 
            <CustomButton onClick={showMoreItems} text="Show more" style={{display:"flex",justifyContent:"center"}}/> : null

        }
      </Container>

    </>
  );
}
