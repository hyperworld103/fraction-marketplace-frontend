/*
Project : Cryptotrades
FileName :  api.ts
Author : LinkWell
File Created : 21/07/2021
CopyRights : LinkWell
Purpose : This is the file which contain all api constants used in the application 
*/
export const API = {
    server_url: "http://localhost:5000",
    ipfs_url: "https://ipfs.io/ipfs/",
    etherscan_url: "https://ropsten.etherscan.io/address/", // mainnet: "https://etherscan.io/address/",
    cookie_expire: 60,  //1h
    user_login: "/user/login",
    user_opt_verify: "/user/opt_verify",
    user_profile_image: "/images/user/",
    user_profile_image_upload: '/media/avatar',
    user_update_image_info: '/user/update_profile_image_info',
    user_profile_cover: "/images/cover/",
    user_profile_cover_upload: '/media/cover',
    user_update_cover_info: '/user/update_profile_cover_info',
    user_register:"/user/register",
    user_forgot:"/user/forgot",
    user_reset:"/user/reset",
    user_update: "/user/update",
    user_change: "/user/change",
    user_balance: "/user/getbalances",
    user_erc20_balance: "/user/get_erc20_balances",

    collection_add: "/collection/add",
    collection_update: "/collection/update",
    collection_detail: "/collection/detail",
    collection_delete: "/collection/delete",
    collection_list: "/collection/list",
    collection_logo_image: "/images/collection/logo/",
    collection_logo_image_upload: '/media/collectionlogo',
    collection_banner_image: "/images/collection/banner/",
    collection_banner_image_upload: '/media/collectionbanner',

    item_add: "/item/add",
    item_detail: "/item/detail",
    item_list: "/item/list",
    item_fracApprove: "/item/fractionApprove",
    item_getFracApprove: "/item/getFractionApprove",
    item_getConfirmations: "/item/getConfirmations",
    item_fractionalize: "/item/fractionalize",
    item_fractionAdd: "/item/fractionAdd",
    item_fracList: "/item/fractionList",
    item_fracMarketList: "/item/fractionMarketList",
    item_fractionGet: "/item/fractionGet",
    

    item_createOrder: "/item/createOrder",
    item_updateOrder: "/item/updateOrder",
    item_tradeOrder: "/item/tradeOrder",
    item_listOrder: "/item/listOrder",
    item_listBuyPrices: "/item/listBuyPrices",
    item_listSellPrices: "/item/listSellPrices"
}