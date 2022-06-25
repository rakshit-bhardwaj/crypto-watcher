import { AppBar,Container, Toolbar, Typography,Select,MenuItem, makeStyles, createTheme,ThemeProvider } from '@material-ui/core'
import React from 'react'
import './styles.css'
import { useNavigate } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import Authmodal from '../Authentication/Authmodal'
import {Usersidebar} from './'

const useStyles = makeStyles({
    title: {
      flex: 1,
      color: "#FFC300",
      fontFamily: "Ubuntu",
      fontWeight: "bold",
      cursor: "pointer"
    }
});


const darkTheme = createTheme({
  pallete: {
    primary: {
      main: '#FFF',
      fill: '#FFF'
    },
    type: 'dark'
  }
});

const Header = () => {
  const {Currency,setCurrency,user} = CryptoState();
  const navigate = useNavigate();
  const classes = useStyles();


  return (
    <ThemeProvider theme={darkTheme}>
    <AppBar color="transparent" position="static" >
      <Container>
        <Toolbar>
          <Typography onClick={()=> navigate('/')} className={classes.title}>Crypto Watcher</Typography>
          <Select 
          value={Currency}
          onChange={(e)=>{setCurrency(e.target.value)}} 
          variant='outlined' 
          style={{
            width: '100px',
            height: '40px',
            marginRight: '15px',
            variant: 'h6',
            border: '1px solid #fff',
            color: 'white',
          }}>
            <MenuItem value={'USD'}>USD</MenuItem>
            <MenuItem value={'INR'}>INR</MenuItem>
          </Select>
          {user ? <Usersidebar/> : <Authmodal/>}
        </Toolbar>
      </Container>
    </AppBar>
    </ThemeProvider>
  )
}

export default Header