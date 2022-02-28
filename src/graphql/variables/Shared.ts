import { makeVar } from '@apollo/client'

// eslint-disable-next-line no-shadow
export enum ThemeProviderEnum {
  light = 'light',
  dark = 'dark'
}

export const themeVar = makeVar<ThemeProviderEnum>(ThemeProviderEnum.light)
