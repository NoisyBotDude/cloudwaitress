import { Bar, Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
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
  TimeScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeSeriesScale,
  TimeScale
);

import { useEffect, useState } from 'react';

import style from "../styles/Dashboard.module.scss";

const MissCallTB = ({ data }) => {
  const [missData, setmisseddata] = useState([]);
  const [orderData, setorderdata] = useState([]);
  const [daterange, setDaterange] = useState([0, 0]);
  // const [labels, setlabels] = [];

  useEffect(() => {

    var mdict = {};
    var odict = {};
    var months = {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
    }
    var days = {};

    data.missed.forEach(missed => {
      var det = new Date(missed.created_at);
      det = det.toDateString();

      if (mdict[days[det]]) mdict[days[det]]++;
      else {
        mdict[missed.created_at] = 1;
        days[det] = missed.created_at;
      }
      // Fake data
      // Math.floor(5*Math.random());    
    });

    days = {}

    data.orders.forEach(order => {
      var det = new Date(order.timestamp);
      det = det.toDateString();
      console.log(det)

      if (odict[days[det]]) odict[days[det]]++;
      else {
        {
          odict[order.timestamp] = 1;
          days[det] = order.timestamp;
        }
      }
      // Fake data
      // Math.floor(5*Math.random());    
    });

    console.log(mdict, odict)

    var toPass = [];
    var maxd = 0;
    var mind = Infinity;

    Object.keys(mdict).forEach(key => {
      // var det = new Date(missed.created_at);
      toPass.push({ x: Number(key), y: mdict[key] });
      // toPass.push({x: months[det.getMonth()]+" "+det.getFullYear(), y: mdict[months[det.getMonth()]+" "+det.getFullYear()]});
      maxd = Math.max(maxd, key);
      mind = Math.min(mind, key);
    });
    // console.log(toPass)
    setDaterange([maxd, mind]);
    setmisseddata(toPass);

    toPass = [];

    Object.keys(odict).forEach(key => {
      console.log(key)
      // var det = new Date(order.timestamp);
      toPass.push({ x: Number(key), y: odict[key] });
      // toPass.push({x: det.getMonth(), y: odict[det.getMonth()+" "+det.getFullYear()]});
      // toPass.push({x: months[det.getMonth()]+" "+det.getFullYear(), y: odict[det.getMonth()+" "+det.getFullYear()]});
      maxd = Math.max(maxd, key);
      mind = Math.min(mind, key);
    });
    // console.log(toPass)
    setDaterange([maxd, mind]);
    setorderdata(toPass);

  }, [data])

  // const orderData = [
  //   {x: Date.parse("2022-09-09"), y: 5},
  //   {x: Date.parse("2022-10-09"), y: 5},
  //   {x: Date.parse("2022-11-09"), y: 5},
  // ]

  // const missData = [
  //   {x: Date.parse("2022-09-09"), y: 4},
  //   {x: Date.parse("2022-10-09"), y: 4},
  //   {x: Date.parse("2022-11-09"), y: 4},
  // ]


  const cdata = {
    // labels: labels,
    datasets: [
      {
        label: 'Orders',
        data: orderData,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        stack: "stack 1",
        borderWidth: 1,
        // borderWidth: 2,
        pointStyle: 'circle',
        pointRadius: 8,
        pointHoverRadius: 12
      },
      {
        label: 'Missed',
        data: missData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        stack: "stack 2",
        borderWidth: 1,
        // borderWidth: 2,
        pointStyle: 'circle',
        pointRadius: 10,
        pointHoverRadius: 16
      }
    ]
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: "dd MMM yyyy"
          }
        },
        min: daterange[0] === 0 ? Date.now() - 30 * 24 * 60 * 60 * 1000 : daterange[0] - 30 * 24 * 60 * 60 * 1000,
        max: daterange[0] === 0 ? Date.now() + 1 * 24 * 60 * 60 * 1000 : daterange[0] + 1 * 24 * 60 * 60 * 1000,
        title: {
          display: true,
          text: "Date",
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

      y: {
        // stacked: true,
        title: {
          display: true,
          text: "Number of missed calls/orders",
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
          stepSize: 1
        }
      }
    },

  }

  console.log(orderData)
  return (
    <div className={style.barFlexContainer}>
      <div className={style.bContainer}>
        <Line data={cdata} options={options} />
      </div>
    </div>
  )
}

export default MissCallTB;