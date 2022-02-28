import { Alert, Button, Checkbox, Image, ImageProps, Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { RcFile } from 'antd/es/upload'
import Dragger from 'antd/es/upload/Dragger'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import mintAudioType from '../assets/mint-audio.svg'
import mintImageType from '../assets/mint-image.svg'
import mintVideoType from '../assets/mint-video.svg'
import mintImageTypeDefault from '../assets/mintImageTypeDefault.png'
import { notifyError, notifySuccess } from '../services/NotificationService'
import { colors, colorsV2, fonts, viewport, viewportV2 } from '../styles/variables'
import { Erc721Attribute, Erc721Properties } from '../types/UtilTypes'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { PinataIpfsService } from '../services/IpfsService'
import { code } from '../messages'
import { mintErc721 } from '../services/MintService'

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

export default function MintPage() {
  const history = useHistory()
  const { collectionId } = useParams<{ collectionId: string }>()
  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [author, setAuthor] = useState<string>()
  const [socialMedia, setSocialMedia] = useState<string>()
  const [isSensitiveContent, setIsSensitiveContent] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nftImageUrl, setNftImageUrl] = useState<string | undefined>(undefined)
  const [nftImage, setNftImage] = useState<File | undefined>(undefined)
  const [nftVideo, setNftVideo] = useState<File | undefined>(undefined)
  const [nftAudio, setNftAudio] = useState<File | undefined>(undefined)
  const [isVisible, setIsVisible] = useState(false)
  const [supply, setSupply] = useState<number>(0)

  const routeNftType = history.location.pathname.split('/')[3] as 'image' | 'video' | 'audio'
  const [nftType, setNftType] = useState<'image' | 'video' | 'audio'>(routeNftType)

  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false)
  const [erc721Properties, setErc721Properties] = useState<Erc721Attribute[]>([{ trait_type: '', value: '' }])
  const [alt, setAlt] = useState<string>('')

  function setVisible() {
    setIsVisible(!isVisible)
  }

  useEffect(() => {
    setNftType(routeNftType)
  }, [routeNftType])

  const mintNft = async () => {
    setIsLoading(true)

    const properties: Erc721Properties = {
      name: {
        type: 'string',
        description: title || ''
      },
      created_at: {
        type: 'string',
        description: new Date().toJSON()
      }
    }

    if (description) {
      properties['description'] = {
        type: 'string',
        description
      }
    }

    if (nftType === 'video' || nftType === 'audio') {
      properties['preview_media_file_type'] = {
        type: 'string',
        description: nftType === 'video' ? 'video/mp4' : 'audio/mpeg'
      }
    } else {
      properties['preview_media_file_type'] = {
        type: 'string',
        description: 'image/png,image/jpeg'
      }
    }

    const nftMetadataJson: Erc721Metadata = {
      name: title || '',
      description: description || '',
      author: author || '',
      social_media: socialMedia || '',
      sensitive_content: `${isSensitiveContent}`,
      attributes: erc721Properties,
      properties,
      alt: alt || ''
    }

    const nftMetadata = nftImage && (await PinataIpfsService().uploadToIpfs(nftMetadataJson, nftImage, nftVideo, nftAudio))

    if (!nftMetadata || nftMetadata.error) {
      notifyError(nftMetadata && nftMetadata.error ? nftMetadata.error : code[5011])
      setIsLoading(false)
      return
    }
    let w_ret = nftMetadata.cid && await mintErc721( title, description, nftMetadata.image, nftMetadata.animation_url, nftMetadata.cid, collectionId, nftType)
    setIsLoading(false)
    if(w_ret == '') return;
    notifySuccess('NFT minted successfully! You will be redirected to the fractionalize page in a few seconds')
    history.push(`/wallet/fractionalize`)
  }

  const handleImageUpload = (file: RcFile) => {
    setNftImageUrl(undefined)

    const isBiggerThanLimitFilesize = file.size / 1024 / 1024 > (nftType === 'image' ? 75 : 5)

    if (isBiggerThanLimitFilesize) {
      notifyError(`The media file must be equal or smaller than ${nftType === 'image' ? 75 : 5}MB`)
      return false
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setNftImageUrl((reader.result as string) || '')
    }
    setNftImage(file)
    return false
  }

  const handleVideoUpload = (file: RcFile) => {
    setNftVideo(undefined)

    const isBiggerThanLimitFilesize = file.size / 1024 / 1024 > 75

    if (isBiggerThanLimitFilesize) {
      notifyError('The media file must be equal or smaller than 75MB')
      return false
    }
    setNftVideo(file)
    return false
  }

  const handleAudioUpload = (file: RcFile) => {
    setNftAudio(undefined)

    const isBiggerThanLimitFilesize = file.size / 1024 / 1024 > 75

    if (isBiggerThanLimitFilesize) {
      notifyError('The media file must be equal or smaller than 75MB')
      return false
    }
    setNftAudio(file)
    return false
  }

  const handleImageRemoval = () => {
    setNftImageUrl(undefined)
    return true
  }

  const handleVideoRemoval = () => {
    setNftVideo(undefined)
    return true
  }

  const handleAudioRemoval = () => {
    setNftAudio(undefined)
    return true
  }

  const isReadyToMint = (): boolean => {
    let mediaUpload = nftType === 'video' ? nftVideo && nftImage : nftImage

    if (nftType === 'audio') {
      mediaUpload = nftAudio && nftImage
    }

    return !!(mediaUpload && title && author) //&& !!account
  }

  const handleSetNftType = (selectedNftType: 'video' | 'image' | 'audio') => {
    history.push(`/create/${collectionId}/${selectedNftType}`)
    setNftVideo(undefined)
    setNftAudio(undefined)
    setNftImage(undefined)
    setNftImageUrl(undefined)
  }

  const handlePropertyChange = (index: number, value: string, type: 'name' | 'value') => {
    const values = [...erc721Properties]
    if (type === 'name') {
      values[index].trait_type = value
    } else {
      values[index].value = value
    }

    setErc721Properties(values)
  }

  const handlePropertyAction = (index: number) => {
    if (index + 1 === erc721Properties.length) {
      setErc721Properties([...erc721Properties, { trait_type: '', value: '' }])
      return
    }

    setErc721Properties(erc721Properties.filter((property, propertyIndex) => propertyIndex !== index))
  }

  return (
    <DefaultPageTemplate>
      <S.Container>
        <header>
          <span>Mint your NFT</span>
          <small>(ERC721)</small>
        </header>
        <div>
          <S.ItemCreation>
            <div>
              <h3>Type</h3>
              <S.NftTypeWrapper>
                <button type='button' onClick={() => handleSetNftType('image')} className={nftType === 'image' ? 'active' : ''}>
                  <S.Media alt='Mint' src={mintImageType} />
                  <span>Image</span>
                </button>
                <button type='button' onClick={() => handleSetNftType('video')} className={nftType === 'video' ? 'active' : ''}>
                  <S.Media alt='Mint' src={mintVideoType} />
                  <span>Video</span>
                </button>
                <button type='button' onClick={() => handleSetNftType('audio')} className={nftType === 'audio' ? 'active' : ''}>
                  <S.Media alt='Mint' src={mintAudioType} />
                  <span>Audio</span>
                </button>
              </S.NftTypeWrapper>
            </div>
            <S.MediaUploadWrapper>
              <div>
                <h3>Upload</h3>
                <h4>{nftType === 'image' ? 'Image' : 'Cover'}</h4>
                <Dragger
                  id='fileUpload'
                  maxCount={1}
                  name='file'
                  onRemove={handleImageRemoval}
                  beforeUpload={handleImageUpload}
                  accept='image/png,image/jpeg,image/gif,image/tiff'>
                  <p className='ant-upload-drag-icon'>
                    <S.Button>Choose File</S.Button>
                  </p>
                  <p className='ant-upload-hint'>
                    {`Supports GIF, JPG, PNG and TIFF. Max file size: ${nftType === 'image' ? '75' : '5'}MB.`}
                  </p>
                </Dragger>
              </div>
              {nftType === 'video' && (
                <div>
                  <h4>Video</h4>
                  <Dragger
                    id='videoUpload'
                    maxCount={1}
                    name='videoFile'
                    onRemove={handleVideoRemoval}
                    beforeUpload={handleVideoUpload}
                    accept='video/mp4'>
                    <p className='ant-upload-drag-icon'>
                      <S.Button>Choose File</S.Button>
                    </p>
                    <p className='ant-upload-hint'>Supports MP4 videos. Max file size: 75MB.</p>
                  </Dragger>
                </div>
              )}
              {nftType === 'audio' && (
                <div>
                  <h4>Audio</h4>
                  <Dragger
                    id='audioUpload'
                    maxCount={1}
                    name='audioFile'
                    onRemove={handleAudioRemoval}
                    beforeUpload={handleAudioUpload}
                    accept='audio/mpeg'>
                    <p className='ant-upload-drag-icon'>
                      <S.Button>Choose File</S.Button>
                    </p>
                    <p className='ant-upload-hint'>Supports MP3 audios. Max file size: 75MB.</p>
                  </Dragger>
                </div>
              )}
            </S.MediaUploadWrapper>
            <div>
              <h3>Title</h3>
              <S.Input maxLength={60} value={title} onChange={event => setTitle(event.target.value)} />
            </div>
            <div>
              <h3>Author</h3>
              <S.Input maxLength={60} value={author} onChange={event => setAuthor(event.target.value)} />
            </div>
            <div>
              <h3>Social Media URL</h3>
              <S.Input maxLength={255} value={socialMedia} onChange={event => setSocialMedia(event.target.value)} />
            </div>
            <div>
              <h3>Description</h3>
              <S.TextArea maxLength={1000} showCount rows={4} value={description} onChange={event => setDescription(event.target.value)} />
            </div>
            <div>
              <h3>Supply</h3>
              <S.Input type='number' maxLength={'50'} value={supply} onChange={event => setSupply(event.target.value)} />
            </div>
            <div>
              <S.Button className='advanced-settings' onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
                {`${showAdvancedSettings ? 'Hide' : 'Show'} advanced settings`}
              </S.Button>
            </div>
            {showAdvancedSettings && (
              <div>
                <h3>Attributes (optional)</h3>
                {erc721Properties &&
                  erc721Properties.map((erc721Property, index) => (
                    <S.PropertyItem className='nft-property' key={`item-${index + 1}`}>
                      <S.Input
                        name='name'
                        onChange={event => handlePropertyChange(index, event.target.value, 'name')}
                        placeholder='E.g. Size'
                        value={erc721Property.trait_type}
                      />
                      <S.Input
                        name='value'
                        onChange={event => handlePropertyChange(index, event.target.value, 'value')}
                        placeholder='E.g. M'
                        value={erc721Property.value}
                      />
                      <S.Button onClick={() => handlePropertyAction(index)}>
                        {`${index + 1 === erc721Properties.length ? '+' : '-'}`}
                      </S.Button>
                    </S.PropertyItem>
                  ))}
              </div>
            )}
            {showAdvancedSettings && (
              <div>
                <h3>Alternative text for NFT (optional)</h3>
                <S.Input
                  value={alt}
                  onChange={event => setAlt(event.target.value)}
                  placeholder='Image description in details (do not start with word “image”)'
                />
              </div>
            )}
            <S.AcceptTerms>
              <span>
                <S.Checkbox checked={isSensitiveContent} onChange={event => setIsSensitiveContent(event.target.checked)} />
                <span> Content is 18+</span>
              </span>
            </S.AcceptTerms>
            <div>
              <p className='less-attractive'>
                Once your NFT is minted on the blockchain, you will not be able to edit or update any of its information.
              </p>
              <br />
              <p className='less-attractive'>
                You agree that any information uploaded to the Blockchain NFT Minter will not contain material subject to copyright or other
                proprietary rights, unless you have necessary permission or are otherwise legally entitled to post the material.
              </p>
            </div>
            <div>
              <S.Button loading={isLoading} disabled={!isReadyToMint()} onClick={mintNft}>
                Create item
              </S.Button>
            </div>
          </S.ItemCreation>
          <S.Preview>
            <h3>Preview</h3>
            <div>
              <div>
                <S.Card>
                  <div>
                    <S.ImageWrapper>
                      <S.Image src={nftImageUrl || mintImageTypeDefault} onPreviewClose={setVisible} loading='lazy' />
                      {isVisible && <div className='title-image-nft'>{title || ''}</div>}
                    </S.ImageWrapper>
                  </div>
                  <div>
                    <span>NFT</span>
                    <span className='preview-title'>{title}</span>
                  </div>
                </S.Card>
              </div>
              <div>
                <h4>Author</h4>
                <p>{author}</p>
                <h4>Social Media</h4>
                <p>{socialMedia}</p>
                <h4>Description</h4>
                <p>{description}</p>
              </div>
            </div>
          </S.Preview>
        </div>
      </S.Container>
    </DefaultPageTemplate>
  )
}

