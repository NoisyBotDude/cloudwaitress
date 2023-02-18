import Head from 'next/head'
import Oauth from '../components/Oauth';
import Dashboard from '../components/Dashboard';
import { getCookie, setCookie } from 'cookies-next';
import { useState, useEffect } from 'react';
import { swr_post } from "../services/api-client";
import datastore from '../services/datastore';

export default function Home(props) {
  // console.log(props)
  const [user, setuser] = useState(false);
  const [loading, setloading] = useState(false);
  //get location id from cookie and pass to this function
  const checkUser = async (cookieval) => {
    console.log(cookieval)
    const endpoint = '/api/exists';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locationId: cookieval }),
    }
    const result = await swr_post(endpoint, options);
    console.log("result:", result);

    if(result) {
      setuser(true)
      setCookie('locationId', cookieval, { path: '/', maxAge: 365*24*60*60 })
      console.log("cookie set")
    } else setuser(false);
    setloading(false);
  }
  console.log(user, loading)
  useEffect(() => {
    const locationId = getCookie('locationId');
    console.log(locationId)
    if (locationId) {
      setloading(true);
      checkUser(locationId);
    }
  }, [])


  return (
    <div>
      <Head>
        <title>Cloudwaitress Dashboard</title>
        <meta name="description" content="CloudWaitress Dashboard" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main>
        {/* if logged in already , then show dashboard otherwise oauth component */}
        {loading ?
          <div>Loading...</div> :
          user ?
          <Dashboard orders={props.orders} missed={props.missed}/>
          : <Oauth />}
      </main>
    </div>
  )
}


export async function getServerSideProps() {

  const orders = await datastore.GetAll("orders");
  const missed = await datastore.GetAll("missed");
  // console.log((orders))
  let data = orders.map((order) => {
    //     const { ghlId } = (await datastore.get("customers", rest.maxCustomer));

    const obj = {
      "timestamp": order.createdAt,
      "amt": order.amount,
      "customer": order.customer
      // "maxCustomer": ghlId
    }

    return obj;
  })

  return {
    props: {
      orders: data,
      missed: missed
    }
  }
}
