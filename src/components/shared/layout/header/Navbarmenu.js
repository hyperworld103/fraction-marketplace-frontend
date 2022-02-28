import React,{useState, useEffect, useContext } from 'react';
import {NavLink, Link, useHistory } from 'react-router-dom';
import whiteIcon from '../../../../assets/nft-logo.png'
import darkIcon from '../../../../assets/nft-logo-dark.png'
import { AppContext } from "../../../../contexts";
import { API } from '../../../../constants/api';
import Cookies from 'universal-cookie';
import * as RiIcons from 'react-icons/ri';
import * as IoIcons from 'react-icons/io';
import { makeStyles } from '@material-ui/core/styles';
import {useTheme} from 'styled-components'

const useStyles = makeStyles(theme => ({
    darkicon: {
        margin: '15px',
        fontSize: '50px',
        padding: '12px',
        border: '1px solid rgb(133, 133, 133)',
        borderRadius: '50%',
        cursor: 'pointer',
        width: '100px',
        color: 'black',
        '@media(min-width: 400px)' : {
            width: '90px'
          },
        '@media(min-width: 420px)' : {
            width: '50px'
        }
    },
    sunnyicon: {
        margin: '15px',
        fontSize: '50px',
        padding: '12px',
        border: '1px solid rgb(133, 133, 133)',
        borderRadius: '50%',
        cursor: 'pointer',
        width: '100px',
        color: 'white',
        '@media(min-width: 400px)' : {
            width: '90px'
          },
        '@media(min-width: 420px)' : {
            width: '50px'
        }
    },
    menuicon: {
        color: 'rgb(133, 133, 133)',
        border: '1px solid rgb(133, 133, 133)',
        fontSize: '45px',
        width: '120px',
        padding: '5px',
        margin: '18px',
        borderRadius: '5px',
        '@media(min-width: 400px)' : {
            width: '100px'
          },
        '@media(min-width: 420px)' : {
            width: '50px'
          },
        '@media(min-width: 990px)' : {
            display: 'none'
          }
    }
}));
const Navbarmenu = () => {
    const styles = useStyles();
    const history = useHistory();
    const [isMenu, setisMenu] = useState(false);
    const [isResponsiveclose, setResponsiveclose] = useState(false);
    const themes = useTheme();
    const {user, setUser, theme, setTheme} = useContext(AppContext);
    const toggleClass = () => {
        setisMenu(isMenu === false ? true : false);
        setResponsiveclose(isResponsiveclose === false ? true : false);
    };

    useEffect(()=>{
        if(!isMenu) setSubMenuCreate(false);
    },[isMenu]);

    let boxClass = ["main-menu menu-right menuq1"];
    if(isMenu) {
        boxClass.push('menuq2');
    }else{
        boxClass.push('');
    }

    const [isSubMenuCreate, setSubMenuCreate] = useState(false);
      
    
    let createSubMenuClass = ["sub__menus"];
    if(isSubMenuCreate) {
        createSubMenuClass.push('sub__menus__Active');
    }else {
        createSubMenuClass.push('');
    }

    const [isSubMenuLogin, setSubMenuLogin] = useState(false);

    const loginSubmenu = () => {
        setSubMenuCreate(false);
        setSubMenuLogin(isSubMenuLogin === false ? true : false);
    };

    let loginSubmenuClass = ["sub__menus"];
    if(isSubMenuLogin) {
        loginSubmenuClass.push('sub__menus__Active');
    } else {
        loginSubmenuClass.push('');
    }

    const logout = () => {
        const cookies = new Cookies();
        cookies.remove("token", {path: "/"}) 
        setUser({    
            authenticated: false,
            user_id: "",
            username: "", 
            email: "",
            exp: 0,
            first_name: "",
            last_name: "",
            phone: "",
            private_key: "",
            public_key: "",
            profile_cover: "",
            profile_image: "",
            paypal: "",
            role: 2,
            status: ""});
        history.push('/');
    }

    const changeTheme = (e, val) => {
        e.preventDefault()
        localStorage.setItem('theme', val);
        setTheme({theme: val})
    }

    return (
    <header className="header__middle" style={{background: themes.light}} >
        {/* Add Logo  */}
        <div className="header__middle__logo">
            <NavLink exact activeClassName='is-active' to="/">
                <img src={theme.theme==='dark'? darkIcon : whiteIcon} alt="CryptoTrades" /> 
            </NavLink>
        </div>
        <div className="header__middle__menus">
            <nav className="main-nav " >
                <ul className={boxClass.join(' ')} style={{background: themes.light}}>
                    <li  className="menu-item" >
                        <NavLink exact activeClassName='is-active' onClick={toggleClass} to={`/marketplace`} style={{color: themes.gray['4']}}> Marketplace </NavLink> 
                    </li>
                    <li className="menu-item " ><NavLink onClick={toggleClass} activeClassName='is-active' to={`/activity`} style={{color: themes.gray['4']}}> Activity </NavLink> </li>
                    <li className="menu-item " ><NavLink onClick={toggleClass} activeClassName='is-active' to={`/fractionalize`} style={{color: themes.gray['4']}}> Fractionalize </NavLink> </li>
                    {user.authenticated?
                        <li onClick={loginSubmenu} className="menu-item sub__menus__arrows" > 
                        <Link to="#" style={{color: themes.gray['4']}}>
                            {user.profile_image===''?
                                <img src={API.server_url + API.user_profile_image + theme.theme == 'light'?'lightnouser.jpg':'darknouser.jpg'} alt="" style={{width: '25px', borderRadius: '50%', margin: '0px 5px 3px'}}></img>
                            :
                                <img src={API.server_url + API.user_profile_image + user.profile_image} alt="" style={{width: '25px', borderRadius: '50%', margin: '0px 5px 3px'}}></img>
                            }                            
                            {user.username} 
                        </Link>
                            <ul className={loginSubmenuClass.join(' ')} style={{background: themes.light}} > 
                                <li className='sub-item'> <NavLink onClick={toggleClass} activeClassName='is-active'  to={`/profile/collected`} style={{color: themes.gray['4']}}> My Profile </NavLink> </li>
                                <li className='sub-item'><NavLink onClick={toggleClass} activeClassName='is-active' to={`/collection/mycollection`} style={{color: themes.gray['4']}}> My Collections </NavLink> </li>
                                <li className='sub-item'><NavLink onClick={toggleClass} activeClassName='is-active' to={`/portfolio`} style={{color: themes.gray['4']}}> Portfolio </NavLink> </li>
                                <li className='sub-item'><NavLink onClick={logout} activeClassName='is-active' to={`/`} style={{color: themes.gray['4']}}> Logout </NavLink> </li>
                            </ul>
                        </li>
                    :
                        <li className="menu-item " ><NavLink onClick={toggleClass} activeClassName='is-active' to={`/login`} style={{color: themes.gray['4']}}> Login </NavLink> </li> 
                    }       
                </ul>
            </nav>     
        </div> 
        {theme.theme==='dark'?
            <IoIcons.IoIosSunny onClick={(e)=>changeTheme(e, 'light')} className={styles.sunnyicon}/>
        :
            <RiIcons.RiMoonLine onClick={(e)=>changeTheme(e, 'dark')} className={styles.darkicon}/>
        }        
        <RiIcons.RiMenuLine onClick={toggleClass} className={styles.menuicon} />
    </header>
    )
}

export default Navbarmenu
