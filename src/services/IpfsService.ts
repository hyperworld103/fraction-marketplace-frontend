import { Erc721Attribute, Erc721Properties } from '../types/UtilTypes'
import { create } from 'ipfs-http-client'

interface Erc721Metadata {
  name: string
  author: string
  image?: string
  animation_url?: string
  alt?: string
  sensitive_content: string
  description?: string
  social_media?: string
  attributes?: Erc721Attribute[]
  properties: Erc721Properties
}

export interface IpfsFileResponse {
  image?: string,
  animation_url?: string,
  cid?: string
  error?: string
}

interface IpfsService {
  uploadToIpfs(data: Erc721Metadata, image?: File, video?: File | undefined, audio?: File): Promise<IpfsFileResponse>
}

export const PinataIpfsService = (): IpfsService => {
  const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

  return {
    async uploadToIpfs(data, image, video, audio): Promise<IpfsFileResponse> {   
      
      try {
        let w_imageIpfs = await ipfs.add(image)
        data.image = w_imageIpfs['path']
        data.animation_url = ''

        if( image && video ){
          let w_mediaIpfs = await ipfs.add(video)
          data.animation_url = w_mediaIpfs['path']
        } else if( image && audio ) {
          let w_mediaIpfs = await ipfs.add(audio)
          data.animation_url = w_mediaIpfs['path']
        }
          

        const nftMetadataFile = JSON.stringify(data)
        const _cid = await ipfs.add(nftMetadataFile)

        // return {
        //   image: 'QmTdrXMN2fDAKkiYKvQaprWVMDeiDirbiiRm4tEGAFjeBj3', //data.image,
        //   animation_url: 'Qme3qPtFkHhAa6xCsxV4hAHJh2hG1K1UarKUmZM1iJiXAx3', //data.animation_url,
        //   cid: 'QmSppX72tE98tQ7xUEbeNqehDhVqZ67u2AEKnsUkJEWpBb3'//_cid['path']
        // }

        return {
          image: data.image,
          animation_url: data.animation_url,
          cid: _cid['path']
        }
      } catch(e) {
        return { error: 'upload failed' }
      }
    }
  }
}
