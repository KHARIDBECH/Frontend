import React,{useState,useEffect} from 'react'
import { config } from '../../Constants'
import Container from '@mui/material/Container';
import Cards from '../../components/Cards';
import {  useParams } from 'react-router-dom';
import ShowMore from '../../components/ShowMore';
import Banner from '../../components/Banner';
export default function Category() {

    const url = config.url.API_URL
    let { category } = useParams();
  const [data, setdata] = useState([{}])
  const [visible, setvisible] = useState(4)
  const [loading, setloading] = useState(false)
  const [lengthTrack, setlengthTrack] = useState(4)


  useEffect(() => {
    setloading(true)
    fetch(`${url}/api/product/${category}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        if (response.status === 400) {
          throw Error(response.statusText);
        }
        return response.json();
      }
      )
      .then((data) => {
        setdata(data)
        setloading(false)
      })
      .catch((err) => {
        setloading(false)
      })
  }, [category])

  const showMoreItems = () => {
    setvisible((prevValue) => prevValue + 4)
    setlengthTrack((prevValue) => prevValue + 4)
  }
  return (
    <>
      <Container>
        <Banner/>
        {!data.length && !loading && <h1 style={{textAlign:"center"}}>No item in this category</h1>}
      <Cards data={data} visible={visible} loading={loading} />
      {
        (lengthTrack < data.length) ? <ShowMore showMoreItems={showMoreItems} /> : null
      }
      </Container>
    </>
  )
}
