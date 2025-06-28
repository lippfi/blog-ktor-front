import { ref, computed, watchEffect } from 'vue';
import { getUsers } from '@/api/userService';

// Define the User interface
interface User {
  login: string;
  nickname: string;
  avatarUri?: string;
}

// Interface for cached user entries
interface CachedUser extends User {
  timestamp: number;
}

// Interface for negative cache entries
interface NegativeCacheEntry {
  login: string;
  timestamp: number;
}

// Local storage keys for caching
const USER_MAP_CACHE_KEY = 'userMapCache';
const NEGATIVE_CACHE_KEY = 'negativeUserCache';

// Cache duration in milliseconds
const NEGATIVE_CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const POSITIVE_CACHE_DURATION = 5 * 60 * 1000;  // 5 minutes

// Function to load cached user map from localStorage
function loadCachedUserMap(): Map<string, CachedUser> {
  try {
    const cachedData = localStorage.getItem(USER_MAP_CACHE_KEY);
    if (cachedData) {
      // Parse the JSON data and convert it back to a Map
      const parsedData = JSON.parse(cachedData);

      // Create a temporary Map from the array of entries
      const tempMap: Map<string, CachedUser> = new Map(parsedData);

      // Create a new Map to store only non-expired entries
      const loadedMap: Map<string, CachedUser> = new Map();

      // Current time to filter out expired entries
      const now = Date.now();

      // Only load non-expired entries
      for (const [login, cachedUser] of tempMap.entries()) {
        if (cachedUser.timestamp && now - cachedUser.timestamp < POSITIVE_CACHE_DURATION) {
          loadedMap.set(login, cachedUser);
        } else {
        }
      }

      return loadedMap;
    }
  } catch (error) {
    console.error('Failed to load user map from cache:', error);
  }
  return new Map();
}

// Function to load cached negative results from localStorage
function loadNegativeCache(): Map<string, number> {
  try {
    const cachedData = localStorage.getItem(NEGATIVE_CACHE_KEY);
    if (cachedData) {
      // Parse the JSON data
      const entries: NegativeCacheEntry[] = JSON.parse(cachedData);

      // Create a Map with login as key and timestamp as value
      const loadedMap = new Map<string, number>();

      // Current time to filter out expired entries
      const now = Date.now();

      // Only load non-expired entries
      entries.forEach(entry => {
        if (now - entry.timestamp < NEGATIVE_CACHE_DURATION) {
          loadedMap.set(entry.login, entry.timestamp);
        }
      });

      return loadedMap;
    }
  } catch (error) {
    console.error('Failed to load negative cache:', error);
  }
  return new Map();
}

// Initialize userMap with cached data if available
const userMap = ref<Map<string, CachedUser>>(loadCachedUserMap());

// Initialize negativeCache with cached data if available
const negativeCache = ref<Map<string, number>>(loadNegativeCache());

// Save userMap to localStorage whenever it changes
watchEffect(() => {
  try {
    // Convert Map to array of entries for JSON serialization
    const mapEntries = Array.from(userMap.value.entries());
    localStorage.setItem(USER_MAP_CACHE_KEY, JSON.stringify(mapEntries));
  } catch (error) {
    console.error('Failed to save user map to cache:', error);
  }
});

