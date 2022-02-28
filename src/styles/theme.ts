export interface Theme {
  primary: {
    lighter: string
    light: string
    main: string
    dark: string
    darker: string
    gradient: string
  }
  secondary: {
    lighter: string
    light: string
    main: string
    dark: string
    darker: string
  }
  blue: {
    lighter: string
    light: string
    main: string
    dark: string
    darker: string
  }
  green: {
    lighter: string
    light: string
    main: string
    dark: string
    darker: string
  }
  yellow: {
    lighter: string
    light: string
    main: string
    dark: string
    darker: string
  }
  red: {
    lighter: string
    light: string
    main: string
    dark: string
    darker: string
  }
  black: string
  white: string
  light: string
  gray: {
    '0': string
    '1': string
    '2': string
    '3': string
    '4': string
    '5': string
  }
  fonts: {
    primary: string
  }
  viewport: {
    base: number
    mobile: string
    tablet: string
    desktop: string
    desktopl: string
    desktopXl: string
  }
  margin: {
    xs: string
    small: string
    medium: string
    large: string
  }
  borderRadius: {
    small: string
    medium: string
    large: string
    xl: string
  }
}

const fonts = {
  primary: 'Nunito, sans-serif'
}

const viewport = {
  base: 0,
  mobile: '414px',
  tablet: '768px',
  desktop: '1024px',
  desktopl: '1280px',
  desktopXl: '1400px'
}

const margin = {
  xs: '8px',
  small: '24px',
  medium: '48px',
  large: '64px'
}

const borderRadius = {
  small: '8px',
  medium: '12px',
  large: '16px',
  xl: '24px'
}

export const lightTheme: Theme = {
  primary: {
    lighter: '#FFBBC3',
    light: '#FE98A6',
    main: '#FE7688',
    dark: '#E56A7B',
    darker: '#CB5E6D',
    gradient: 'linear-gradient(90deg, #FE8367 5.73%, #FE7688 100%)'
  },
  secondary: {
    lighter: '#FFC1B3',
    light: '#FEA28D',
    main: '#FE8367',
    dark: '#E5765D',
    darker: '#CB6952'
  },
  blue: {
    lighter: '#90B5F6',
    light: '#598FF1',
    main: '#226AED',
    dark: '#1F60D6',
    darker: '#1B55BE'
  },
  green: {
    lighter: '#9DD99B',
    light: '#6BC66A',
    main: '#3AB238',
    dark: '#34A133',
    darker: '#2E8E2D'
  },
  yellow: {
    lighter: '#F8E4A5',
    light: '#F5D679',
    main: '#F2C94C',
    dark: '#EBB946',
    darker: '#E3A940'
  },
  red: {
    lighter: '#EDA2A2',
    light: '#E47373',
    main: '#DB4444',
    dark: '#C63D3D',
    darker: '#AF3636'
  },
  black: '#262626',
  white: '#ffffff',
  light: '#f5f3f3',
  gray: {
    '0': '#F6F6F6',
    '1': '#DEDEDE',
    '2': '#B3B3B3',
    '3': '#888888',
    '4': '#5C5C5C',
    '5': '#595959'
  },
  viewport,
  margin,
  fonts,
  borderRadius
}

export const darkTheme: Theme = {
  primary: {
    lighter: '#FFBBC3',
    light: '#FE98A6',
    main: '#FE7688',
    dark: '#E56A7B',
    darker: '#CB5E6D',
    gradient: 'linear-gradient(90deg, #FE8367 5.73%, #FE7688 100%)'
  },
  secondary: {
    lighter: '#FFC1B3',
    light: '#FEA28D',
    main: '#FE8367',
    dark: '#E5765D',
    darker: '#CB6952'
  },
  blue: {
    lighter: '#90B5F6',
    light: '#598FF1',
    main: '#226AED',
    dark: '#1F60D6',
    darker: '#1B55BE'
  },
  green: {
    lighter: '#9DD99B',
    light: '#6BC66A',
    main: '#3AB238',
    dark: '#34A133',
    darker: '#2E8E2D'
  },
  yellow: {
    lighter: '#F8E4A5',
    light: '#F5D679',
    main: '#F2C94C',
    dark: '#EBB946',
    darker: '#E3A940'
  },
  red: {
    lighter: '#EDA2A2',
    light: '#E47373',
    main: '#DB4444',
    dark: '#C63D3D',
    darker: '#AF3636'
  },
  black: '#ffffff',
  white: '#18181E',
  light: '#18181E',
  gray: {
    '0': '#232328',
    '1': '#2D2D32',
    '2': '#808083',
    '3': '#D1D1D2',
    '4': '#F3F3F4',
    '5': '#FAFAFC'
  },
  viewport,
  margin,
  fonts,
  borderRadius
}
