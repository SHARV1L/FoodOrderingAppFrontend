import React,{Component} from 'react';
import Header from '../../common/header/Header';
import { Container, Grid, Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {faRupeeSign} from '@fortawesome/free-solid-svg-icons';
import './Home.css';
import{Link} from 'react-router-dom';
class Home extends Component{

    constructor(props){
        super(props);
        this.state= {
            restaurantDetails: [{}],
            filteredRestaurantDetails:[{}],
            //loggedIn:sessionStorage.getItem("access-token")===null?false:true
        };
    }

    //getting all restaurants
    componentWillMount(){
        let restaurantData = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                console.log(JSON.parse(this.responseText));
                that.setState({ restaurantDetails: JSON.parse(this.responseText).restaurants });
                that.setState({filteredRestaurantDetails:JSON.parse(this.responseText).restaurants});
            }
        });

       
        xhr.open("GET", this.props.baseUrl+'restaurant');
        xhr.setRequestHeader("Cache-Control","no-cache");
        xhr.send(restaurantData);
        
    }
    

    applyFilter = (e) =>{
        const searchText = (e.target.value).toLowerCase();
        let restaurantList = JSON.parse(JSON.stringify(this.state.restaurantDetails));
        //let filteredRestaurantDetails = this.state.filteredRestaurantDetails;
        let filteredRestaurantList =[];
        if(restaurantList !== null && restaurantList.length>0){
            filteredRestaurantList = restaurantList.filter((restaurant)=>
            (restaurant.restaurant_name.toLowerCase()).indexOf(searchText)>-1);
            this.setState({
                   restaurantDetails:[...filteredRestaurantList]
            });
        }
       /* if(searchText===null)
        {
            this.setState({
                restaurantDetails:[...filteredRestaurantDetails]
            });
        }*/
    }

  /* detailsHandler =(restaurantId)=>{
        //this.setState({restaurant_id:restaurantId});
        this.props.history.push({pathname:'/restaurant/'+restaurantId,restaurantID:restaurantId});
        
       // console.log(this.restaurant_id);
    }*/
    

    
    render(){
        const{classes}=this.props;
        return(
            <div>
                <div>
                    <Header baseUrl={this.props.baseUrl}  searchHandler={this.applyFilter} showSearchField="true"/>
                </div>
           <div>
               <Container fixed style={{'margin':50}}>
                    <Grid container spacing={3}>
                        {(this.state.restaurantDetails || []).map((restaurant,index)=>(
                        <Grid item xs={12} sm={4} key={"grid"+restaurant.id}>
                       <Link style={{ textDecoration: 'none' }} to={{pathname:'/restaurant/'+restaurant.id} }>
                           <Card className="postCard" key={"card"+restaurant.id}>
                          <CardContent>
                              <CardMedia
                              className="media"
                              image={restaurant.photo_URL}
                              style={{ 'height': 200, 'width': '100%' }}
                             />
                             <Grid container spacing={1}>
                                 <Grid item>
                                    <Typography variant="h4">
                                        {(restaurant.restaurant_name)}
                                    </Typography>
                                    <Typography variant="h6">
                                        {restaurant.categories}
                                    </Typography>
                            <div className="yellow"><span className="white"><FontAwesomeIcon icon={faStar}/>&nbsp;{restaurant.customer_rating}&nbsp;<span>({restaurant.number_customers_rated})</span></span></div><FontAwesomeIcon icon={faRupeeSign} />&nbsp;{restaurant.average_price} for two 
                                    
                                 </Grid>

                             </Grid>
                          </CardContent>
                    </Card>
                    </Link>     
                        </Grid>
                         ))}
                  </Grid>
               </Container>
           </div>
        
            
            </div>

        )
    }
}

export default Home;