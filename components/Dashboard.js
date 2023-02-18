import MostAmountSpent from './MostAmountSpent';
import style from "../styles/Dashboard.module.scss";
import { useState } from 'react';
import MissCallTB from './MissCallTB';

export default function Dashboard({ orders, missed }) {

    const [navClosed, setnavClosed] = useState(1);
    const [navSelected, setnavSelected] = useState("A");

    const handleNav = () => {
        setnavClosed(!navClosed);
    }

    return (
        <div className={style.container}>
            <div className={`${style.sideNav} + ${navClosed ? style.Closed : style.Open}`}>
                <div className={style.navLinkContainer}>
                    <div onClick={() => setnavSelected("A")} className={`${style.navLink} ${(navSelected === "A") ? style.navLinkOutline : null}`}>Orders</div>
                    <div onClick={() => setnavSelected("B")} className={`${style.navLink} ${(navSelected === "B") ? style.navLinkOutline : null}`}>Missed call v/s Orders</div>
                    <div className={style.linkbox}>
                        <div className={style.divcenter} ><a className={style.link} href={process.env.BASE_URL + "/setflow"}>Set Missed call flow</a></div>
                        <div className={style.divcenter} ><a className={style.link} href={process.env.BASE_URL + "/redirect"}>Edit Credentials</a></div>
                    </div>
                </div>
            </div>
            <div className={style.header}>
                <div className={style.logoCushion}>
                    <div className={style.burgerContainer}>
                        <button className={style.burger} onClick={handleNav}>
                            <div className={`${style.burgerLine} ${navClosed ? null : style.arrow}`} />
                            <div className={`${style.burgerLine} ${navClosed ? null : style.arrow}`} />
                            <div className={`${style.burgerLine} ${navClosed ? null : style.arrow}`} />
                        </button>
                    </div>
                </div>
                <h1>Dashboard</h1>
                <div className={style.logoCushion} />
            </div>
            <div>
                <div className={style.meat}>
                    <div>
                        {(navSelected === "A") && <MostAmountSpent data={orders} />}
                        {(navSelected === "B") && <MissCallTB data={{ "missed": missed, "orders": orders }} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
