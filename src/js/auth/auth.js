// Authentication Module

import { database } from '../config/firebase.js';
import { ref, onValue, off } from 'firebase/database';
import { TEAMS, ROLES, STORAGE_KEYS } from '../config/constants.js';
import { saveToStorage, loadFromStorage, clearFromStorage } from '../utils/helpers.js';
import { $, show, hide, setText, getValue, getById } from '../utils/dom.js';
import { showToast } from '../ui/toast.js';

// Authentication credentials (should be moved to server-side in production)
const AUTH_CREDENTIALS = {
  admin: { password: 'admin123', role: ROLES.ADMIN },
  team_alpha: { password: 'alpha123', role: ROLES.CAPTAIN },
  team_bravo: { password: 'bravo123', role: ROLES.CAPTAIN },
  team_charlie: { password: 'charlie123', role: ROLES.CAPTAIN },
  team_delta: { password: 'delta123', role: ROLES.CAPTAIN }
};

// Current user state
let currentUser = null;
let teamDataListener = null;

/**
 * Initialize authentication module
 */
export function initAuth() {
  // Try to restore session from storage
  const savedSession = loadFromStorage(STORAGE_KEYS.USER_SESSION);
  if (savedSession && savedSession.id) {
    // Validate saved session
    validateSession(savedSession);
  }
  
  // Set up event listeners
  setupAuthListeners();
}

/**
 * Set up authentication event listeners
 */
function setupAuthListeners() {
  // Login button
  const loginBtn = $('.login-section button');
  if (loginBtn) {
    loginBtn.addEventListener('click', login);
  }
  
  // Logout button
  const logoutBtn = getById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  // Enter key on password field
  const passwordField = getById('password');
  if (passwordField) {
    passwordField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        login();
      }
    });
  }
}

/**
 * Validate saved session
 * @param {Object} session - Saved session data
 */
function validateSession(session) {
  // Simple validation - in production, should verify with server
  if (AUTH_CREDENTIALS[session.id]) {
    restoreSession(session);
  } else {
    clearFromStorage(STORAGE_KEYS.USER_SESSION);
  }
}

/**
 * Restore user session
 * @param {Object} session - Session data
 */
function restoreSession(session) {
  currentUser = session;
  updateUIAfterLogin();
  showToast(`세션이 복원되었습니다. ${currentUser.displayName || '관리자'}님 환영합니다!`, 'success');
}

/**
 * Login function
 */
export function login() {
  const teamId = getValue('teamSelect');
  const password = getValue('password');
  
  if (!teamId) {
    showToast('팀을 선택해주세요', 'error');
    return;
  }
  
  if (!password) {
    showToast('비밀번호를 입력해주세요', 'error');
    return;
  }
  
  // Validate credentials
  if (AUTH_CREDENTIALS[teamId] && AUTH_CREDENTIALS[teamId].password === password) {
    // Create user object
    currentUser = {
      id: teamId,
      role: AUTH_CREDENTIALS[teamId].role,
      displayName: TEAMS[teamId]?.displayName || '관리자',
      points: TEAMS[teamId]?.initialPoints || 0
    };
    
    // Save session
    saveToStorage(STORAGE_KEYS.USER_SESSION, currentUser);
    
    // Update UI
    updateUIAfterLogin();
    
    // Show success message
    showToast(`${currentUser.displayName}님 환영합니다!`, 'success');
    
    // Trigger login event
    window.dispatchEvent(new CustomEvent('userLogin', { detail: currentUser }));
  } else {
    showToast('로그인 실패: 잘못된 비밀번호', 'error');
  }
}

/**
 * Update UI after login
 */
function updateUIAfterLogin() {
  // Update login section
  show('userStatus');
  show('logoutBtn');
  hide('.login-section button');
  getById('teamSelect').disabled = true;
  getById('password').disabled = true;
  
  // Show role-specific UI
  if (currentUser.role === ROLES.ADMIN) {
    show('adminPanel');
    setText('userStatus', '👑 관리자로 로그인됨');
  } else if (currentUser.role === ROLES.CAPTAIN) {
    show('teamsSection');
    setText('userStatus', 
      `⚔️ ${currentUser.displayName} 주장으로 로그인됨 | 보유 포인트: <span class="points" id="userPoints">${currentUser.points}P</span>`
    );
    
    // Set up Firebase listener for team data
    setupTeamDataListener();
  }
}

/**
 * Set up Firebase listener for team data
 */
function setupTeamDataListener() {
  if (currentUser && currentUser.role === ROLES.CAPTAIN) {
    const teamRef = ref(database, `teams/${currentUser.id}`);
    
    // Remove existing listener if any
    if (teamDataListener) {
      off(teamRef, 'value', teamDataListener);
    }
    
    // Set up new listener
    teamDataListener = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        currentUser.points = data.points || TEAMS[currentUser.id]?.initialPoints || 1000;
        const pointsElement = getById('userPoints');
        if (pointsElement) {
          pointsElement.textContent = `${currentUser.points}P`;
        }
      }
    };
    
    onValue(teamRef, teamDataListener);
  }
}

/**
 * Logout function
 */
export function logout() {
  // Remove Firebase listener
  if (teamDataListener && currentUser) {
    const teamRef = ref(database, `teams/${currentUser.id}`);
    off(teamRef, 'value', teamDataListener);
    teamDataListener = null;
  }
  
  // Clear user data
  currentUser = null;
  clearFromStorage(STORAGE_KEYS.USER_SESSION);
  
  // Reset UI
  hide('userStatus');
  hide('adminPanel');
  hide('teamsSection');
  hide('logoutBtn');
  show('.login-section button');
  getById('teamSelect').disabled = false;
  getById('password').disabled = false;
  getById('teamSelect').value = '';
  getById('password').value = '';
  
  // Hide bid sections
  document.querySelectorAll('.bid-section').forEach(section => {
    section.style.display = 'none';
  });
  
  showToast('로그아웃되었습니다');
  
  // Trigger logout event
  window.dispatchEvent(new CustomEvent('userLogout'));
}

/**
 * Get current user
 * @returns {Object|null} Current user or null
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Check if user is admin
 * @returns {boolean} True if admin
 */
export function isAdmin() {
  return currentUser && currentUser.role === ROLES.ADMIN;
}

/**
 * Check if user is captain
 * @returns {boolean} True if captain
 */
export function isCaptain() {
  return currentUser && currentUser.role === ROLES.CAPTAIN;
}

/**
 * Check if user is logged in
 * @returns {boolean} True if logged in
 */
export function isLoggedIn() {
  return currentUser !== null;
}

/**
 * Update user points
 * @param {number} points - New points value
 */
export function updateUserPoints(points) {
  if (currentUser && currentUser.role === ROLES.CAPTAIN) {
    currentUser.points = points;
    const pointsElement = getById('userPoints');
    if (pointsElement) {
      pointsElement.textContent = `${points}P`;
    }
  }
}

/**
 * Get user team ID
 * @returns {string|null} Team ID or null
 */
export function getUserTeamId() {
  return currentUser ? currentUser.id : null;
}

/**
 * Get user display name
 * @returns {string} Display name
 */
export function getUserDisplayName() {
  return currentUser ? currentUser.displayName : 'Guest';
}