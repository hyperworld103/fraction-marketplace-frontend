import { notifyWarning } from './NotificationService'

export const validate = (field: string, value: string) => {
    let w_return = true;
    if(value === undefined || value === ''){
        notifyWarning(field + ' is required')
        w_return = false;
    }
    return w_return;
}

export const emailValidate = (email: string) => {
    let w_return = true;
    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) { 
        notifyWarning('Invalidated Email')
        w_return = false;
     }
    return w_return;
}

export const confirmValidate = (password: string, confirm: string) => {
    let w_return = true;
    if(password !== confirm){
        notifyWarning('Invalidated Confirm Password')
        w_return = false;
    }        
    return w_return;
}