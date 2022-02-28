import { makeVar } from '@apollo/client'

export const boxModalVar = makeVar(false)
export const searchBoxModalVar = makeVar<string>('')
