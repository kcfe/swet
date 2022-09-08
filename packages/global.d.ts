declare global {
  const __DEV__: boolean
  const __TEST__: boolean
  const __NODE_JS__: boolean

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
    }
  }
}

export {}