// Save negativeCache to localStorage whenever it changes
watchEffect(() => {
  try {
    // Convert Map entries to array of NegativeCacheEntry objects
    const entries: NegativeCacheEntry[] = Array.from(negativeCache.value.entries())
      .map(([login, timestamp]) => ({ login, timestamp }));

    localStorage.setItem(NEGATIVE_CACHE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save negative cache:', error);
  }
});

export async function getUserByLogin(login: string): Promise<User | null> {
  // Check positive cache first
  if (userMap.value.has(login)) {
    const cachedUser = userMap.value.get(login)!;
    const now = Date.now();

    // Check if the cached user is still valid (less than 5 minutes old)
    if (now - cachedUser.timestamp < POSITIVE_CACHE_DURATION) {
      return cachedUser;
    } else {
      // We'll fetch fresh data below, but keep the user in the map for now
      // in case the API call fails, we can fall back to the stale data
    }
  }

  // Check negative cache
  if (negativeCache.value.has(login)) {
    const timestamp = negativeCache.value.get(login)!;
    const now = Date.now();

    // Check if the negative cache entry is still valid (less than 1 hour old)
    if (now - timestamp < NEGATIVE_CACHE_DURATION) {
      return null;
    } else {
      // Entry expired, remove it from negative cache
      const newNegativeCache = new Map(negativeCache.value);
      newNegativeCache.delete(login);
      negativeCache.value = newNegativeCache;
    }
  }

  // Fetch from API if not in cache or cache expired
  try {
    const result = await getUsers([login]);
    if (result.type === 'error') {
      console.error('Failed to fetch user:', result.message);

      // If we have stale data, return it as a fallback
      if (userMap.value.has(login)) {
        const staleUser = userMap.value.get(login)!;
        return staleUser;
      }

      return null;
    }

    const users = result.data;
    if (users.length === 0) {

      // Add to negative cache with current timestamp
      const now = Date.now();
      const newNegativeCache = new Map(negativeCache.value);
      newNegativeCache.set(login, now);
      negativeCache.value = newNegativeCache;

      return null;
    }

    const user = users[0];

    // Add to positive cache with current timestamp
    const now = Date.now();
    const cachedUser: CachedUser = {
      ...user,
      timestamp: now
    };

    const newMap = new Map(userMap.value);
    newMap.set(login, cachedUser);
    userMap.value = newMap;

    return user;
  } catch (error) {
    console.error(`Error fetching user ${login} from API:`, error);

    // If we have stale data, return it as a fallback
    if (userMap.value.has(login)) {
      const staleUser = userMap.value.get(login)!;
      return staleUser;
    }

    return null;
  }
}

export async function fetchUsersToCache(logins: string[]): Promise<User[]> {
  if (logins.length === 0) {
    return [];
  }

  // Filter out duplicates
  const uniqueLogins = [...new Set(logins)];

  // Check which logins need to be fetched (not in valid cache)
  const loginsToFetch: string[] = [];
  const now = Date.now();

  for (const login of uniqueLogins) {
    // Skip if in valid positive cache
    if (userMap.value.has(login)) {
      const cachedUser = userMap.value.get(login)!;
      if (now - cachedUser.timestamp < POSITIVE_CACHE_DURATION) {
        continue;
      }
    }

    // Skip if in valid negative cache
    if (negativeCache.value.has(login)) {
      const timestamp = negativeCache.value.get(login)!;
      if (now - timestamp < NEGATIVE_CACHE_DURATION) {
        continue;
      } else {
        // Remove expired negative cache entry
        const newNegativeCache = new Map(negativeCache.value);
        newNegativeCache.delete(login);
        negativeCache.value = newNegativeCache;
      }
    }

    // Need to fetch this login
    loginsToFetch.push(login);
  }

  // If all logins are in valid cache, return early
  if (loginsToFetch.length === 0) {
    return uniqueLogins
      .map(login => userMap.value.get(login))
      .filter((user): user is CachedUser => user !== undefined);
  }

  // Fetch users from API
  try {
    const result = await getUsers(loginsToFetch);
    if (result.type === 'error') {
      console.error('Failed to fetch users:', result.message);
      return uniqueLogins
        .map(login => userMap.value.get(login))
        .filter((user): user is CachedUser => user !== undefined);
    }

    const fetchedUsers = result.data;

    // Update cache with fetched users
    const newMap = new Map(userMap.value);
    const timestamp = Date.now();

    // Add fetched users to positive cache
    for (const user of fetchedUsers) {
      const cachedUser: CachedUser = {
        ...user,
        timestamp
      };
      newMap.set(user.login, cachedUser);
    }

    // Add not found users to negative cache
    const fetchedLogins = new Set(fetchedUsers.map(user => user.login));
    const newNegativeCache = new Map(negativeCache.value);

    for (const login of loginsToFetch) {
      if (!fetchedLogins.has(login)) {
        newNegativeCache.set(login, timestamp);
      }
    }

    // Update caches
    userMap.value = newMap;
    negativeCache.value = newNegativeCache;

    // Return all users that were found (both from cache and newly fetched)
    return uniqueLogins
      .map(login => userMap.value.get(login))
      .filter((user): user is CachedUser => user !== undefined);
  } catch (error) {
    console.error('Error fetching users:', error);
    return uniqueLogins
      .map(login => userMap.value.get(login))
      .filter((user): user is CachedUser => user !== undefined);
  }
}

export function clearUserMap(): void {
  userMap.value = new Map();
  negativeCache.value = new Map();

  // Clear both caches in localStorage
  localStorage.removeItem(USER_MAP_CACHE_KEY);
  localStorage.removeItem(NEGATIVE_CACHE_KEY);
}
