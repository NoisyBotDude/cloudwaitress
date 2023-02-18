import Head from 'next/head'
import { useState, useEffect } from 'react';
import Style from '../styles/setflow.module.scss';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/router';

export default function SetFlow({ lid }) {
    const router = useRouter();
    const [fdata, setfdata] = useState({ twilio_sid: '', twilio_token: '', flow_name: '', user_id: '', locationId: '' });
    const [msg, setmsg] = useState('');
    useEffect(() => {
        setfdata(fdata => ({ ...fdata, locationId: lid }));
    }, [])

    async function handleSubmit(e) {
        setmsg('Loading...');
        e.preventDefault();
        fetch(`/api/missed/set`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fdata)
        }).then(res => res.json()).then(data => {
            if (data.outcome === 0) router.push('/');
            setmsg(data.message);
            console.log("this is flow message" , data.message);
        }).catch(err => console.log('Error :', err.message));
    }

    return (
        <div>
            <Head>
                <title>Set Twilio studio Flow</title>
                <meta name="set twilio studio flow" content="set studio flow" />
            </Head>
            <main>
                <h1>Set Twilio studio Flow</h1>
                <form className={Style.form} onSubmit={handleSubmit}>
                    {msg && <p>{msg}</p>}

                    <input type="text" name="locationId" value={fdata.locationId} onChange={(e) => setfdata(fdata => ({ ...fdata, [e.target.name]: e.target.value }))} placeholder='Your GoHoghLevel LocationId' />

                    <input type="text" name="twilio_sid" value={fdata.twilio_sid} onChange={(e) => setfdata(fdata => ({ ...fdata, [e.target.name]: e.target.value }))} placeholder='Twilio account SID' />

                    <input type="text" name="twilio_token" value={fdata.twilio_token} onChange={(e) => setfdata(fdata => ({ ...fdata, [e.target.name]: e.target.value }))} placeholder='Your Twilio auth token' />
                    <input type="text" name="flow_name" value={fdata.flow_name} onChange={(e) => setfdata(fdata => ({ ...fdata, [e.target.name]: e.target.value }))} placeholder='Enter the name of the flow' />
                    <button className={Style.submitBtn} type="submit">create</button>
                </form>
            </main >
        </div >
    )
}

export async function getServerSideProps({ req, res }) {
    let locationId;
    if (hasCookie('locationId', { req, res })) {
        locationId = getCookie('locationId', { req, res });
    }
    return {
        props: {
            lid: locationId || ''
        },
    }
}