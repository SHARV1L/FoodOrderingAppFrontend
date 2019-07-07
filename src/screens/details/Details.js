import React,{Component} from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {faRupeeSign} from '@fortawesome/free-solid-svg-icons';
import { Grid, Icon, CardContent } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import { grey } from '@material-ui/core/colors';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
//import withStyles from '@material-ui/core/styles';



class Details  extends Component{

    constructor(){
        super();
        this.state= {
           restaurantId:null,
            photo_URL:null,
            categories:[{}],
            restaurant_name:null,
            customer_rating:null,
            number_customers_rated:null,
            average_price:null,
            address:[{}],
            totalAmount:0,
            totalCartItems:0,
            checkoutArr:[],
            open: false,
            btnClicked: '',
            
          };
    

    }

    componentWillMount(){
        sessionStorage.removeItem('customer-cart');
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
                {this.getEachItem(category.item_list,category.category_name)}
             </div>
        }):null
    }

    getEachItem(item_list,category_name){
      return (item_list||[]).map((item,index)=>{
             item={...item,'category_name':category_name}
            return <div key={'itemNo'+item.id} ><h3><span className='flexRow'>
               <div className="flex2">{(item.item_type==='NON_VEG')?<FontAwesomeIcon icon={faCircle} style={{color:"red"}}/>
               :<FontAwesomeIcon icon={faCircle} style={{color:"green"}}/>}</div>
               <div className='flex10'>{item.item_name}</div>
               <div className='flex5'><FontAwesomeIcon icon={faRupeeSign}/>&nbsp;{item.price+".00"}</div>
               
               <div className='flex5'><IconButton onClick={this.addItemHandler(item,'ADD')} ><AddIcon/></IconButton></div></span></h3></div>
               
        })}
    

    addItemHandler=(item,method)=>event=>{
        let selectedItem,newAdded;
        let duplicates = this.state.checkoutArr.filter(data => item.id === data.id&&item.category_name===data.category_name);

        if (duplicates.length > 0) {
            selectedItem = this.state.checkoutArr.map(eachItem => {
                if (eachItem.id === duplicates[0].id && eachItem.category_name === duplicates[0].category_name) {
                    let count = eachItem.count + 1;
                    eachItem.count = count;
                    eachItem.totalItemPrice = eachItem.price * count;
                }
                return eachItem;
            })
            newAdded = [...selectedItem];
        } else {
            let count = duplicates.length + 1;
            selectedItem = { ...item, count: count, totalItemPrice: item.price * count };
            newAdded = [...this.state.checkoutArr, selectedItem];
        }

        const itemLength = this.state.totalCartItems + 1;
        const totalPrice = this.state.totalAmount + item.price;
        this.setState({ checkoutArr: newAdded, open: true, btnClicked: method, totalCartItems: itemLength,totalAmount:totalPrice });
        
    }

    removeItemHandler=item => event => {
        const itemLength = this.state.totalCartItems - 1;
        if (item.count === 1) {
            let newArr = [...this.state.checkoutArr];
            newArr.forEach((data, index) => {
                if (item.id === data.id && item.category_name === data.category_name) {
                    newArr.splice(index, 1);
                }
            });
            const totalPrice = this.state.totalPrice - item.price;
            this.setState({ checkoutArr: newArr, totalAmount: totalPrice, open: true, btnClicked: 'REMOVE', totalCartItems: itemLength });
        } else {
            let newArr = [...this.state.checkoutArr];
            newArr.forEach((data, index) => {
                if (item.id === data.id && item.category_name === data.category_name) {
                    newArr[index].count = data.count - 1;
                    newArr[index].totalItemPrice = data.totalItemPrice - data.price;
                }
            })
            const totalPrice = this.state.totalPrice - item.price;
            this.setState({ checkoutArr: newArr, totalAmount: totalPrice, open: true, btnClicked: 'DECREMENT', totalCartItems: itemLength });
        }
    }

    getCartItems=(checkoutArr)=>{
        
           return checkoutArr.map((item,index)=>{
               return <div key={'nested'+item.id}>
            <span className="flexRow"> <div className='flex2'>{(item.item_type==='NON_VEG')?<FontAwesomeIcon icon={faCircle} style={{color:"red"}}/>
               :<FontAwesomeIcon icon={faCircle} style={{color:"green"}}/>}</div>
               <div >{item.item_name}</div>
                <div className='flex2'>
                    <IconButton aria-label="AddIcon" className="btn-hover" style={{ padding: '1px' }} onClick={this.removeItemHandler(item)} >
                        <div className="minus-icon"> - </div>
                    </IconButton>
                    {item.count}
                    <IconButton aria-label="Add" className="btn-hover" style={{ padding: '1px' }} onClick={this.addItemHandler(item, 'INCREMENT')}>
                        <AddIcon className="black-color" />
                    </IconButton>
                    <FontAwesomeIcon className='flex2' icon={faRupeeSign}/>&nbsp;{item.totalItemPrice+.00}
                    </div></span>
                </div>
           })
    }
    checkoutHandler = () => {
        if (this.state.checkoutArr && this.state.checkoutArr.length === 0) {
            this.setState({ open: true, btnClicked: 'CHECKOUT' });
            return;
        }

        if (sessionStorage.getItem('access-token') === null) {
            this.setState({ open: true, btnClicked: 'LOGIN' });
            return;
        }

        let customerCart = {
            restaurantId: this.state.restaurantId,
            restaurant_name:this.state.restaurant_name,
            categories:this.state.categories,
            address:this.state.address,
            totalCartItems:this.state.totalCartItems,
            cartItems: this.state.checkoutArr,
            totalPrice: this.state.totalAmount
        };
        sessionStorage.setItem('customer-cart', JSON.stringify(customerCart));
        this.props.history.push('/checkout');
}

        handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
    
            this.setState({ open: false, btnClicked: '' });
        }
    

    
        

    
    render(){
        return(
            <div>
                <div><Header baseUrl={this.props.baseUrl} showSearchField='false'/></div>
            
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
                      <Grid item xs={12} sm={5}>
                          <Card style={{margin:10,padding:5}}>
                              <CardContent>
                             <div className='flexRow'><Badge badgeContent={this.state.totalCartItems} color="secondary" ><ShoppingCartIcon/></Badge>&nbsp;&nbsp;<h3>My Cart</h3></div> 
                            
                            {this.getCartItems(this.state.checkoutArr)}
                              
                              <Typography >TOTAL AMOUNT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span ><FontAwesomeIcon icon={faRupeeSign}/>{this.state.totalAmount}</span></Typography><br/>
                              <Button variant="contained" fullWidth size="medium" color="primary" onClick={this.checkoutHandler}>CHECKOUT</Button>
                              </CardContent>
                          </Card>
                          </Grid>
                </Grid>
                <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.open}
                        autoHideDuration={4000}
                        onClose={this.handleClose}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">{
                            this.state.btnClicked === 'CHECKOUT' ?
                                'Please add an item to your cart!' :
                                this.state.btnClicked === 'LOGIN' ?
                                    'Please login first!' :
                                    this.state.btnClicked === 'ADD' ?
                                        'Item added to cart!' :
                                        this.state.btnClicked === 'INCREMENT' ?
                                            'Item quantity increased by 1!' :
                                            this.state.btnClicked === 'REMOVE' ?
                                                'Item removed from cart!' :
                                                this.state.btnClicked === 'DECREMENT' ?
                                                    'Item quantity decreased by 1!' : ''}</span>}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                onClick={this.handleClose}
                            >
                                <CloseIcon />
                            </IconButton>,
                        ]}
                    />
                    
                
                </div>
                
                
                
                
        )
    }
}

export default  Details;