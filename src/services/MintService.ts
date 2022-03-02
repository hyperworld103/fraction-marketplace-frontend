import { code } from '../messages'
import { notifyError, notifySuccess } from './NotificationService'
import Cookies from 'universal-cookie';
import { API } from '../constants/api';
import axios from 'axios';

export const mintErc721 = async (name: string, description: string, image: string, media: string, cid: string, collection: string, nftType: string) => {

    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };

    let w_data = { name: name, description: description, thumb: image, media: media, cid: cid, collection_id: collection, category: nftType }
    let w_return = '';

    await axios.post(API.server_url + API.item_add, w_data, headers)
    .then(response => {
        if(response.status == 200){console.log(response)
            let data:any = response.data;
            if(data.status){
                w_return = data.result;               
            }
            notifySuccess(data.message)
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}
