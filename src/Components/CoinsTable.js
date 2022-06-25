import { createTheme, ThemeProvider,Container,Typography,TextField, makeStyles, TableContainer, LinearProgress,Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CryptoState } from '../CryptoContext'
import { NumberWithCommas } from './Carousel'

const CoinsTable = () => {

    const [search, setsearch] = useState('')
    const [page, setpage] = useState(1)
    const { Currency,Symbol,coins,loading,fetchcoins } = CryptoState()

    console.log(coins);
    useEffect(()=>{
        fetchcoins();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[Currency])

    const darkTheme = createTheme({
        pallete: {
            main: '#FFF',
             type: 'dark'
        },
       
    });

    const useStyle = makeStyles({
        textField: {
            color: '#FFF'
        },
        input: {
            color: '#FFF',
            borderWidth: "1px",
            borderColor: "yellow !important"
        },
        row: {
            backgroundColor: '#16171a',
            '&:hover':{
                backgroundColor:'#131111'
            },
            fontFamily: 'Ubuntu'
        },
        ul: {
            "& .MuiPaginationItem-root": {
              color: "#FFC300"
            }
          }
    })
    const classes = useStyle()

    const handleSearch = () => {
         return coins.filter((coin)=>(
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
         ))        
    }

  return (
    <ThemeProvider theme = {darkTheme}>
        <Container style = {{textAlign: 'center'}}>
            <Typography 
            variant='h4'
            style={{margin: '18px', fontFamily:'Ubuntu', fontWeight: '400'}}
            >CryptoCurrency prices by their market cap</Typography>
            <TextField 
            label ='Search for a CryptoCurrency...' 
            variant='outlined'
            className={classes.textField}
            style={{marginBottom: 20,width:'100%'}}
            InputProps={{
                classes: {
                   input: classes.input
                }
            }}
            onChange={(e)=>{setsearch(e.target.value.toLowerCase())}}/>
            <TableContainer>
                { loading ? 
                (<LinearProgress style={{backgroundColor: 'gold'}}/>) 
                : (
                <Table>
                    <TableHead style={{backgroundColor: '#FFC300'}}>
                        <TableRow>
                            {["Coin","Price","24h change","Market cap"].map((head)=>(
                                <TableCell 
                                style={{color:'#000814',fontWeight:700,fontFamily:'Ubuntu'}}
                                key={head}
                                align={head==='Coin' ? 'left' : 'right'}>
                                {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>{handleSearch().slice((page - 1)*10,(page-1)*10 + 10).map((row)=>{
                        const profit = row.price_change_percentage_24h > 0;
                        return (
                            <TableRow
                                className={classes.row}
                                key={row.name}>
                                    <TableCell component='th' scope='column' style={{display: 'flex',gap: 15}}>
                                        <Link to={`/coins/${row.id}`}>
                                        <div style={{display: 'flex',flexDirection:'column'}}>
                                        <img src={row?.image} 
                                        alt={row.name}
                                        height='50'
                                        style={{marginBottom: '15px',height:'50px',width:'50px'}} />
                                        <div style={{display:'flex',flexDirection:'column'}}>
                                            <span style={{textTransform:'uppercase',fontSize:'18',color:'#FFF'}}>{row.symbol}</span>
                                            <span style={{color:'darkgray'}}>{row.name}</span>
                                        </div>
                                        </div>
                                        </Link> 
                                    </TableCell>
                                    <TableCell align='right' style={{color: '#fff',fontWeight:500,fontSize:'16px'}}>
                                        <div style={{display:'flex', flexDirection:'row-reverse',gap:'5px'}}>
                                        {NumberWithCommas(row.current_price.toFixed(2))}{' '}{Symbol}</div>
                                    </TableCell>
                                    <TableCell
                                    align='right'
                                    style={{color: profit ? "rgb(14,203,129)" : "red",fontWeight:500,fontSize:'16px'}}>
                                    {profit && '+'}
                                    {row.price_change_percentage_24h.toFixed(2)}%
                                    </TableCell>
                                    <TableCell 
                                    align='right'
                                    style={{color:'white'}}>
                                    <div style={{display:'flex', flexDirection:'row-reverse',gap: '5px'}}>
                                    M{' '}{NumberWithCommas(row.market_cap.toString().slice(0,-6))}{' '}{Symbol}
                                    </div>
                                    </TableCell>
                                    
                            </TableRow>
                        )
                    })}</TableBody>
                </Table>)}
            </TableContainer>
            <Pagination
            style={{
                padding: 20,
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
            }} 
            classes={{ ul: classes.ul }} 
            count = {Number((handleSearch()?.length/10).toFixed(0))}
            onChange={(_,value)=>{
                setpage(value)
                window.scroll(0,450)
            }}/>
        </Container>
    </ThemeProvider>
  )
}

export default CoinsTable