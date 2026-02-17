/**
 * Optimized secure storage utilities for encrypting and managing localStorage data
 */

// Extend Window interface to include our custom property
declare global {
  interface Window {
    isHandlingTimeout?: boolean;
  }
}

// Simple encryption key - in a production environment, this should be more securely managed
// and potentially unique per user session
const ENCRYPTION_KEY = 'filmbank-secure-storage-key';

// Timeout in milliseconds (30 minutes)
const STORAGE_TIMEOUT = 30 * 60 * 1000;

// Last activity timestamp key
const LAST_ACTIVITY_KEY = 'lastActivityTimestamp';

// Key for tracking when the form was last accessed
const FORM_ACCESS_KEY = 'formLastAccessed';

// Threshold for considering a session as "new" (5 seconds)
const NEW_SESSION_THRESHOLD = 5000; // 5 seconds

// Cache for decrypted values to avoid repeated decryption
const decryptionCache = new Map<string, any>();

// Throttle for activity updates to reduce localStorage writes
let lastActivityUpdateTime = 0;
const ACTIVITY_UPDATE_THROTTLE = 5000; // 5 seconds

/**
 * Encrypt data before storing in localStorage
 * 
 * This uses a simple XOR encryption for demonstration. In a production environment,
 * consider using a more robust encryption library like CryptoJS.
 * 
 * @param data Data to encrypt
 * @returns Encrypted data as string
 */
export function encryptData(data: any): string {
  // Convert data to JSON string
  const jsonString = JSON.stringify(data);
  
  // Simple XOR encryption
  let encrypted = '';
  for (let i = 0; i < jsonString.length; i++) {
    const charCode = jsonString.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    encrypted += String.fromCharCode(charCode);
  }
  
  // Convert to base64 for safe storage - use encodeURIComponent to handle Unicode characters
  return btoa(encodeURIComponent(encrypted));
}

/**
 * Decrypt data from localStorage
 * 
 * @param encryptedData Encrypted data string
 * @param key Optional key for caching
 * @returns Decrypted data object
 */
export function decryptData(encryptedData: string, key?: string): any {
  try {
    // Check if the input is empty or not a string
    if (!encryptedData || typeof encryptedData !== 'string') {
      return null;
    }

    // Check cache if key is provided
    if (key && decryptionCache.has(key)) {
      return decryptionCache.get(key);
    }

    // Decode from base64
    const encryptedUri = atob(encryptedData);
    
    // Decode URI component to handle Unicode characters
    const encrypted = decodeURIComponent(encryptedUri);
    
    // XOR decryption
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    // Check if decrypted string is empty or not valid JSON
    if (!decrypted.trim()) {
      return null;
    }
    
    // Parse JSON
    const result = JSON.parse(decrypted);
    
    // Cache the result if key is provided
    if (key) {
      decryptionCache.set(key, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
}

/**
 * Securely store data in localStorage with encryption
 * 
 * @param key localStorage key
 * @param data Data to store
 */
export function secureSet(key: string, data: any): void {
  // Update cache
  decryptionCache.set(key, data);
  
  const encryptedData = encryptData(data);
  localStorage.setItem(key, encryptedData);
  updateLastActivity();
}

/**
 * Retrieve and decrypt data from localStorage
 * 
 * @param key localStorage key
 * @returns Decrypted data or null if not found
 */
export function secureGet(key: string): any {
  // Check cache first
  if (decryptionCache.has(key)) {
    updateLastActivity();
    return decryptionCache.get(key);
  }
  
  const encryptedData = localStorage.getItem(key);
  if (!encryptedData) return null;
  
  updateLastActivity();
  const result = decryptData(encryptedData, key);
  return result;
}

/**
 * Update the last activity timestamp with throttling
 */
export function updateLastActivity(): void {
  const now = Date.now();
  
  // Only update if enough time has passed since last update
  if (now - lastActivityUpdateTime > ACTIVITY_UPDATE_THROTTLE) {
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
    lastActivityUpdateTime = now;
  }
}

/**
 * Check if the storage has timed out due to inactivity
 * 
 * @returns True if storage has timed out
 */
export function hasTimedOut(): boolean {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (!lastActivity) return true;
  
  const lastActivityTime = parseInt(lastActivity, 10);
  return Date.now() - lastActivityTime > STORAGE_TIMEOUT;
}

/**
 * Check if a value is a valid base64 encoded string
 * 
 * @param str String to check
 * @returns True if the string is valid base64
 */
function isValidBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

/**
 * Clear all secure storage data except for specified keys
 * 
 * @param preserveKeys Array of keys to preserve
 */
export function clearSecureStorage(preserveKeys: string[] = []): void {
  // Save values for keys to preserve
  const preservedValues: Record<string, string> = {};
  
  // First check for keys to preserve in regular localStorage
  preserveKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      preservedValues[key] = value;
    }
  });
  
  // No longer preserve locale by default
  
  // Clear all storage
  localStorage.clear();
  decryptionCache.clear();
  
  // Restore preserved values
  Object.entries(preservedValues).forEach(([key, value]) => {
    localStorage.setItem(key, value);
    
    // Try to decrypt and cache if it's an encrypted value
    if (isValidBase64(value)) {
      try {
        const decrypted = decryptData(value, key);
        if (decrypted !== null) {
          decryptionCache.set(key, decrypted);
        }
      } catch (e) {
        // Ignore decryption errors for preserved values
      }
    }
  });
  
  // No longer need to handle locale encryption
}

