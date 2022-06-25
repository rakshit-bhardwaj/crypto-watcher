import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../config/api';
import { CoinInfo } from '../Components';
import { Typography, makeStyles, LinearProgress, Button} from '@material-ui/core'
import { NumberWithCommas } from '../Components/Carousel';
import ReactHtmlParser from 'react-html-parser'
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CoinPage = () => {
  const {id} = useParams();
  const [coin, setcoin] = useState();
  const {Currency, Symbol, user,watchlist,setalert} = CryptoState();
  const inWatchList = watchlist.includes(coin?.id);

  const fetchCoin = async () => {
    const {data} = await axios.get(SingleCoin(id))
    setcoin(data)
  }
  // console.log(coin);
  useEffect(()=>{
      fetchCoin()
      //eslint-disable-next-line react-hooks/exhaustive-deps
  },[Currency])

  const useStyles = makeStyles((theme) => ({
      Container: {
        display: 'flex',
        [theme.breakpoints.down('md')]:{
          flexDirection: 'column',
          alignItems: 'center'
        },
      },
      Sidebar: {
          width: '30%',
          [theme.breakpoints.down('md')]:{
            width: '100%',
            borderRight: '0px'
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 25,
          borderRight: '2px solid grey'
      },
      Heading: {
        fontWeight: 'bold',
        marginBottom: '15px',
        fontFamily: 'Ubuntu'
      },
      Description:{
        width: '100%',
        fontFamily: 'Ubuntu',
        padding: 25,
        paddingBottom: 15,
        paddingTop: 0,
        textAlign: 'justify'
      },
      marketData: {
          marginLeft: '25px',
          alignSelf: 'start',
          padding: '25',
          paddingTop: '10',
          width: '100%',
          [theme.breakpoints.down('md')]: {
            display: 'flex',
            justifyContent: 'space-around',
          },
          [theme.breakpoints.down('sm')]:{
              flexDirection:'column',
              alignItems: 'center'
          },
          [theme.breakpoints.down('xs')]:{
            alignItems:'start'
          }
      },
      button: {
        width: '80%',
        height: '40px',
        backgroundColor: inWatchList ? '#ff0000' : '#FFC300',
        color: inWatchList ? '#fff' : '#000814',
        fontFamily: 'Ubuntu',
        fontSize: '16px',
        fontWeight: '650px',
        [theme.breakpoints.down('md')] : {
          width: '40%'
        },
        [theme.breakpoints.down('sm')] : {
          width: '60%'
        },
        [theme.breakpoints.down('xs')] : {
          width: '80%'
        },
        "&:hover": {
          backgroundColor: inWatchList ? '#ff0000' : '#FFC300',
          color: inWatchList ? '#fff' : '#000814',
          filter: 'brightness(1.15)'
        }

      }
  }))

  const classes = useStyles();
  
  
  const addToWatchList = async () => {
    const coinRef = doc(db,'watchlist',user.uid);

    try {
      await setDoc(coinRef,{
        coins:watchlist ? [...watchlist,coin?.id] : [coin?.id],
      })

      setalert({
        open: true,
        message: `${coin.name} Successfuly added`,
        type: 'success'
      })
    } catch (error) {
      setalert({
        open: true,
        message: error.message,
        type: 'error'
      })
    }
  }

  const removeFromWatchList = async () => {
    const coinRef = doc(db,'watchlist',user.uid);

    try {
      await setDoc(coinRef,{
        coins:watchlist.filter((watch)=>
          watch !== coin?.id
        )
      },
      {merge: 'true'}
      );

      setalert({
        open: true,
        message: `${coin.name} Successfuly Removed `,
        type: 'success'
      })
    } catch (error) {
      setalert({
        open: true,
        message: error.message,
        type: 'error'
      })
    }
  }
  
  if(!coin) return(<LinearProgress style={{backgroundColor: 'gold'}}/>)

  return (
    <div className={classes.Container}>
      <div className={classes.Sidebar}>
          <img 
          src={coin?.image.large} 
          alt={coin?.name}
          height='200px'
          style={{marginBottom:'20px',caretColor: 'transparent'}} />
          <Typography variant='h3' className={classes.Heading}>
            {coin?.name}
          </Typography>
          <Typography variant='subtitle1' className={classes.Description}>
            {ReactHtmlParser(coin?.description.en.split('. ')[0])}.
          </Typography>
          <div className={classes.marketData}>
              <Typography variant='h6' className={classes.Heading} style={{color: '#fff'}}>
                Rank: <span> {coin?.market_cap_rank}</span>
              </Typography>
              <Typography variant='h6' className={classes.Heading} style={{color: '#fff'}}>
                <div style={{display:"flex",gap:'5px'}}>Current Price:<span style={{fontWeight: '350'}}> {Symbol} </span> <span style={{fontWeight: '350'}}>{NumberWithCommas(coin?.market_data.current_price[Currency.toLowerCase()])}</span> </div>
              </Typography>
              <Typography variant='h6' className={classes.Heading} style={{color: '#fff'}}>
                <div style={{display:"flex",gap:'5px'}}>Current Market Cap:<span style={{fontWeight: '350'}}> {Symbol} </span> <span style={{fontWeight: '350'}}>{NumberWithCommas(coin?.market_data.market_cap[Currency.toLowerCase()].toString().slice(0,-6))}</span> </div>
              </Typography>
          </div>
          {user && (
                <Button 
                variant='outlined'
                className={classes.button}
                onClick={inWatchList ? removeFromWatchList : addToWatchList}>
                {inWatchList ? 'Remove from Watch List' : 'Add to Watch List'}
                </Button>
              )}
      </div>
      <CoinInfo coin={coin}/>
    </div>
  )
}

export default CoinPage