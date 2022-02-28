interface PaymentToken {
    id: string
    decimals: number
    symbol: string
}
interface Collection {
    id: string
    name: string
    symbol: string
}
interface Target {
    id: string
    tokenId: string
    tokenURI: string
    collection: Collection
}
interface metadata {
    image:string
    name:string
    author: string
    totalSupply: string
    description: string
    imageFull: string
    animationType: string
    animation_url: string
}
interface Iliquidity {
    priceDollar: string
    hasLiquidity: boolean
}
export interface Erc721Attribute {
    trait_type: string
    value: string
}
interface default_name_type {
    type: string
    description: string
}

export interface Erc721Properties {
    name: default_name_type
    created_at: default_name_type
    preview_media_file_type?: default_name_type
    preview_media_file2?: default_name_type
    preview_media_file_type2?: default_name_type
    preview_media_file2_type?:default_name_type
    totalSupply?:default_name_type
    total_supply?:default_name_type
}
export interface Paged<T> {
    page: number
    per_page: number
    pre_page: number
    next_page: number
    total: number
    total_pages:number
    data:T
}
