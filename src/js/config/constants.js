// Application Constants

// Team Configuration
export const TEAMS = {
  team_alpha: {
    id: 'team_alpha',
    displayName: 'Team Alpha',
    initialPoints: 1000,
    color: '#ff4d6d'
  },
  team_bravo: {
    id: 'team_bravo',
    displayName: 'Team Bravo',
    initialPoints: 1000,
    color: '#536493'
  },
  team_charlie: {
    id: 'team_charlie',
    displayName: 'Team Charlie',
    initialPoints: 1000,
    color: '#c77dff'
  },
  team_delta: {
    id: 'team_delta',
    displayName: 'Team Delta',
    initialPoints: 1000,
    color: '#ef5a6f'
  }
};

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  CAPTAIN: 'captain',
  VIEWER: 'viewer'
};

// Auction Status
export const AUCTION_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// Timer Settings
export const TIMER_SETTINGS = {
  DEFAULT_DURATION: 30000, // 30 seconds
  EXTENSION_TIME: 5000,    // 5 seconds extension on new bid
  UPDATE_INTERVAL: 100     // Update every 100ms
};

// UI Settings
export const UI_SETTINGS = {
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300
};

// Image Paths
export const IMAGE_PATHS = {
  PROFILE_BASE: 'images/profiles/',
  TEAM_BASE: 'images/teams/',
  DEFAULT_PLAYER: 'images/default-player.png'
};

// Tab Types
export const TAB_TYPES = {
  AUCTION: 'auction',
  FAILED: 'failed',
  COMPLETED: 'completed'
};

// Bid Validation
export const BID_RULES = {
  MIN_BID_INCREMENT: 10,
  MAX_BID_PERCENTAGE: 1.0 // 100% of team points
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_SESSION: 'vrcst_user_session',
  THEME_PREFERENCE: 'vrcst_theme',
  LANGUAGE: 'vrcst_language'
};

// API Endpoints (if needed in future)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  PLAYERS: '/api/players',
  TEAMS: '/api/teams',
  AUCTIONS: '/api/auctions'
};

// Error Messages
export const ERROR_MESSAGES = {
  AUTH_FAILED: '인증에 실패했습니다',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다',
  INVALID_BID: '유효하지 않은 입찰입니다',
  INSUFFICIENT_POINTS: '포인트가 부족합니다',
  PERMISSION_DENIED: '권한이 없습니다'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '로그인되었습니다',
  BID_PLACED: '입찰이 완료되었습니다',
  AUCTION_STARTED: '경매가 시작되었습니다',
  AUCTION_ENDED: '경매가 종료되었습니다'
};