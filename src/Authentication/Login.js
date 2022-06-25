import React,{useState} from 'react'
import { Box, TextField,Button,makeStyles } from '@material-ui/core';
import { CryptoState } from '../CryptoContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = ({handleClose}) => {

    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const {setalert} = CryptoState();

    const handleSubmit = async ()=>{
        if(!email || !password){
            setalert({
                open: 'true',
                message: 'Please fill all the fields',
                type: 'error'
            })
            return;
        }
        try {
            const result = await signInWithEmailAndPassword(auth,email,password);

            console.log(result);
            setalert({
                open: true,
                message: `Login successful | Welcome ${result.user.email}`,
                type: 'success'
            })
            handleClose()
            
        } catch (error) {
            setalert({
                open: true,
                message: error.message,
                type: 'error'
            })
            return;
        }
    }

    const useStyle = makeStyles ({
        multilineColor:{
            color:'white'
        }
    });
    
    const classes = useStyle();

  return (
    <Box 
    p={3}
    style={{display: 'flex',flexDirection: 'column',gap: '20px'}}>
    <TextField 
     InputProps={{
        className: classes.multilineColor
      }}
    variant='outlined'
    type='email'
    label='Enter E-mail'
    value={email}
    fullWidth
    onChange={(e)=>{setemail(e.target.value)}}
    />
    <TextField 
     InputProps={{
        className: classes.multilineColor
      }}
    variant='outlined'
    type='password'
    label='Enter Password'
    value={password}
    fullWidth
    onChange={(e)=>{setpassword(e.target.value)}}
    />
    <Button 
    variant='contained'
    size='large'
    style={{backgroundColor:'#FFC300',fontWeight:'650'}} 
    onClick={handleSubmit}>
        Login
    </Button>

    </Box>
  )
}

export default Login