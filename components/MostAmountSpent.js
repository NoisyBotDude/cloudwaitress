import { Bar, Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeSeriesScale,
    TimeScale,
} from 'chart.js';

import style from "../styles/Dashboard.module.scss"
import { useEffect, useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    TimeScale,
    TimeSeriesScale
);

// const labels = ["Loc1", "Loc2", "Loc3", "Loc4", "Loc5", "Loc6", "Loc7", "Loc1", "Loc2", "Loc3", "Loc4", "Loc5", "Loc6", "Loc7", "Loc1", "Loc2", "Loc3", "Loc4", "Loc5", "Loc6", "Loc7", "Loc1", "Loc2", "Loc3", "Loc4", "Loc5", "Loc6", "Loc7", "Loc1", "Loc2", "Loc3", "Loc4", "Loc5", "Loc6", "Loc7"];

// const data = [
//     {
//       labels: labels,
//       datasets: [{
//         label: 'Most amount spent per location',
//         data: labels.map(label => {
//             return Math.random()*50
//         }),
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.2)',
//         ],
//         borderColor: [
//           'rgb(255, 99, 132)',
//         ],
//         borderWidth: 1
//       }]
//     }
// ];

// console.log(data)

// const options = {
//     maintainAspectRatio: false,
//     scales: {
//         y: {
//             title: {
//                 display: true,
//                 text: "Amount spent",
//                 padding: {
//                     y: 10
//                 },
//                 color: "#fff"
//             },

//             grid: {
//                 borderColor: "#fff"
//             },


//             ticks: {
//                 // Include a dollar sign in the ticks
//                 callback: function(value, index, ticks) {
//                     return '$' + value;
//                 }
//             }
//         },

//         x: {
//             title: {
//                 display: true,
//                 text: "Location ID",
//                 padding: {
//                     y: 10
//                 },
//                 color: "#fff"
//             },

//             grid: {
//                 borderColor: "#fff"
//             }
//         }
//     }
// }

const MostAmountSpent = ({ data }) => {
    const [chartData, setchartdata] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [view, setView] = useState(1);
    const [customer, setCustomer] = useState("");
    const [daterange, setDaterange] = useState([Date.now(), Date.now()]);

    useEffect(() => {
        var dict = {};

        data.forEach(order => {
            var det = new Date(order.timestamp);
            if (dict[det.toLocaleDateString()]) dict[det.toLocaleDateString()]++;
            else dict[det.toLocaleDateString()] = 1;
            // Fake data
            // Math.floor(5*Math.random());    
        });

        var toPass = [];
        var custSet = new Set();
        var customs = [];
        var maxd = 0;
        var mind = Infinity;

        if (view === 1) {
            data.forEach(order => {
                var det = new Date(order.timestamp);
                toPass.push({ x: order.timestamp, y: dict[det.toLocaleDateString()] });
                maxd = Math.max(maxd, order.timestamp);
                mind = Math.min(mind, order.timestamp);
            });
        } else {
            data.forEach(order => {
                // var det = new Date(order.timestamp);
                if (order.customer === customer) {
                    toPass.push({ x: order.timestamp, y: order.amt });
                    maxd = Math.max(maxd, order.timestamp);
                    mind = Math.min(mind, order.timestamp);
                }
            });
        }

        data.forEach(order => custSet.add(order.customer));
        custSet.forEach(dat => customs.push(dat));

        setchartdata(toPass);
        setCustomers(customs);
        setDaterange([maxd, mind]);
    }, [data, view, customer])

    const cdata = {
        datasets: [{
            label: "Orders",
            data: chartData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgb(255, 99, 132)',
            ],
            borderWidth: 2,
            pointStyle: 'circle',
            pointRadius: 8,
            pointHoverRadius: 12
        }]
    };

    const options = [
        {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: "No. of Orders",
                        padding: {
                            y: 10
                        },
                        color: "#fff"
                    },

                    grid: {
                        borderColor: "#fff",
                        color: "#000"
                    }
                },

                x: {
                    type: 'time',
                    distribution: 'linear',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: "do MMM yyyy"
                        }
                    },
                    // min: daterange[1]-2*24*60*60*1000,
                    // max: daterange[0]+2*24*60*60*1000,
                    title: {
                        display: true,
                        text: "Time",
                        padding: {
                            y: 10
                        },
                        color: "#fff"
                    },

                    grid: {
                        borderColor: "#fff",
                        color: "#000"
                    }
                }
            }
        },
        {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: "Amount",
                        padding: {
                            y: 10
                        },
                        color: "#fff"
                    },

                    grid: {
                        borderColor: "#fff",
                        color: "#000"
                    },

                    ticks: {
                        callback: function (value, index, ticks) {
                            return '$' + value;
                        }
                    }
                },

                x: {

                    type: 'time',
                    distribution: 'linear',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: "do MMM yyyy"
                        }
                    },
                    min: daterange[1] - 2 * 24 * 60 * 60 * 1000,
                    max: daterange[0] + 2 * 24 * 60 * 60 * 1000,
                    title: {
                        display: true,
                        text: "Time",
                        padding: {
                            y: 10
                        },
                        color: "#fff"
                    },

                    grid: {
                        borderColor: "#fff",
                        color: "#000"
                    }
                }
            }
        }]


    return (
        <div className={style.barFlexContainer}>
            <div className={style.menuContainer}>
                <div className={style.dropSelect}>
                    <label htmlFor="Select Chart">Select Chart</label>
                    <select id="select-chart" name="chart-options" onChange={(e) => { setView(Number(e.target.value)) }}>
                        <option value="1" defaultValue={"1"}>Orders by location</option>
                        {/* <option value="2">Orders by customer</option> */}
                    </select>
                </div>
                <div className={style.dropSelect}>
                    {(view === 2) &&
                        (<>
                            <label htmlFor="Select Chart">Select Customer</label>
                            <select id="select-customer" name="customer-options" onChange={(e) => { setCustomer(e.target.value) }}>
                                {customers.map(customer =>
                                    (<option value={customer} key={customer} selected>{customer}</option>)
                                )
                                }
                            </select></>)
                    }
                </div>
            </div>
            <div className={style.aContainer} style={{ "width": `${data.length * 50 > 800 ? data.length * 50 : 800}px`, "maxWidth": "1100px" }}>
                {(view === 1) && <Line data={cdata} options={options[0]} />}
                {(view === 2) && <Bar data={cdata} options={options[1]} />}
            </div>
        </div>
    )
}

export default MostAmountSpent