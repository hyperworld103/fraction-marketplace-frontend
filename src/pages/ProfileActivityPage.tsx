import React from 'react'
import { ProfileActivity } from '../components/profile/ProfileActivity'
import { ProfilePageTemplate } from './shared/templates/ProfilePageTemplate'

export default function ProfileActivityPage() {

  return (
    <ProfilePageTemplate> 
      <ProfileActivity />
      <div style={{height: '110px'}}></div>
    </ProfilePageTemplate>
  )
}
