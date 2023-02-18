import { getCookie, deleteCookie, setCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { swr_post } from "../services/api-client";
import { useEffect, useState, useRef } from 'react';
import style from "../styles/redirect.module.scss"

export default function Redirect({ lid }) {

    const router = useRouter();
    let path = useRouter().pathname;
    const [message, setmessage] = useState('Loading...');
    const [locationId, setlocation] = useState('');
    const [authcode, setauthcode] = useState('');

    console.log("path - ", path);
    // retrieve code from search bar
    useEffect(() => {
        if (router && router.query) {
            handleCode(router.query.code);
        }
    }, [router]);

    // exchange code with backend and get locationId
    const handleCode = async (code) => {
        const data = {
            code: code,
        }
        if (code) setauthcode(code);
        const endpoint = '/api/auth';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
        const result = await swr_post(endpoint, options);
        if (result.locationId) {
            localStorage.setItem('locationId', result.locationId);
            setCookie('locationId', result.locationId, { path: '/', maxAge: 60 * 60 * 24 * 365 });
        }
        setlocation(result.locationId);
        if (result.message) setmessage(result.message);
        else setmessage('');
        console.log(result);
    }

    // Handles the submit event on form submit.
    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        // Get data from the form.
        setmessage("Loading...");
        const data = {
            locationId: event.target.locationId.value,
            cwKey: event.target.cwkey.value,
            number: event.target.number.value,
            ghlv1api: event.target.ghlv1api.value,
        }
        if (authcode) {
            data = { ...data, code: authcode };
        }
        // API endpoint where we send form data.
        const endpoint = '/api/form';
        // Form the request for sending data to the server.
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
        const result = await swr_post(endpoint, options);
        if (result.outcome === 0) {
            if (!hasCookie('locationId')) {
                setCookie('locationId', result.locationId, { path: '/', maxAge: 60 * 60 * 24 * 365 });
            }
            setmessage(result.message);
            router.push('/');
        } else {
            setmessage(result.message);
        }
    }

    //Logs out 
    const handleLogout = (event) => {
        event.preventDefault();
        deleteCookie('locationId', { path: '/' });
        localStorage.removeItem('locationId');
        setmessage('Loading...');
        router.push("/");
    }

    return (
        <>
            <div>
                <div className={style.container}>
                    <div className={style.background}>
                        <div className={style.shape}></div>
                        <div className={style.shape}></div>
                    </div>
                    <div className={style.form}>
                        <p className={style.err}>{message}</p>
                        {(locationId !== '') && (<form onSubmit={handleSubmit}>
                            <label htmlFor="locationId">GoHighLevel Location ID</label>
                            <input type="text" id="locationId" name="locationId" placeholder='Enter your GoHighLevel location ID' defaultValue={lid || locationId} required />

                            <label htmlFor="cwkey">CloudWaitress API key</label>
                            <input type="text" id="cwkey" name="cwkey" placeholder='Enter your CloudWaitress API key' required />

                            <label htmlFor="number">Your Phone number</label>
                            <input type="text" id="number" name="number" placeholder='Enter your phone number in +1xxxxxxxxx format' required />

                            <label htmlFor="ghlv1api">GoHighLevel v1 API</label>
                            <input type="text" id="ghlv1api" name="ghlv1api" placeholder='Enter your Gohighlevel V1 API key' required />

                            <button type="submit" className={style.submitBtn}>Submit</button>
                            {lid !== '' && authcode === '' && <button className={style.logoutBtn} onClick={handleLogout}>Log out</button>}
                        </form>)}
                    </div>
                </div>
            </div>
        </>
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