// Debounced event handler for activity tracking
let activityTimeout: number | null = null;
function debouncedActivityHandler() {
  if (activityTimeout) {
    window.clearTimeout(activityTimeout);
  }
  
  activityTimeout = window.setTimeout(() => {
    updateLastActivity();
    activityTimeout = null;
  }, 300) as unknown as number;
}

/**
 * Initialize the secure storage system
 * Sets up activity monitoring and timeout checking
 */
export function initSecureStorage(): void {
  // Set initial activity timestamp if not exists
  if (!localStorage.getItem(LAST_ACTIVITY_KEY)) {
    updateLastActivity();
  }
  
  // Check for timeout on page load
  if (hasTimedOut()) {
    clearSecureStorage();
  }
  
  // Only clear form data on initial page load, not during navigation within the app
  if (typeof window !== 'undefined') {
    // Update the last accessed time
    const now = Date.now();
    const lastAccessed = localStorage.getItem(FORM_ACCESS_KEY);
    localStorage.setItem(FORM_ACCESS_KEY, now.toString());
    
    // Only clear form data if this is a fresh page load (not a navigation within the app)
    // or if we're coming from a different page
    const isInitialLoad = !lastAccessed || (now - parseInt(lastAccessed, 10) > 60000); // 1 minute threshold
    
    // Check if we're on the confirmation page (step 6)
    const isConfirmationStep = secureGet('currentStep') === 6;
    
    // Don't clear form data if we're on the confirmation step or navigating within the form
    if (isInitialLoad && !isConfirmationStep) {
      console.log('Initial page load, clearing form data');
      clearSecureStorage(['locale', 'lastActivityTimestamp', FORM_ACCESS_KEY]);
    }
  }
  
  // Set up event listeners to track user activity with debouncing
  ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(eventType => {
    window.addEventListener(eventType, debouncedActivityHandler);
  });
  
  // Periodically check for timeout (every minute)
  setInterval(() => {
    if (hasTimedOut()) {
      // Check if a form reset is in progress by looking for specific indicators
      const isResetInProgress = typeof window !== 'undefined' && (
        // Check for reset indicators in the DOM
        document.querySelector('[data-resetting="true"]') !== null ||
        // Check for redirecting text in the button
        document.querySelector('button')?.textContent?.includes('Redirecting') ||
        // Check if we're in a transition between form steps
        document.querySelector('.animate-pulse') !== null
      );
      
      // If a reset is in progress, just update the activity timestamp to prevent timeout
      if (isResetInProgress) {
        updateLastActivity();
        return;
      }
      
      // Add a debounce to prevent multiple timeouts firing in quick succession
      if (!window.isHandlingTimeout) {
        window.isHandlingTimeout = true;
        
        try {
          // Clear storage but preserve activity timestamp
          clearSecureStorage([LAST_ACTIVITY_KEY]);
          
          // Reset form state through custom event
          if (typeof window !== 'undefined') {
            const event = new CustomEvent('secureStorageTimeout', {
              detail: { message: 'Session expired due to inactivity' }
            });
            window.dispatchEvent(event);
          }
          
          // Redirect to first step instead of reloading, but only if we're on the request-screening path
          const currentPath = window.location.pathname;
          if (currentPath.includes('/request-screening')) {
            // Use a small delay to ensure event handlers have time to process
            setTimeout(() => {
              window.history.pushState({}, '', '/request-screening');
              window.isHandlingTimeout = false;
            }, 300);
          } else {
            window.isHandlingTimeout = false;
          }
        } catch (error) {
          console.error('Error handling timeout:', error);
          window.isHandlingTimeout = false;
        }
      }
    }
  }, 60000);
}
