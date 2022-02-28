import { initializeApp } from 'firebase/app'
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore'
import { globalConfig } from './configV2'

const firebase = initializeApp(globalConfig.firebase)

export const firestore = getFirestore(firebase)

enableIndexedDbPersistence(firestore)
