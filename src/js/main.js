// Main Entry Point

import '../styles/main.css';
import { initAuth } from './auth/auth.js';
import { showToast } from './ui/toast.js';
import { ready } from './utils/dom.js';
import { database } from './config/firebase.js';
import { ref, onValue } from 'firebase/database';

// Global state
window.appState = {
  currentUser: null,
  playersData: {},
  teamsData: {},
  currentTab: 'auction',
  auctionTimer: null,
  currentAuctionPlayer: null
};

/**
 * Initialize application
 */
async function initApp() {
  console.log('Initializing VR CST Auction System...');
  
  try {
    // Initialize authentication
    initAuth();
    
    // Check Firebase connection
    const connectedRef = ref(database, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        console.log('Firebase connected');
        showToast('시스템에 연결되었습니다', 'success');
      } else {
        console.log('Firebase disconnected');
        showToast('연결이 끊어졌습니다. 재연결 중...', 'warning');
      }
    });
    
    // Listen for authentication events
    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    showToast('시스템 초기화 실패', 'error');
  }
}

/**
 * Handle user login event
 * @param {CustomEvent} event - Login event
 */
function handleUserLogin(event) {
  const user = event.detail;
  window.appState.currentUser = user;
  console.log('User logged in:', user);
  
  // Load initial data
  loadInitialData();
}

/**
 * Handle user logout event
 */
function handleUserLogout() {
  window.appState.currentUser = null;
  console.log('User logged out');
  
  // Clear data
  window.appState.playersData = {};
  window.appState.teamsData = {};
}

/**
 * Load initial data from Firebase
 */
function loadInitialData() {
  // Load players data
  const playersRef = ref(database, 'players');
  onValue(playersRef, (snapshot) => {
    const data = snapshot.val() || {};
    window.appState.playersData = data;
    console.log('Players data loaded:', Object.keys(data).length);
  });
  
  // Load teams data
  const teamsRef = ref(database, 'teams');
  onValue(teamsRef, (snapshot) => {
    const data = snapshot.val() || {};
    window.appState.teamsData = data;
    console.log('Teams data loaded:', Object.keys(data).length);
  });
}

// Initialize app when DOM is ready
ready(() => {
  initApp();
});