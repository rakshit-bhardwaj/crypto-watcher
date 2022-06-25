import React from 'react'
import Carousel from './Carousel';
import {makeStyles,Container,Typography} from '@material-ui/core'
import Fade from 'react-reveal/Fade';

const useStyles = makeStyles({
  banner: {
    backgroundImage: 'url(./patternpad.svg)'
  },
  bannerContent: {
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '25px',
    justifyContent: 'space-around'
  },
  tagline: {
    display: 'flex',
    height: '40%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const Banner = () => {
  const classes = useStyles();
  return (
    <div className={classes.banner}>
      <Container className={classes.bannerContent}>
        <div className={classes.tagline} style={{display:'flex',flexDirection:'column',justifyContent: 'center',alignItems: 'center'}}>
          <Fade left>
          <Typography 
          variant='h2'
          style={{
            fontWeight:'bold',
            marginBottom: '15px',
            fontFamily: 'Ubuntu'
          }}
          >Crypto Watcher</Typography>
          </Fade>
          <Fade bottom>
          <Typography
          variant='h6'
          style={{
            color:'#f1f1f1',
            textTransform: 'capitalize',
            fontFamily: 'Ubuntu'
          }}>Keep a sharp watch on your favourite Crypto currencies</Typography>
          </Fade>
        </div>
        <Carousel/>
      </Container>
    </div>
  )
}

export default Banner