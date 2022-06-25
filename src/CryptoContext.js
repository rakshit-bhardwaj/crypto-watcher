import React, { useEffect } from 'react'
import { createContext,useContext,useState } from 'react'
import axios from 'axios';
import { CoinList } from './config/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const crypto = createContext();
const CryptoContext = ({children}) => {
    const [Currency, setCurrency] = useState('INR');
    const [Symbol, setSymbol] = useState('₹');
    const [coins, setcoins] = useState([]);
    const [loading, setloading] = useState(false);
    const [user, setuser] = useState(null);
    const [watchlist,setwatchlist] = useState([])
    const [alert, setalert] = useState({
      open: false,
      message: '',
      type: 'success'
    })

    const fetchcoins= async () => {
      setloading(true)
      const { data } = await axios.get(CoinList(Currency))
      setcoins(data)
      setloading(false)
  }
    
    useEffect(()=>{
      onAuthStateChanged(auth,(user)=>{
          if(user) setuser(user)
          else setuser(null)
      })
    },[])

    useEffect(()=>{
        if(Currency==='USD') setSymbol('$');
        if(Currency==='INR') setSymbol('₹');
    },[Currency])

    useEffect(()=>{
      if(user){
        const coinRef = doc(db,'watchlist',user?.uid);

      var unsubscribe = onSnapshot(coinRef,(coin)=>{
        if(coin.exists()){
          console.log(coin.data().coin)
          setwatchlist(coin.data().coins);
        }
        else {
          console.log('no items in watchlist')
        }
      })
      return () => {
        unsubscribe()
      }
      }
    },[user])
  return (
    <crypto.Provider value={{Currency,Symbol,children,setCurrency,coins,loading,fetchcoins,alert,setalert,user,setuser,watchlist}}>
        {children}
    </crypto.Provider>
  )
}

export default CryptoContext

export const CryptoState = () => {
    return useContext(crypto);
}