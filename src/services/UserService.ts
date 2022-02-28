import { code } from '../messages'
import { notifyError, notifyWarning } from './NotificationService'
import { API } from '../constants/api';
import axios from 'axios';
import jwt from 'jwt-decode'
import Cookies from 'universal-cookie';
import { Balances } from '../types/WalletTypes'
import BigNumber from 'bignumber.js';
import { getErc20Balance } from './WalletService';

interface UserService {
    getBalances(): Promise<Balances>
    getErc20Balance(erc20Address: string): Promise<BigNumber>
}

/*
* this function is to request to server for login
*/
export const login = async (data: any) => {
    let w_return = '';
    await axios.post(API.server_url + API.user_login, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                console.log('opt_code: ==========================' + data.opt_code)
                w_return = data.activation_code;
            } 
            notifyWarning(data.message)
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

/*
* this function is to request to server for verifying opt
*/
export const verify = async (data: any) => {
    let w_return = '';
    await axios.post(API.server_url + API.user_opt_verify, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                setCookie(data.token)
                w_return = jwt(data.token);
            }
                
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

/*
* this function is to request to server for saving user data into cookie
*/
const setCookie = (token:string) => {
    let d = new Date();
    d.setTime(d.getTime() + (API.cookie_expire*60*1000));
    const cookies = new Cookies();
    cookies.set("token", token, {path: "/", expires: d, sameSite: 'lax'});
}

/*
* this function is to request to server for register
*/
export const register = async (data: any) => {
    let w_return = '';
    await axios.post(API.server_url + API.user_register, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                w_return = data.activation_code;
            }
            notifyWarning(data.message)
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

/*
* this function is to request to server for forgot password
*/
export const forgot = async (data: any) => {
    let w_return = false;
    await axios.post(API.server_url + API.user_forgot, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            w_return = data.status;
        }
        notifyWarning(data.message)
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

/*
* this function is to request to server for profile image and banner upload
*/
export const imageUpload = async (data: any, field:string) => {
    let w_return = false;
    let url = '';
    if(field === 'profile_image'){
        url = API.server_url + API.user_profile_image_upload;
    } else {
        url = API.server_url + API.user_profile_cover_upload;
    }
    await axios.post(url, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            w_return = data.status;
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

/*
* this function is to request to server for saving image update info
*/
export const updateImageInfo = async (data: any, field:string) => {
    let w_return = {};
    let url = '';
    if(field==='profile_image'){
        url = API.server_url + API.user_update_image_info;
    } else {
        url = API.server_url + API.user_update_cover_info;
    }
    await axios.post(url, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                setCookie(data.token)
                w_return = jwt(data.token);
            }
                
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

/*
* this function is to request to server for profile update
*/
export const updateProfile = async (data: any) => {
    let w_return = {};
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    await axios.post(API.server_url + API.user_update, data, headers)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                setCookie(data.token)
                w_return = jwt(data.token);
                notifyWarning(data.message)
            }
                
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })
    
    return w_return;
}

/*
* this function is to request to server for reset password
*/
export const resetPassword = async (data: any) => {
    let w_return = false;
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    await axios.post(API.server_url + API.user_reset, data, headers)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            notifyWarning(data.message)
            w_return = data.status;                
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })
    
    return w_return;
}

/*
* this function is to request to server for password change
*/
export const changePassword = async (data: any) => {
    let w_return = false;
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    await axios.post(API.server_url + API.user_change, data, headers)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            notifyWarning(data.message)
            w_return = data.status;                
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })
    
    return w_return;
}

/*
* this function is to request to server for user's balance
*/
export const userService = () : UserService => {
    return {
        async getBalances() {
            let w_return:Balances = {eth: 0, usdc: 0};
            const cookies = new Cookies()
            const headers = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer '+ cookies.get('token')
                }
            };

            await axios.get(API.server_url + API.user_balance, headers)
            .then(response => {
                if(response.status === 200) {
                    let data:any = response.data;
                    if(data.status){
                        w_return = data.data;
                    }
                }
            })   
            .catch(error => {
                notifyError(code[5011], error)
                return;
            }) 

            return w_return;
        },
        async getErc20Balance(erc20Address?: string) {
            let w_return:BigNumber;
            const cookies = new Cookies()
            const headers = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer '+ cookies.get('token')
                }
            };

            let cond_data = {}
            cond_data['erc20Address'] = erc20Address;

            await axios.post(API.server_url + API.user_erc20_balance, cond_data, headers)
            .then(response => {
                if(response.status === 200) {
                    let data:any = response.data;
                    if(data.status){
                        w_return = data.data;
                    }
                }
            })   
            .catch(error => {
                notifyError(code[5011], error)
                return;
            }) 

            return w_return;
        }        
    }
}
