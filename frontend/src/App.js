
import './App.css';
import BeerList from './components/BeerList';
import { BrowserRouter as Switch, Route, useLocation } from 'react-router-dom';
import BeerDetails from './components/BeerDetails';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import cartListReducer from './redux/cartListReducer';
import { AnimatePresence } from "framer-motion"

const store = createStore(
  combineReducers({
    cartListReducer
  })
);

function App() {

  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Provider store={store}>
        <Switch location={location} key={location.pathname}>
          <Route component={BeerList} path='/beer-list' exact />
          <Route component={BeerDetails} path='/beer-details/:ids' exact />
        </Switch>
      </Provider>
    </AnimatePresence>

  );
}

export default App;
