import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Avatar,Button } from '@material-ui/core';
import {CryptoState} from '../CryptoContext'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { NumberWithCommas } from './Carousel';
import {AiFillDelete} from 'react-icons/ai';
import { doc,setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const useStyles = makeStyles({
  container: {
    width: 350,
    height: '100%',
    padding: 25,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Ubuntu',
    backgroundColor: '#001125',
  },
  profile: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap:'20px',
    height: '92%'
  },
  picture: {
    width:200,
    height: 200,
    cursor: 'pointer',
    objectFit:'contain',
    backgroundColor:'#FFC300'
  },
  button: {
    color:'#000814',
    backgroundColor: '#FFC300',
  },
  watchlist: {
    flex: 1,
    color: '#FFF',
    fontFamily: 'Ubuntu',
    fontWeight: '650',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    paddingTop: 10,
    gap: 12,
    overflowY: 'scroll',
    borderRadius: '6px',
    backgroundColor: '#003566',
    width: '100%',
    marginBottom: 15
  },
  coin: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#001D3D',
    borderRadius: '5px',
    width: '100%',
    alignContent:'start'
  }
});

export default function Usersidebar() {
  const {user,setalert,coins,watchlist,Symbol} = CryptoState();
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false
  });


  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  
  const Logout = () => {
    signOut(auth);

    setalert({
        open: true,
        message: 'Log out successful',
        type: 'success'
    })
    
    toggleDrawer();
  }
  const removeFromWatchList = async (coin) => {
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
  return (
    <div>
      
        <React.Fragment key={'right'}>
          <Avatar onClick={toggleDrawer('right', true)}
          style={{
            height:38,
            width: 38,
            marginLeft: 15,
            cursor: 'pointer',
            backgroundColor:'#FFC300',
            marginTop: '10px'
          }}
          src={user.photoURL}
          alt={user.displayName || user.email}/>
          <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)} >
            <div className={classes.container}>
                <div className={classes.profile}>
                <Avatar 
                className={classes.picture}
                src={user.photoURL}
                alt={user.displayName || user.email}/>
                <span 
                style={{
                    width:'100%',
                    fontSize:25,
                    fontWeight:'bolder',
                    wordWrap: 'break-word',
                    color: '#FFF',
                    display: 'flex',
                    justifyContent:'center'
                    }}>
                        {user.displayName || user.email}
                    </span>
                <div className={classes.watchlist}>
                    Watch List
                    {coins.map((coin)=>{
                    if(watchlist.includes(coin.id)){
                      return(
                        <div className={classes.coin} key={coin.id}>
                          <img src={coin?.image} 
                                        alt={coin.name}
                                        height='50'
                                        style={{marginBottom: '0px',height:'25px',width:'25px'}} />
                          <span>{coin.name}</span>
                          <span style={{display:'flex',gap: '8',marginLeft:'auto'}}>{Symbol} {NumberWithCommas(coin.current_price.toFixed(2))}</span>
                          <AiFillDelete 
                          style={{cursor: 'pointer',color: '#FFC300',marginLeft:'auto'}}
                          fontSize='16'
                          onClick={() => removeFromWatchList(coin)}
                          />
                        </div>
                      )
                      }
                    })}
                </div>
                
                </div>
                <Button 
                variant="contained"
                className={classes.button}
                onClick={Logout}>
                Log Out
                </Button>
            </div>
          </Drawer>
        </React.Fragment>
    </div>
  );
}
