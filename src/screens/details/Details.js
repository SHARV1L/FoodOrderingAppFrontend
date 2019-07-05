import React,{Component} from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {faRupeeSign} from '@fortawesome/free-solid-svg-icons';
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import { grey } from '@material-ui/core/colors';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';


class Details  extends Component{

    constructor(props){
        super(props);
        this.state= {
           restaurantId:null,
            photo_URL:null,
            categories:[{}],
            restaurant_name:null,
            customer_rating:null,
            number_customers_rated:null,
            average_price:null,
            address:[{}],
          };
    

    }
    getCategory = () => {
        
        let dataLength = this.state.categories.length;
        return dataLength > 0 ?
           (this.state.categories||[]).map((category, index) => {
                return <span  key={'categ'+category.id}>{category.category_name}{dataLength === category + 1 ? '' : ', '}  </span>
            }) : null
    }

    getCategoryList=()=>{
        let datalength = this.state.categories.length;
        return datalength > 0 ?
        (this.state.categories||[]).map((category,index)=>{
             return <div key={'categ'+category.id}><h2 className="grey">{category.category_name}</h2><Divider/>
             <div key={'item'+category.id}>{(category.item_list||[]).map((item,index)=>{
                 return <div key={'itemNo'+item.id}><h3><span>{item.item_name}&nbsp;&nbsp;&nbsp;{item.item_type}&nbsp;&nbsp;&nbsp;{item.price}&nbsp;&nbsp;&nbsp;</span></h3></div>
             })}</div></div>
        }):null
    }

    componentWillMount(){
       
        let restaurant = JSON.stringify(this.props.id);
        let xhrRestaurantDetails = new XMLHttpRequest();
        let that=this;
        xhrRestaurantDetails.addEventListener('readystatechange',function(){
         if(this.readyState===4)
         {
            console.log(JSON.parse(this.responseText));
            that.setState({restaurantId:JSON.parse(this.responseText).id});
            that.setState({restaurant_name:JSON.parse(this.responseText).restaurant_name});
            that.setState({address:JSON.parse(this.responseText).address});
            that.setState({categories:JSON.parse(this.responseText).categories});
            that.setState({average_price:JSON.parse(this.responseText).average_price});
            that.setState({number_customers_rated:JSON.parse(this.responseText).number_customers_rated});
            that.setState({photo_URL:JSON.parse(this.responseText).photo_URL});
            that.setState({customer_rating:JSON.parse(this.responseText).customer_rating});
         }
     });
     xhrRestaurantDetails.open('GET',this.props.baseUrl+'restaurant/'+this.props.match.params.id);
     xhrRestaurantDetails.setRequestHeader('Cache-Control','no-cache');
     xhrRestaurantDetails.setRequestHeader("Content-Type", "application/json");
     xhrRestaurantDetails.send(restaurant);
    }

    
        

    
    render(){
        return(
            <div>
                <div><Header baseUrl={this.props.baseUrl} id={this.props.id}  showSearchField='false'/></div>
            
            <div className="flex-containerDetails" className="section">
                <div className="leftDetails">
                    
                        <div>
                        <img src={this.state.photo_URL} style={{width:400,height:280}} /></div>
                        <div style={{margin:50}}>
                        <Typography variant='h2'>{this.state.restaurant_name}</Typography>
                        <h2>{this.state.address.locality}</h2>
                        <h3>{this.getCategory()}</h3><br/>
                         
                        <Typography variant="h6"><FontAwesomeIcon icon={faStar}/>&nbsp;{this.state.customer_rating}</Typography>
                        <Typography variant="h6" className="grey">AVERAGE RATING BY <br/>{this.state.number_customers_rated} CUSTOMERS</Typography>
                        </div>
                        <div style={{marginTop:190}}>
                            <Typography variant='h6'><FontAwesomeIcon icon={faRupeeSign}/>&nbsp;{this.state.average_price}</Typography>
                            <Typography variant='h6' className='grey'>AVERAGE PRICE FOR<br/> TWO PEOPLE</Typography>
                        </div>
                         </div>  
                        
                   </div>
                <Grid container spacing={10}>
                      <Grid item xs={12} sm={7}>{this.getCategoryList()}</Grid>
                </Grid>
                </div>
                
                
                
                
        )
    }
}

export default Details;