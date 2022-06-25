import { Box, TextField,Button, makeStyles } from '@material-ui/core';
import React, { useState } from 'react'
import { CryptoState } from '../CryptoContext';
import { auth } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'



const SignUp = ({handleClose}) => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [confirmpassword,setconfirmpassword] = useState('');
    
    const { setalert } = CryptoState();
    const handleSubmit = async ()=>{
        if(password!==confirmpassword){
            setalert({
                open: true,
                message: 'Passwords do not match',
                type: 'error'
            })
        }

        try {
            const result = await createUserWithEmailAndPassword(auth,email,password);
            console.log(result);
            setalert({
                open: true,
                message: `Sign Up successful | Welcome ${result.user.email}`,
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
    <TextField 
    InputProps={{
        className: classes.multilineColor
      }}
    variant='outlined'
    type='password'
    label='Confirm Password'
    value={confirmpassword}
    fullWidth
    onChange={(e)=>{setconfirmpassword(e.target.value)}}
    />
    <Button 
    variant='contained'
    size='large'
    style={{backgroundColor:'#FFC300',fontWeight:'650'}} 
    onClick={handleSubmit}>
        Sign Up
    </Button>

    </Box>
  )
}

export default SignUp