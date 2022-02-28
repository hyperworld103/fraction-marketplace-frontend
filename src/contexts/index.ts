import { createContext, Dispatch, SetStateAction } from 'react';

export interface IUser {
  authenticated: boolean,
  username: string, 
  email: string,
  exp: number,
  first_name: string,
  last_name: string,
  phone: string,
  private_key: string,
  public_key: string,
  profile_cover: string,
  profile_image: string,
  paypal:string,
  role: number,
  status: string
}

export interface ITheme {
  theme: string
}

export interface AppContextProperties {
  user: IUser,
  setUser: Dispatch<SetStateAction<IUser>>,
  theme:ITheme,
  setTheme: Dispatch<SetStateAction<ITheme>>
}

const AppContext = createContext<AppContextProperties>({ 
  user: {
      authenticated: false,
      username: undefined, 
      email: undefined,
      exp: 0,
      first_name: undefined,
      last_name: undefined,
      phone: undefined,
      private_key: undefined,
      public_key: undefined,
      profile_cover: undefined,
      profile_image: undefined,
      paypal:undefined,
      role: 0,
      status: undefined
  }, 
  setUser: () => {},
  theme: {
    theme: 'light'
  },
  setTheme: () => {}
});

export { AppContext };
