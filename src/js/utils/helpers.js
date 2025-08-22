// Utility Helper Functions

import { IMAGE_PATHS } from '../config/constants.js';

/**
 * Get player image URL
 * @param {Object|string} player - Player object or name
 * @param {Object} playersData - All players data
 * @returns {string} Image URL
 */
export function getPlayerImageUrl(player, playersData = {}) {
  // If player object has profileImage
  if (player && player.profileImage) {
    return player.profileImage;
  }
  
  // If player is a string (backward compatibility)
  if (typeof player === 'string') {
    const foundPlayer = Object.values(playersData).find(p => p.name === player);
    if (foundPlayer && foundPlayer.profileImage) {
      return foundPlayer.profileImage;
    }
  }
  
  // Return default image
  return IMAGE_PATHS.DEFAULT_PLAYER || 'https://picsum.photos/300/300';
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
export function formatCurrency(amount) {
  return `${amount.toLocaleString()}P`;
}

/**
 * Format time
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time (MM:SS)
 */
export function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Get team color
 * @param {string} teamId - Team ID
 * @returns {string} Team color
 */
export function getTeamColor(teamId) {
  const colors = {
    team_alpha: '#ff4d6d',
    team_bravo: '#536493',
    team_charlie: '#c77dff',
    team_delta: '#ef5a6f'
  };
  return colors[teamId] || '#999';
}

/**
 * Validate bid amount
 * @param {number} bidAmount - Bid amount
 * @param {number} currentBid - Current bid
 * @param {number} userPoints - User points
 * @returns {Object} Validation result
 */
export function validateBid(bidAmount, currentBid, userPoints) {
  if (!bidAmount || isNaN(bidAmount)) {
    return { valid: false, message: '입찰 금액을 입력하세요' };
  }
  
  if (bidAmount <= currentBid) {
    return { valid: false, message: '현재 입찰가보다 높은 금액을 입력하세요' };
  }
  
  if (bidAmount > userPoints) {
    return { valid: false, message: '보유 포인트가 부족합니다' };
  }
  
  return { valid: true };
}

/**
 * Sort players by status
 * @param {Array} players - Players array
 * @param {string} status - Status to filter
 * @returns {Array} Sorted players
 */
export function sortPlayersByStatus(players, status) {
  return players
    .filter(player => {
      switch (status) {
        case 'auction':
          return player.auctionStatus === 'pending' || player.auctionStatus === 'active';
        case 'failed':
          return player.auctionStatus === 'failed';
        case 'completed':
          return player.auctionStatus === 'completed' && player.owner;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // Sort by bid amount (descending)
      if (a.currentBid !== b.currentBid) {
        return b.currentBid - a.currentBid;
      }
      // Then by high score (descending)
      return (b.highScore || 0) - (a.highScore || 0);
    });
}

/**
 * Calculate team statistics
 * @param {Object} team - Team data
 * @param {Object} playersData - All players data
 * @returns {Object} Team statistics
 */
export function calculateTeamStats(team, playersData) {
  const players = team.players || [];
  const totalSpent = players.reduce((sum, playerId) => {
    const player = playersData[playerId];
    return sum + (player ? player.currentBid || 0 : 0);
  }, 0);
  
  const averageScore = players.reduce((sum, playerId) => {
    const player = playersData[playerId];
    return sum + (player ? player.highScore || 0 : 0);
  }, 0) / (players.length || 1);
  
  return {
    playerCount: players.length,
    totalSpent,
    remainingPoints: team.points,
    averageScore: Math.round(averageScore)
  };
}

/**
 * Save to local storage
 * @param {string} key - Storage key
 * @param {*} value - Value to save
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Failed to save to storage:', error);
    return false;
  }
}

/**
 * Load from local storage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Failed to load from storage:', error);
    return defaultValue;
  }
}

/**
 * Clear local storage item
 * @param {string} key - Storage key
 */
export function clearFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to clear from storage:', error);
    return false;
  }
}