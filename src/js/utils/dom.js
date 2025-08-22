// DOM Utility Functions

/**
 * Query selector shorthand
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default: document)
 * @returns {Element} Element or null
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query selector all shorthand
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default: document)
 * @returns {NodeList} NodeList
 */
export function $$(selector, context = document) {
  return context.querySelectorAll(selector);
}

/**
 * Get element by ID
 * @param {string} id - Element ID
 * @returns {Element} Element or null
 */
export function getById(id) {
  return document.getElementById(id);
}

/**
 * Create element with attributes
 * @param {string} tag - HTML tag
 * @param {Object} attrs - Attributes object
 * @param {string|Element|Array} children - Children elements or text
 * @returns {Element} Created element
 */
export function createElement(tag, attrs = {}, children = null) {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.substring(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Add children
  if (children) {
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else if (child instanceof Element) {
          element.appendChild(child);
        }
      });
    } else if (typeof children === 'string') {
      element.textContent = children;
    } else if (children instanceof Element) {
      element.appendChild(children);
    }
  }
  
  return element;
}

/**
 * Add event listener with delegation
 * @param {Element} parent - Parent element
 * @param {string} eventType - Event type
 * @param {string} selector - Child selector
 * @param {Function} handler - Event handler
 */
export function delegate(parent, eventType, selector, handler) {
  parent.addEventListener(eventType, (event) => {
    const target = event.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, event);
    }
  });
}

/**
 * Show element
 * @param {Element|string} element - Element or selector
 */
export function show(element) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    el.style.display = '';
    el.classList.remove('hidden');
  }
}

/**
 * Hide element
 * @param {Element|string} element - Element or selector
 */
export function hide(element) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    el.style.display = 'none';
    el.classList.add('hidden');
  }
}

/**
 * Toggle element visibility
 * @param {Element|string} element - Element or selector
 */
export function toggle(element) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    if (el.style.display === 'none' || el.classList.contains('hidden')) {
      show(el);
    } else {
      hide(el);
    }
  }
}

/**
 * Add class to element
 * @param {Element|string} element - Element or selector
 * @param {string} className - Class name(s)
 */
export function addClass(element, className) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    el.classList.add(...className.split(' '));
  }
}

/**
 * Remove class from element
 * @param {Element|string} element - Element or selector
 * @param {string} className - Class name(s)
 */
export function removeClass(element, className) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    el.classList.remove(...className.split(' '));
  }
}

/**
 * Toggle class on element
 * @param {Element|string} element - Element or selector
 * @param {string} className - Class name
 */
export function toggleClass(element, className) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    el.classList.toggle(className);
  }
}

/**
 * Check if element has class
 * @param {Element|string} element - Element or selector
 * @param {string} className - Class name
 * @returns {boolean} Has class
 */
export function hasClass(element, className) {
  const el = typeof element === 'string' ? $(element) : element;
  return el ? el.classList.contains(className) : false;
}

/**
 * Empty element content
 * @param {Element|string} element - Element or selector
 */
export function empty(element) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    el.innerHTML = '';
  }
}

/**
 * Set HTML content
 * @param {Element|string} element - Element or selector
 * @param {string} html - HTML content
 */
export function setHTML(element, html) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    el.innerHTML = html;
  }
}

/**
 * Set text content
 * @param {Element|string} element - Element or selector
 * @param {string} text - Text content
 */
export function setText(element, text) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    el.textContent = text;
  }
}

/**
 * Get element value
 * @param {Element|string} element - Element or selector
 * @returns {string} Element value
 */
export function getValue(element) {
  const el = typeof element === 'string' ? $(element) : element;
  return el ? el.value : '';
}

/**
 * Set element value
 * @param {Element|string} element - Element or selector
 * @param {string} value - Value to set
 */
export function setValue(element, value) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    el.value = value;
  }
}

/**
 * Animate element
 * @param {Element} element - Element to animate
 * @param {string} animationClass - Animation class name
 * @param {number} duration - Animation duration in ms
 * @returns {Promise} Animation completion promise
 */
export function animate(element, animationClass, duration = 300) {
  return new Promise((resolve) => {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
      resolve();
    }, duration);
  });
}

/**
 * Smooth scroll to element
 * @param {Element|string} element - Element or selector
 * @param {Object} options - Scroll options
 */
export function scrollTo(element, options = {}) {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options
    });
  }
}

/**
 * Wait for DOM ready
 * @param {Function} callback - Callback function
 */
export function ready(callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}