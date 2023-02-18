import { useEffect, useState } from 'react';
// import Card from "react-bootstrap/Card";

import style from "../styles/oauth.module.scss";

export default function Oauth() {
    const oauthurl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${process.env.BASE_URL}/redirect&client_id=${process.env.GHL_CLIENT_ID}&scope=conversations/message.readonly locations.readonly workflows.readonly contacts.write`;
    
    const [isloaded, setload] = useState(false);
    
    useEffect(() => {
        setTimeout(() => {
            setload(true);
        }, 2000);
    }, [])
    
    return (
        <>
            <div>
                {isloaded ?
                    <div className={style.container}>
                        <div className={style.background}>
                            <div className={style.shape}></div>
                            <div className={style.shape}></div>
                        </div>
                        <div className={style.form}>
                                <a href={oauthurl}>
                                    <button className={style.btns}>
                                        Connect with Your GoHighLevel account
                                    </button>
                                </a>
                        </div>
                    </div>
                    :
                    <div>Loading...</div>
                }
            </div>
        </>
    )
}