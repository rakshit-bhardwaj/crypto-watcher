import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Box, Button, Tab, Tabs } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Login from './Login';
import SignUp from './SignUp';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase'
import { CryptoState } from '../CryptoContext';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor:'#001D3D',
    border: '2px solid #000',
    borderRadius: '12px',
    width: '400px',
    color: '#fff',
    fontFamily: 'Ubuntu'
  },
  google: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 20,
    fontFamily: 'Ubuntu',
    fontWeight:'500',
    gap: 20,
    padding: 24,
    paddingTop: 0,
    textAlign:'center'
  }
}));

export default function TransitionsModal() {
  
  const googleProvider = new GoogleAuthProvider();
  const {setalert} = CryptoState();

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [value, setValue] = useState(0);
  
  console.log(value)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const signInWithGoogle = async ()=>{
    await signInWithPopup(auth,googleProvider).then((res)=>{
      console.log(res)
      setalert({
        open: true,
        message: `Sign in successful. Welcome ${res.user.email}`,
        type: 'success'
      })
      handleClose();
    }).catch(err=>{
      setalert({
        open: true,
        message: err.message,
        type: 'error'
      })
      return;
    })
  }

  return (
    <div>
      <Button 
      variant='contained' 
      onClick={handleOpen}
      style={{
        width: 85,
        height: 40,
        backgroundColor: '#FFC300',
        fontWeight: 650,
      }}>
        Login
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
           <AppBar position='static' style={{backgroundColor:'transparent',color:'#fff',padding:'0px'}}>
            <Tabs 
            value={value}
            onChange={handleChange}
            variant='fullWidth'
            style={{borderRadius: '10px',backgroundColor: '#001D3D'}}>
            <Tab label='Login'/>
            <Tab label='Sign up'/>
            </Tabs>
           </AppBar>
           {value===0 && <Login handleClose={handleClose}/>}
           {value===1 && <SignUp handleClose={handleClose}/>}
           <Box className={classes.google}>
            <span>OR</span>
            <GoogleButton style={{width: '100%',outline: 'none'}}
            onClick={signInWithGoogle}>
            </GoogleButton>
           </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
