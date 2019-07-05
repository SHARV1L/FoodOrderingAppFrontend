import React,{Component} from 'react';
import Home from './screens/home/Home';
import Details from './screens/details/Details';
import Profile from './screens/profile/Profile';
import {BrowserRouter as Router,Route} from 'react-router-dom';
//import history from 'react-router-dom';

class Controller extends Component{
    constructor(props)
    {
        super(props);
        this.baseUrl = "http://localhost:8080/api/";
       // this.loggedIn= sessionStorage.getItem("access-token")===null?false:true;
        
    }
    render(){
        return(
                <Router>
                    <div>
                        <Route exact path='/' render ={(props)=><Home {...props} baseUrl={this.baseUrl} />}/>
                        <Route exact path='/restaurant/:id' render={(props)=><Details {...props} baseUrl={this.baseUrl} />}/>
                        <Route exact path='/profile' render={(props)=><Profile {...props} baseUrl={this.baseUrl}/>}/>
                    </div>
                </Router>
        )
    }
}

export default Controller;