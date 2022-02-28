import { useReactiveVar } from '@apollo/client'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import Navbarmenu from '../components/shared/layout/header/Navbarmenu';
import { getFeatureToggleByChainId } from '../featureToggle'
import { ThemeProviderEnum, themeVar } from '../graphql/variables/Shared'
import { chainIdVar } from '../graphql/variables/WalletVariable'
import { Page404 } from '../pages/Page404'
import {AppContext} from '../contexts';
import jwt from 'jwt-decode'
import Cookies from 'universal-cookie';
const BuyPage = lazy(() => import('../pages/BuyPage'))
const ClaimPage = lazy(() => import('../pages/ClaimPage'))
const DisclaimerPage = lazy(() => import('../pages/DisclaimerPage'))
const FarmPage = lazy(() => import('../pages/FarmPage'))
const FractionalizeDetailsPage = lazy(() => import('../pages/FractionalizeDetailsPage'))
const FractionalizePage = lazy(() => import('../pages/FractionalizePage'))
const MainPage = lazy(() => import('../pages/MainPage'))
const MarketplacePage = lazy(() => import('../pages/MarketplacePage'))
const MarketplaceDetailsPage = lazy(() => import('../pages/MarketplaceDetailsPage'))
const MintPage = lazy(() => import('../pages/MintPage'))
const PortfolioPage = lazy(() => import('../pages/PortfolioPage'))
const TransparencyPage = lazy(() => import('../pages/TransparencyPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const SignupPage = lazy(() => import('../pages/SignupPage'))
const EmailVerifyPage = lazy(() => import('../pages/EmailVerifyPage'))
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'))
const ActivityPage = lazy(() => import('../pages/ActivityPage'))
const ProfileCollectedPage = lazy(() => import('../pages/ProfileCollectedPage'))
const ProfileCreatedPage = lazy(() => import('../pages/ProfileCreatedPage'))
const ProfileFavoritedPage = lazy(() => import('../pages/ProfileFavoritedPage'))
const ProfileActivityPage = lazy(() => import('../pages/ProfileActivityPage'))
const ProfileOffersPage = lazy(() => import('../pages/ProfileOffersPage'))
const SettingsWalletPage = lazy(() => import('../pages/SettingsWalletPage'))
const SettingsGeneralPage = lazy(() => import('../pages/SettingsGeneralPage'))
const SettingsChangePasswordPage = lazy(() => import('../pages/SettingsChangePasswordPage'))
const MyCollectionPage = lazy(() => import('../pages/MyCollectionPage'))
const CreateColllectionPage = lazy(() => import('../pages/CreateCollectionPage'))
const CollectionViewPage = lazy(()=>import('../pages/CollectionViewPage'))
const ItemDetailsPage = lazy(() => import('../pages/ItemDetailsPage'))

export default function Routes() {
  const chainId = useReactiveVar(chainIdVar)
  const featureToggle = getFeatureToggleByChainId(chainId)
  const [theme, setTheme] = useState({theme: localStorage.getItem('theme')})

  useEffect(() => {
    if (theme.theme === 'dark') {
      themeVar(ThemeProviderEnum.dark)
    } else {
      themeVar(ThemeProviderEnum.light)
    }
  }, [theme])

  const [user, setUser] = useState({
    authenticated: false,
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
    status: ""
  });

  useEffect(()=>{
    const cookies = new Cookies();
    if(cookies.get('token')){
      cookies.set('token', cookies.get('token'));
      if(user.authenticated) return;
      let userdata = jwt(cookies.get('token'));      
      setUser({
        authenticated: true,
        username: userdata["username"], 
        email: userdata["email"],
        exp: userdata["exp"],
        first_name: userdata["first_name"],
        last_name: userdata["last_name"],
        phone: userdata["phone"],
        private_key: userdata["private_key"],
        public_key: userdata["public_key"],
        profile_cover: userdata["profile_cover"],
        profile_image: userdata["profile_image"],
        paypal: userdata["paypal"],
        role: userdata["role"],
        status: userdata["status"]
      })
    }
  },[])

  return (    
      <Suspense fallback={<Navbarmenu />}>
        <AppContext.Provider value={{user, setUser, theme, setTheme}}>
          <Switch>
            {!featureToggle?.page.marketplaceIntro && <Route path='/' exact component={MainPage} />}
            <Route path='/' exact component={MainPage} />
            <Route path='/transparency' exact component={TransparencyPage} />
            <Route path='/fractionalize' exact component={FractionalizePage} />
            <Route path='/fractionalize/:address/:tokenId' exact component={FractionalizeDetailsPage} />
            <Route path='/portfolio' exact component={PortfolioPage} />
            <Route path='/marketplace' exact component={MarketplacePage} />
            <Route path='/marketplace/:address' exact component={MarketplaceDetailsPage} />
            {featureToggle?.marketplace.collectiveBuy && (
              <Route path='/marketplace/:type/:address/:routeChainId?' exact component={MarketplaceDetailsPage} />
            )}
            <Route path='/marketplace/:address/:routeChainId?' exact component={MarketplaceDetailsPage} />
            <Route path='/wallet/fractionalize' exact component={FractionalizePage} />
            <Route path='/wallet/fractionalize/:itemId' exact component={FractionalizeDetailsPage} />
            <Route path='/wallet/portfolio' exact component={PortfolioPage} />
            <Route path='/create/:collectionId/image' exact component={MintPage} />
            <Route path='/create/:collectionId/video' exact component={MintPage} />
            <Route path='/create/:collectionId/audio' exact component={MintPage} />
            <Route path='/token/transparency' exact component={TransparencyPage} />
            <Route path='/token/buy' exact component={BuyPage} />
            <Route path='/token/farm' exact component={FarmPage} />
            <Route path='/token/claim' exact component={ClaimPage} />
            <Route path='/disclaimer' exact component={DisclaimerPage} />
            <Route path='/login' exact component={LoginPage} />
            <Route path='/register' exact component={SignupPage} />
            <Route path='/email_verify' exact component={EmailVerifyPage} />
            <Route path='/forgot_password' exact component={ForgotPasswordPage} />
            <Route path='/activity' exact component={ActivityPage} />
            <Route path='/profile/collected' exact component={ProfileCollectedPage} />
            <Route path='/profile/created' exact component={ProfileCreatedPage} />
            <Route path='/profile/favorited' exact component={ProfileFavoritedPage} />
            <Route path='/profile/activity' exact component={ProfileActivityPage} />
            <Route path='/profile/offers' exact component={ProfileOffersPage} />            
            <Route path='/settings/wallet' exact component={SettingsWalletPage} />      
            <Route path='/settings/general' exact component={SettingsGeneralPage} />      
            <Route path='/settings/changepassword' exact component={SettingsChangePasswordPage} />
            <Route path='/collection/mycollection' exact component={MyCollectionPage} />
            <Route path='/:mode/collection/:address' exact component={CreateColllectionPage} />
            <Route path='/collection/view/:address' exact component={CollectionViewPage} />
            <Route path='/items/:itemId' exact component={ItemDetailsPage} />
            <Route path='**' component={Page404} />
          </Switch>
        </AppContext.Provider>
      </Suspense>
  )
}
