import { CircularProgress, createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { HistoricalChart } from '../config/api';
import {CryptoState} from '../CryptoContext';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import SelectButton from './SelectButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoinInfo = ({coin}) => {
  const [historicalData, sethistoricalData] = useState();
  const [days, setdays] = useState(1);

  const { Currency } = CryptoState();
  const  fetchhistoricaldata = async () => {
     const {data} = await axios.get(HistoricalChart(coin.id,days,Currency));
     console.log(data);
     sethistoricalData(data.prices);    
  }


  useEffect(() => {
      fetchhistoricaldata();
  },[Currency,days])

  const darkTheme = createTheme({
    pallete: {
      primary: {
        main: '#FFF'
      },
      type: 'dark'
    }
  })

  const useStyles = makeStyles((theme)=>({
    container: {
      width: '75%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '25px',
      padding: '40px',
      [theme.breakpoints.down('md')]: {
          width: '100%',
          marginTop: 0,
          padding: 20,
          paddingTop: 0,
      }
    }
  }))

  const classes = useStyles();

  const data = {
    labels: historicalData?.map((coin)=>{
      let date = new Date(coin[0]);
      let time = date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()} PM` :
                 `${date.getHours() }:${date.getMinutes()} AM`;
      return days===1 ? time : date.toLocaleDateString();
    }),
    
    datasets: [
      {
        data : historicalData?.map((coin)=>coin[1]),
        label: `Price (past ${days} days) in ${Currency}`,
        borderColor: '#FFC300'
      }]
  }  
  
  const options = {
    elements: {
      point: {
        radius: 1
      }
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!historicalData ?
         <CircularProgress style={{color:'#FFC300'}} size={250} thickness={1}/> 
         : 
         <Line data={data} options={options}/>}
         <div style={{
          display:'flex',
          justifyContent:'space-around',
          gap:'40px',
          marginTop:'15px',
          }}>
            <SelectButton props='24 hours' onClick={()=>setdays(1)} selected={days===1}/>
            <SelectButton props='30 days' onClick={()=>setdays(30)} selected={days===30}/>
            <SelectButton props='3 months' onClick={()=>setdays(90)} selected={days===90}/>
            <SelectButton props='1 year' onClick={()=>setdays(365)} selected={days===365}/>
         </div>
      </div>
    </ThemeProvider>
  )
}

export default CoinInfo