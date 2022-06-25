import React,{useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core'
import axios from 'axios';
import { TrendingCoins } from '../config/api';
import { CryptoState } from '../CryptoContext';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    carousel : {
        height: '50%',
        display: 'flex',
        alignItems: 'center'
    },
    carouselItem : {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      textTransform:'uppercase',
      color: 'white'
    }
})

export function NumberWithCommas (x) {
  return (<div>{x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}</div>)
}


const Carousel = () => {

    const [trending, settrending] = useState([])
    const { Currency,Symbol } = CryptoState();

    const fetchTrendingCoins = async ()=>{
        const { data } = await axios.get(TrendingCoins(Currency));
        settrending(data);
    }
    console.log(trending);
    useEffect(() => {
      fetchTrendingCoins();
    }, [Currency]);
    
    const classes = useStyles();

    const items = trending.map((coin) => {

      let profit = coin?.market_cap_change_percentage_24h >=0 ;

      return (<Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        <img 
        src={coin?.image} 
        alt={coin.name}
        height='80'
        style={{marginBottom: '10px'}} />
        <span>{coin?.symbol}
        &nbsp;
        <span style={{color: profit ? 'rgb(14,203,129)' : 'red',fontWeight: '500'}}>
          {profit && '+'}{coin?.market_cap_change_percentage_24h?.toFixed(2)}%
        </span>
        </span>
        <span style={{fontSize:18, fontWeight:400,display:'flex',flexDirection:'row'}}>
          {Symbol}&nbsp;{NumberWithCommas(coin?.current_price?.toFixed(2))}
        </span>
      </Link>)
    })
    const responsive = {
      0: {
          items: 2
      },
      512: {
      items: 4
      }
    }
  return (
    <div className={classes.carousel}>
      <AliceCarousel
      mouseTracking
      infinite
      autoPlayInterval={1000}
      animationDuration={1500}
      disableDotsControls
      disableButtonsControls
      responsive={responsive}
      autoPlay
      items={items}/>
    </div>
  )
}

export default Carousel