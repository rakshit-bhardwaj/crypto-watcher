import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import {Header} from './Components';
import {Homepage,CoinPage} from './Pages'
import Alert from './Components/Alert';

const useStyles = makeStyles({
  app: {
    backgroundColor: "#000814",
    color: "white",
    minHeight: "100vh"
  }
});

function App() {
  
  const classes = useStyles();
  return (
    <Router>
        <div className={classes.app}>
          <Header/>
          <Routes>
            <Route path='/' element={<Homepage/>}/>
            <Route path='coins/:id' element={<CoinPage/>}/>
          </Routes>
          <Alert/>
        </div>
    </Router>
  );
}

export default App;
