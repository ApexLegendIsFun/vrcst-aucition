// Toast Notification Module

import { UI_SETTINGS } from '../config/constants.js';
import { getById } from '../utils/dom.js';

let toastTimeout = null;

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type (default, success, error, warning)
 * @param {number} duration - Display duration in milliseconds
 */
export function showToast(message, type = 'default', duration = UI_SETTINGS.TOAST_DURATION) {
  const toast = getById('toast');
  
  if (!toast) {
    console.error('Toast element not found');
    return;
  }
  
  // Clear existing timeout
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  
  // Set message and type
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  // Auto hide after duration
  toastTimeout = setTimeout(() => {
    hideToast();
  }, duration);
}

/**
 * Hide toast notification
 */
export function hideToast() {
  const toast = getById('toast');
  
  if (toast) {
    toast.classList.remove('show');
    
    // Clear timeout
    if (toastTimeout) {
      clearTimeout(toastTimeout);
      toastTimeout = null;
    }
  }
}

/**
 * Show success toast
 * @param {string} message - Success message
 */
export function showSuccess(message) {
  showToast(message, 'success');
}

/**
 * Show error toast
 * @param {string} message - Error message
 */
export function showError(message) {
  showToast(message, 'error');
}

/**
 * Show warning toast
 * @param {string} message - Warning message
 */
export function showWarning(message) {
  showToast(message, 'warning');
}

/**
 * Show info toast
 * @param {string} message - Info message
 */
export function showInfo(message) {
  showToast(message, 'default');
}