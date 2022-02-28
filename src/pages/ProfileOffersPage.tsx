import React from 'react'
import { ProfileOffers } from '../components/profile/ProfileOffers'
import { ProfilePageTemplate } from './shared/templates/ProfilePageTemplate'

export default function ProfileOffersPage() {

  return (
    <ProfilePageTemplate> 
      <ProfileOffers />
      <div style={{height: '110px'}}></div>
    </ProfilePageTemplate>
  )
}
