// 환경 설정 유틸리티
export const ENV = {
  // 현재 환경 모드
  MODE: import.meta.env.MODE as 'dev-local' | 'development' | 'production',
  
  // API 설정
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  
  // Clerk 설정
CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_dummy-key-for-development',
  
  // 환경별 설정
  IS_LOCAL: import.meta.env.MODE === 'dev-local',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
  IS_DEV: import.meta.env.DEV,
  
  // 환경별 API URL 가져오기
  getApiUrl() {
    if (this.IS_LOCAL) {
      return this.API_BASE_URL || 'http://localhost:3663/api'
    } else if (this.IS_DEVELOPMENT) {
      return this.API_BASE_URL || 'https://dev-api.yourdomain.com/api'
    } else if (this.IS_PRODUCTION) {
      return this.API_BASE_URL || 'https://api.yourdomain.com/api'
    }
    return this.API_BASE_URL || 'http://localhost:3663/api'
  },
  
  // 환경별 로그 레벨
  getLogLevel() {
    if (this.IS_PRODUCTION) {
      return 'error'
    } else if (this.IS_DEVELOPMENT) {
      return 'warn'
    } else {
      return 'debug'
    }
  },
  
  // 환경별 디버그 모드
  getDebugMode() {
    return !this.IS_PRODUCTION
  }
} as const

// 환경 설정 검증
export const validateEnv = () => {
  const requiredVars = [
    'VITE_CLERK_PUBLISHABLE_KEY'
  ]
  
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  )
  
  if (missingVars.length > 0) {
    console.warn(
      `Missing required environment variables: ${missingVars.join(', ')}`
    )
    // 개발 환경에서는 더미 값 사용
    if (ENV.IS_DEV) {
      console.warn('Using dummy values for development')
    }
  }
  
  return missingVars.length === 0
}

// 환경 정보 출력 (개발 환경에서만)
export const logEnvInfo = () => {
  if (ENV.IS_DEV) {
    console.log('🌍 Environment Info:', {
      mode: ENV.MODE,
      apiUrl: ENV.getApiUrl(),
      isLocal: ENV.IS_LOCAL,
      isDevelopment: ENV.IS_DEVELOPMENT,
      isProduction: ENV.IS_PRODUCTION,
      debugMode: ENV.getDebugMode(),
      logLevel: ENV.getLogLevel()
    })
  }
} 