const S = {
  Container: styled.div`
    width: 100%;
    max-width: ${viewportV2.desktopXl};
    margin: 0 auto;

    > div {
      display: flex;
      margin-top: 24px;
      justify-content: center;

      @media (max-width: ${viewport.sm}) {
        flex-direction: column;
        &:first-child {
          margin-bottom: 24px;
        }
      }
    }

    header {
      display: flex;
      margin-top: 24px;
      justify-content: center;
      align-items: center;
      margin-bottom: 48px;
      span {
        color: ${colors.gray12};
        font-weight: 600;
        font-size: 38px;
        @media (max-width: ${viewport.sm}) {
          margin: 0;
          font-size: 20px;
        }
      }

      small {
        font-size: 16px;
        font-weight: bold;
        color: ${colors.gray12};
        margin-left: 8px;

        @media (max-width: ${viewport.sm}) {
          font-size: 12px;
          margin: 0;
        }
      }
    }

    h3 {
      font-weight: 400;
      font-size: 16px;
      margin-bottom: 8px;
      color: ${(props)=>props.theme.gray['4']};
    }

    h4 {
      font-weight: 400;
      font-size: 12px;
      color: ${(props)=>props.theme.gray['4']};
    }

    p,
    span {
      font-weight: 400;
      font-size: 16px;
      color: ${(props)=>props.theme.gray['4']};
      &.less-attractive {
        color: #888;
      }
    }

    .ant-upload-hint {
      font-weight: 400;
    }
  `,
  AcceptTerms: styled.div`
    > p {
      margin-top: 8px;
    }
  `,
  Preview: styled.div`
    max-width: 312px;

    @media (max-width: ${viewport.sm}) {
      max-width: none;
    }

    > div {
      display: flex;
      flex-direction: column;

      > div {
        &:first-child {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto;
          margin-bottom: 16px;

          > div {
            margin-left: 0;
            height: 370px;

            @media (max-width: ${viewport.sm}) {
              width: 100%;
            }
          }
        }

        &:last-child {
          p {
            font-weight: 400;
            font-size: 10px;
            min-height: 20px;
            margin-bottom: 8px;
            word-break: break-all;
            white-space: break-spaces;
            color: ${(props)=>props.theme.gray['4']};
          }
        }
      }
    }
  `,
  Checkbox: styled(Checkbox)`
    .ant-checkbox-inner {
      border-radius: 50%;
    }
  `,
  Button: styled(Button)`
    border-radius: 8px;
    background-color: ${colors.blue1};
    color: ${colors.white};
    border: none;
    box-shadow: none;
    width: 100%;
    height: 40px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${colors.blue1};
      color: ${colors.white};
      opacity: 0.8;
      box-shadow: none;
      border: none;
    }

    &:disabled {
      &:hover,
      &:active,
      &:focus {
        background-color: ${colors.blue1};
        color: ${colors.white};
        opacity: 0.6;
        box-shadow: none;
        border: none;
      }

      background-color: ${colors.blue1};
      color: ${colors.white};
      opacity: 0.6;
      box-shadow: none;
      border: none;
    }

    &.advanced-settings {
      background-color: ${colors.gray11};

      &:hover,
      &:active,
      &:focus {
        background-color: ${colors.gray11};
      }

      &:disabled {
        &:hover,
        &:active,
        &:focus {
          background-color: ${colors.gray11};
          opacity: 0.6;
          box-shadow: none;
          border: none;
        }
      }
    }
    > span {
      color: white;
    }
  `,
  Input: styled(Input)`
    border-radius: 8px;
    border: none;
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 5%);
    color: ${(props)=>props.theme.gray['4']};
    background: ${(props)=>props.theme.gray['0']};
    border: 1px solid ${(props)=>props.theme.gray['2']};
  `,
  TextArea: styled(TextArea)`
    border-radius: 8px;
    border: none;
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 5%);
    .ant-input {
      color: ${(props)=>props.theme.gray['4']};
      background: ${(props)=>props.theme.gray['0']};
      border: 1px solid ${(props)=>props.theme.gray['2']};
    }
  `,
  NftTypeWrapper: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    @media (min-width: 400px) {
      gap: 24px;
    }
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      gap: 50px;
    }
    > button {
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      background: ${colors.gray13};
      box-sizing: border-box;
      border-radius: 8px;
      width: 112px;
      height: 112px;
      transition-property: opacity;
      transition-timing-function: ease-in;
      transition-duration: 250ms;

      > span {
        font-size: 14px;
        line-height: 16px;
        font-weight: 400;
      }

      &.active {
        border: 1px solid ${colorsV2.blue.lighter};
      }

      &:hover {
        opacity: 0.65;
      }
    }
  `,
  MediaUploadWrapper: styled.div`
    margin-top: 40px !important;
    display: flex;
    justify-content: flex-start;

    .ant-btn {
      margin-top: 8px;
      width: 80%;
    }

    min-height: 166px;
    @media (max-width: ${viewport.sm}) {
      min-height: 188px;
    }

    > div {
      height: 100%;
      width: 100%;

      > h4 {
        margin-bottom: 8px;
      }

      &:only-child {
        max-width: 528px;
        @media (max-width: ${viewport.sm}) {
          max-width: none;
        }
      }

      &:not(:only-child) {
        max-width: 256px;
        @media (max-width: ${viewport.sm}) {
          max-width: none;
        }
      }

      &:not(:first-child) {
        margin-left: 16px;
        margin-top: 28px;
        @media (max-width: ${viewport.sm}) {
          margin-top: 16px;
          margin-left: auto;
        }
      }
    }

    @media (max-width: ${viewport.sm}) {
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }
  `,
  Alert: styled(Alert)`
    border-radius: 8px;
    font-weight: 400;

    .ant-alert-message {
      margin-bottom: 8px;
      font-size: 14px;
    }
  `,
  ItemCreation: styled.div`
    max-width: 528px;
    margin-right: 40px;

    @media (max-width: ${viewport.sm}) {
      margin-right: 0;
      margin-bottom: 24px;
    }

    > div {
      margin-top: 24px;
    }

    div:nth-child(1) {
      margin-top: 0px;
    }

    > button {
      text-transform: uppercase;
      margin-top: 32px;
      width: 100%;
    }
  `,
  PropertyItem: styled.div`
    display: grid;
    grid-template-columns: 4fr 4fr 1fr;
    gap: 16px;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    > input {
      border-radius: 8px;
      height: 40px;
    }

    > button {
      border: none;
      box-shadow: none;
      height: 40px;
      border-radius: 8px;
      background-color: ${colors.gray11};
      color: ${colors.white};
      > span {
        font-size: 24px;
        line-height: 24px;
      }

      &:hover,
      &:active,
      &:focus {
        border: none;
        box-shadow: none;
        background-color: ${colors.gray11};
        color: ${colors.white};
        opacity: 0.6;
      }
    }
  `,
  Card: styled.div`
    width: 304px;
    padding: 16px;
    height: 370px;
    border: 1px solid transparent;
    box-sizing: border-box;
    border-radius: 8px;
    justify-content: center;
    box-shadow: 1px 1px 5px hsla(0, 0%, 0%, 0.05);
    background: ${colorsV2.white};

    &:hover {
      cursor: pointer;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow ease-in 250ms;
    }

    @media (max-width: ${viewport.md}) {
      margin: 0 auto;
    }

    > div {
      &:first-child {
        width: 100%;
        height: 270px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 8px;
        margin-bottom: 8px;
      }

      &:last-child {
        border-top: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        > span {
          color: ${colorsV2.gray['4']};
          font-size: 10px;
          font-weight: 400;
          line-height: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 13px;
          margin-top: 8px;

          &:last-child {
            color: ${colorsV2.gray['4']};
            margin-top: 4px;
            font-size: 14px;
            height: 18px;
            font-weight: 500;
            line-height: 18px;
          }
        }
      }
    }
  `,
  BoxImage: styled.div`
    width: 100%;
    height: 270px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 8px;

    .ant-skeleton {
      height: 270px;
      display: flex;
      align-items: center;
    }
  `,
  ImageWrapper: styled.div`
    display: flex;
    justify-content: center;
    width: auto;
    height: auto;
    .title-image-nft {
      position: fixed;
      bottom: 20px;
      left: 20px;
      color: black;
      font-weight: 400;
      font-size: 1.5rem;
      z-index: 999999;
      font-family: ${fonts.nunito};
    }

    > .ant-image {
      width: 100%;
      height: 100%;
    }

    .ant-image-mask-info {
      text-align: center;
      @media (max-width: ${viewport.md}) {
        display: none;
      }
    }

    .ant-image-mask-info {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      font-size: 1.6rem;
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: 400;
    }
  `,
  Image: styled(Image)<ImageProps>`
    border-radius: 8px;
    object-fit: cover;
    height: auto;
    max-height: 279px;
  `,
  Media: styled.img `
    width: 90px;
    height: 90px;
    margin-top: 35px;
    margin-bottom: 20px;
  `
}
