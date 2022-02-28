import { code } from '../messages'
import { notifyError, notifyWarning } from './NotificationService'
import { API } from '../constants/api';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { MarketplaceCollection } from '../types/MarketplaceTypes'

interface CollectionService {
    getCollectionItems(
        paginationLimit: number,
        searchName?: string,
        offset?: number        
    ): Promise<MarketplaceCollection[]>
}

export const getCollectionInfo = async (data: any) => {
    let w_return = {};

    await axios.post(API.server_url + API.collection_detail, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                w_return = data.result;
                notifyWarning(data.message)
            }
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

export const AddCollection = async (data: any) => {
    let w_return = '';
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    await axios.post(API.server_url + API.collection_add, data, headers)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            notifyWarning(data.message)
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

export const UpdateCollection = async (data: any) => {
    let w_return = '';
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    await axios.post(API.server_url + API.collection_update, data, headers)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            notifyWarning(data.message)
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

export const deleteCollection = async (data: any) => {
    let w_return = false;
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    await axios.post(API.server_url + API.collection_delete, data, headers)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            w_return = data.status;
            notifyWarning(data.message)
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

export const imageUpload = async (data: any, field:string) => {
    let w_return = false;
    let url = '';
    if(field === 'logo_img'){
        url = API.server_url + API.collection_logo_image_upload;
    } else {
        url = API.server_url + API.collection_banner_image_upload;
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

export const collectionService = () : CollectionService => {
    return {
        async getCollectionItems(
            paginationLimit,
            searchName: string,
            offset = 0
        ) {
            const cookies = new Cookies()
            const headers = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer '+ cookies.get('token')
                }
            };
            const result_data:MarketplaceCollection[] = [];
            let cond_data = {};
            cond_data['paginationLimit'] = paginationLimit;
            cond_data['offset'] = offset;
            cond_data['searchName'] = searchName;
            cond_data['type'] = 'my';

            try {
                let w_result = await axios.post(API.server_url + API.collection_list, cond_data, headers)
                if(w_result.status === 200){
                    let data:any = w_result.data;
                    if(data.status){
                        let w_cnt = 0;
                        data.data.find(item => {
                            let w_objTemp:MarketplaceCollection = {
                                id: '',
                                address: '',
                                name: '',
                                item_count: 0,
                                banner: '',
                                logo: ''
                            };
                            w_objTemp['id'] = item._id;
                            w_objTemp['address'] = item.contract_address;
                            w_objTemp['name'] = item.name;
                            w_objTemp['item_count'] = item.item_count;
                            w_objTemp['logo'] = item.image;
                            w_objTemp['banner'] = item.banner;
                            result_data[w_cnt] = w_objTemp;

                            w_cnt++;
                        })
                        
                        return result_data;
                    }
                }
                return []
            } catch(error) {
                notifyError(code[5011], error)
                return []
            }
        }
    }
} 

