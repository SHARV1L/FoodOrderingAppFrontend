import React,{Component} from 'react';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import FastFoodIcon from '@material-ui/icons/Fastfood';
import './Header.css';
import { InputAdornment, TextField, Button, useScrollTrigger } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import InputLabel from '@material-ui/core/InputLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';

//import history from 'react-router-dom';


const TabContainer = function(props){
    return(
            <Typography component="div" style={{padding:0, textAlign:'center'}}>
                {props.children}
            </Typography>
    );
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}

const styles = theme => ({
    searchUnderline: {
        '&:after': {
            borderBottomColor: 'white',
        },
    },
});

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
      backgroundColor: '#DFDFDF',
      padding: 8,
      marginTop: 4,
    },
  })(props => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));

 const StyledMenuItem = withStyles(theme => ({
    root: {
      padding: 4,
      minHeight: 'auto',
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);
class Header extends Component
{

    constructor()
    {
        super();
        this.state = {
            modalIsOpen: false,
            value: 0,
            username: "",
            usernameRequired: "dispNone",
            loginPasswordRequired: "dispNone",
            loginpassword: "",
            firstnameRequired: "dispNone",
            firstname: "",
            lastnameRequired: "dispNone",
            lastname: "",
            emailRequired: "dispNone",
            email: "",
            registerPasswordRequired: "dispNone",
            registerPassword: "",
            contactRequired: "dispNone",
            contact: "",
            invalidNumber: "dispNone",
            invalidPassword:"dispNone",
            invalidContact:"dispNone",
            invalidEmail:"dispNone",
            searchText:'',
            registrationSuccess:false,
            loggedInUserFirstname:'',
            loggedInUserLastname:'',
            loggedInUserEmail:'',
            loggedInUserContact:'',
            anchorEl: null,
            loggedIn:sessionStorage.getItem('access-token')==null?false:true,
            openLoginSuccessMsg: false,
            openSignupSuccessMsg: false,
            loginPasswordRequiredMsg:'required'
            
            
        }
    }
    openModalHandler=()=>{
        this.setState({
            modalIsOpen:true,
            value:0,
            loginPasswordRequired: "dispNone",
            loginpassword: "",
            firstnameRequired: "dispNone",
            firstname: "",
            lastnameRequired: "dispNone",
            lastname: "",
            emailRequired: "dispNone",
            email: "",
            registerPasswordRequired: "dispNone",
            registerPassword: "",
            contactRequired: "dispNone",
            contact: ""
        })
}


closeModalHandler = () => {
    this.setState({modalIsOpen:false})
}

tabChangeHandler = (event, value) => {
    this.setState({value});
}

loginClickHandler = () => {
    this.state.username === "" ? this.setState({userNameRequired: "dispBlock"}): 
    this.setState({userNameRequired: "dispNone"});
    this.state.username.length < 10? this.setState({invalidNumber:"dispBlock"}):
    this.setState({invalidNumber:"dispNone"});
    isNaN(this.state.username)||this.state.username.length !== 10 ? this.setState({invalidNumber: "dispBLock"}):
    this.setState({invalidNumber: "dispNone"});
    this.state.loginpassword === "" ? this.setState({ loginPasswordRequired: "dispBlock" }): 
    this.setState({ loginPasswordRequired: "dispNone" });

    let dataLogin=null;
    let xhrLogin= new XMLHttpRequest();
    let that=this;
    xhrLogin.addEventListener("readystatechange",function(){
        if(this.readyState===4){
            let responseText = JSON.parse(this.responseText);

                if (responseText.code === 'ATH-001' || responseText.code === 'ATH-002') {
                    that.setState({
                        loginPasswordRequired: 'dispBlock',
                        loginPasswordRequiredMsg: responseText.message,
                    });
                    return;
                }
                if(xhrLogin.getResponseHeader("access-token")==null)
                {
                    that.setState({
                        loginPasswordRequired:'dispBlock',
                        loginPasswordRequiredMsg:'Invalid Credentials!Please Try Again',
                        openLoginSuccessMsg:false
                    });
                    return;
                }
            sessionStorage.setItem('uuid',JSON.parse(this.responseText).id);
            sessionStorage.setItem('access-token',xhrLogin.getResponseHeader("access-token"));
            that.setState({loggedInUserFirstname:this.responseText.first_name,
            loggedInUserContact:this.responseText.contact_number,
            loggedInUserLastname:this.responseText.last_name,
            loggedInUserEmail:this.responseText.email_address,
            
            
             });
             if(sessionStorage.getItem('access-token')!==null){
                 that.setState({openLoginSuccessMsg:true});
             }
            console.log(JSON.parse(this.responseText));

            that.closeModalHandler();
        }
    });

    xhrLogin.open("POST","http://localhost:8080/api/customer/login");
    xhrLogin.setRequestHeader("authorization","Basic"+window.btoa(this.state.username+":"+this.state.loginpassword));
    xhrLogin.setRequestHeader("Cache-Control","no-cache");
    xhrLogin.setRequestHeader("Content-Type","application/json");
    xhrLogin.send(dataLogin);
}

inputUsernameChangeHandler = (e) => {
    this.setState({username: e.target.value});
}

inputLoginPasswordChangeHandler = (e) => {
    this.setState({ loginpassword: e.target.value});
}

signupClickHandler = () => {
    var number= /[0-9]/g;
    var upperCase= /[A-Z]/g;
    var lowerCase= /[a-z]/g;
    var special= /[!@#$%^&*]/g;
    var emailFormat = /^\w([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var contactFormat = /^\d{10}$/;
    this.state.firstname === "" ? this.setState({ firstnameRequired: "dispBlock" }) : this.setState({ firstnameRequired: "dispNone" });
    this.state.lastname === "" ? this.setState({ lastnameRequired: "dispBlock" }) : this.setState({ lastnameRequired: "dispNone" });
    this.state.email === "" ? this.setState({ emailRequired: "dispBlock" }) : this.setState({ emailRequired: "dispNone" });
    (this.state.email === "" || (this.state.email.match(emailFormat))) ? this.setState({invalidEmail : "dispNone"}) : this.setState({invalidEmail : "dispBlock"});
    this.state.registerPassword === ""  ? this.setState({ registerPasswordRequired: "dispBlock" }) 
    : this.setState({ registerPasswordRequired: "dispNone" });
    (this.state.registerPassword === ""||(this.state.registerPassword.match(number)&&this.state.registerPassword.match(upperCase)
    && this.state.registerPassword.match(special) && this.state.registerPassword.match(lowerCase)))?this.setState({invalidPassword : "dispNone"})
    : this.setState({invalidPassword:"dispBlock"});
    this.state.contact === "" ? this.setState({ contactRequired: "dispBlock" }) : this.setState({ contactRequired: "dispNone" });
    (this.state.contact === "" || (this.state.contact.match(contactFormat))||(this.state.contact.match(number))) ? this.setState({invalidContact : "dispNone"}) : this.setState({invalidContact : "dispBlock"});

    let signUpData= JSON.stringify(
        {
    "contact_number": this.state.contact,
  "email_address": this.state.email,
  "first_name": this.state.firstname,
  "last_name": this.state.lastname,
  "password": this.state.registerPassword
        }
    )
    let xhrSignUp = new XMLHttpRequest();
    let that=this;
    xhrSignUp.addEventListener("readystatechange",function(){
        if(this.readyState===4)
        {
              console.log(JSON.parse(this.responseText));
              that.setState({
            openSignupSuccessMsg:true,
        value:0});
        }
         }
          );

    xhrSignUp.open("POST",this.props.baseUrl+'customer/signup');
    xhrSignUp.setRequestHeader('Cache-Control','no-cache');
    xhrSignUp.setRequestHeader('Content-Type','application/json');
    xhrSignUp.send(signUpData);
}

inputFirstNameChangeHandler = (e) => {
    this.setState({ firstname: e.target.value });
}

inputLastNameChangeHandler = (e) => {
    this.setState({ lastname: e.target.value });
}

inputEmailChangeHandler = (e) => {
    this.setState({ email: e.target.value });
}

inputRegisterPasswordChangeHandler = (e) => {
    this.setState({ registerPassword: e.target.value });
}

inputContactChangeHandler = (e) => {
    this.setState({ contact: e.target.value });
}
handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
}

handleClose = (tab, e) => {
    this.setState({ anchorEl: null });
}
/* accountHandler=()=>{
     //<Link style={{textDecoration:'none'}}to= "/profile"/>
     this.props.history.push('/profile');
  // ReactDOM.render(<Profile/>,document.getElementById("root"));
 }*/
 logoutHandler=(e)=>{
     sessionStorage.clear();
     this.setState({loggedInUserContact:'',
    loggedInUserEmail:'',
      loggedInUserFirstname:'',
        loggedInUserLastname:'',
    loggedIn:false,
    anchorEl:null
});}

 loginSuccessMsgOnCloseHandler=(event, reason) => {
    if (reason === 'clickaway') {
        return;
    }

    this.setState({ openLoginSuccessMsg: false });
}

signupSuccessMsgOnCloseHandler = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }

    this.setState({ openSignupSuccessMsg: false });
}
    render()
    {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        
        return(<div>
            <header className="appHeader">
            <FastFoodIcon className="whiteColor"/>
          {this.props.showSearchField==='true'?<div id="searchDiv" > <TextField  classes={{underline:classes.searchUnderline}} placeholder="Search By Restaurant Name" InputProps={{
           startAdornment:(
               <InputAdornment position="start">
               <SearchIcon className="whiteColor"/>
               </InputAdornment>
           ),}} onChange={this.props.searchHandler}/>   
               </div> :"" }  
         {this.state.loggedIn===false?
               <div id="loginBtn"><Button  variant="contained" onClick={this.openModalHandler}><AccountCircleIcon/>LOGIN</Button></div>
         :<div id="userProfile"><Button variant="contained" onClick={this.handleClick}
         aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
         aria-haspopup="true"><AccountCircleIcon/>{this.state.loggedInUserFirstname}</Button>
         <StyledMenu id="simple-menu" anchorEl={this.state.anchorEl} 
         open={Boolean(this.state.anchorEl)} 
         onClose={this.handleClose.bind(this,'')}>
            <div>
           <StyledMenuItem className="menu-item" >
         <Link style={{textDecoration:"none"}} to={"/profile"}><ListItemText primary="My Account" /></Link>  
           </StyledMenuItem> 
           <Divider light /> 
         </div>  
           <StyledMenuItem className="menu-item" onClick={this.logoutHandler.bind(this)}>
           <ListItemText primary="Logout" />
           </StyledMenuItem> 
           </StyledMenu></div>  }
            </header>

            <Modal
                    ariaHideApp={false}
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeModalHandler}
                    style={customStyles}>
                    
                    <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label="Login" />
                        <Tab label="Sign Up" />
                    </Tabs>

                {
                    this.state.value === 0 &&
                <TabContainer>
                    <FormControl required>
                        <InputLabel htmlFor="username">Contact Number  </InputLabel>
                        <Input id="username" type="text" username={this.state.username} onChange={this.inputUsernameChangeHandler}/>
                        <FormHelperText className={this.state.contactRequired}><span className="red">required</span></FormHelperText>
                        <FormHelperText className={this.state.invalidNumber}><span className="red">Invalid Contact</span></FormHelperText>
            
                    </FormControl> <br/><br/>
                    <FormControl required>
                        <InputLabel htmlFor="loginpassword"> Password </InputLabel>
                        <Input id="loginpassword" type="password" loginpassword={this.state.loginpassword} onChange={this.inputLoginPasswordChangeHandler}/>
                        <FormHelperText className={this.state.loginPasswordRequired}><span className="red">{this.state.loginPasswordRequiredMsg}</span></FormHelperText>
                    </FormControl><br/><br/>
                    {this.props.loggedIn === true &&
                                <FormControl>
                                    <span className="successText">
                                        Login Successful!
                                    </span>
                                </FormControl>
                            }
                            <br />
                    <Button variant="contained" color="primary" onClick={this.loginClickHandler}>Login</Button>
                </TabContainer>
            }
                {
                    this.state.value === 1 &&
                        <TabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="firstname">First Name</InputLabel>
                                <Input id="firstname" type="text" firstname={this.state.firstname} onChange={this.inputFirstNameChangeHandler} />
                                <FormHelperText className={this.state.firstnameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                <Input id="lastname" type="text" lastname={this.state.lastname} onChange={this.inputLastNameChangeHandler} />
                                <FormHelperText className={this.state.lastnameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" type="text" emailformat = "/^\w([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/" email={this.state.email} onChange={this.inputEmailChangeHandler} />
                                <FormHelperText className={this.state.emailRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.invalidEmail}><span className="red">Invalid Email</span></FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="registerPassword">Password</InputLabel>
                                <Input id="registerPassword" type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" registerpassword={this.state.registerPassword} onChange={this.inputRegisterPasswordChangeHandler} />
                                <FormHelperText className={this.state.registerPasswordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.invalidPassword}><span className="red">Invalid Password!</span></FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="contact">Contact No.</InputLabel>
                                <Input id="contact" type="text" phoneno = "/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/" contact={this.state.contact} onChange={this.inputContactChangeHandler} />
                                <FormHelperText className={this.state.contactRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.invalidContact}><span className="red">Contact No. must contain only numbers<br/> and must be 10 digits long</span></FormHelperText>
                            </FormControl>
                            <br /><br />
                            
                            <Button variant="contained" color="primary" onClick={this.signupClickHandler}>SIGN UP</Button>
                        </TabContainer>
                    }
                </Modal>
                
                {/* login snackbar */}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openLoginSuccessMsg}
                    autoHideDuration={4000}
                    onClose={this.loginSuccessMsgOnCloseHandler}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id='message-id'>Logged in successfully!</span>}
                />

                <Snackbar
                anchorOrigin={{
                    vertical:'bottom',
                    horizontal:'left',
                }}
                open={this.state.openSignupSuccessMsg}
                autoHideDuration={4000}
                onClose={this.signupSuccessMsgOnCloseHandler}
                ContentProps={{
                    'aria-describedby':'message-id',
                }}
                message={<span id='message-id'>Registered successfully! Please login now!</span>}
                />

        </div>)
    }    
}

export default withStyles(styles) (Header);
