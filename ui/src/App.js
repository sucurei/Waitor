import './App.css';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { Component } from 'react';
import ClientOrRestaurant from './components/Usable/ClientOrRestaurant/ClientOrRestaurant';
import ClientSignIn from './components/Client/ClientSignIn/ClientSignIn';
import ClientSignUp from './components/Client/ClientSignUp/ClientSignUp';
import RestaurantSignIn from './components/Restaurant/RestaurantSignIn/RestaurantSignIn';
import RestaurantSignUp from './components/Restaurant/RestaurantSignUp/ResturantSignUp';
import RestaurantDataInitilizer from './components/Restaurant/RestaurantDataInitialization/RestaurantDataInitializer';
import RestaurantPreparationsTypeInitializer from './components/Restaurant/RestaurantPreparationsTypeInitializer/RestaurantPreparationsTypeInitializer';
import RestaurantPreparationsInitializer from './components/Restaurant/RestaurantPreparationsInitializer/RestaurantPreparationsInitializer';
import TablesScreen from './components/Restaurant/TablesScreen/TablesScreen';
import CommendScreen from './components/Client/CommendScreen/CommendScreen'

class App extends Component{
  constructor(){
    console.error = () => { }
    console.warn = () => { }
    super();
    this.state = {
      route:'client-or-restaurant'
    }
  }

  render(){
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ClientOrRestaurant />}></Route>
          <Route path="RestaurantSignIn" element={<RestaurantSignIn />}></Route>
          <Route path="TableScreen" element={<TablesScreen />}></Route>
          <Route path="RestaurantSignUp" element={<RestaurantSignUp />}></Route>
          <Route path="RestaurantDataInitializer" element={<RestaurantDataInitilizer />}></Route>
          <Route path="RestaurantPreparationsTypeInitializer" element={<RestaurantPreparationsTypeInitializer/>}></Route>
          <Route path="RestaurantPreparationsInitializer" element={<RestaurantPreparationsInitializer/>}></Route>
          <Route path="ClientSignIn" element={<ClientSignIn />}></Route>
          <Route path="ClientSignUp" element={<ClientSignUp />}></Route>
          <Route path="CommendScreen" element={<CommendScreen />}></Route>
        </Routes>
      </BrowserRouter>
    );  
  }
}

export default App;