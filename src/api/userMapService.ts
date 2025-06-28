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
          console.log(`Cached user ${login} expired, will be fetched from API when requested`);
        }
      }

      console.log(`Loaded ${loadedMap.size} non-expired users from cache (out of ${tempMap.size} total cached)`);
      return loadedMap;
    }
  } catch (error) {
    console.error('Failed to load user map from cache:', error);
  }
  console.log('No cached user map found, creating empty map');
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

      console.log(`Loaded ${loadedMap.size} negative cache entries:`, [...loadedMap.entries()]);
      return loadedMap;
    }
  } catch (error) {
    console.error('Failed to load negative cache:', error);
  }
  console.log('No negative cache found, creating empty map');
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
    console.log(`Saved ${userMap.value.size} users to cache`);
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
    console.log(`Saved ${negativeCache.value.size} negative cache entries`);
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
      console.log(`User ${login} found in cache (cached at ${new Date(cachedUser.timestamp).toISOString()}), returning cached data`);
      return cachedUser;
    } else {
      console.log(`User ${login} found in cache but expired (cached at ${new Date(cachedUser.timestamp).toISOString()}), fetching fresh data`);
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
      console.log(`User ${login} found in negative cache (cached at ${new Date(timestamp).toISOString()}), skipping API call`);
      return null;
    } else {
      // Entry expired, remove it from negative cache
      console.log(`Negative cache entry for ${login} expired, removing from cache`);
      const newNegativeCache = new Map(negativeCache.value);
      newNegativeCache.delete(login);
      negativeCache.value = newNegativeCache;
    }
  }

  // Fetch from API if not in cache or cache expired
  console.log(`Fetching user ${login} from API`);
  try {
    const result = await getUsers([login]);
    if (result.type === 'error') {
      console.error('Failed to fetch user:', result.message);

      // If we have stale data, return it as a fallback
      if (userMap.value.has(login)) {
        const staleUser = userMap.value.get(login)!;
        console.log(`Returning stale data for ${login} as fallback after API error`);
        return staleUser;
      }

      return null;
    }

    const users = result.data;
    if (users.length === 0) {
      console.log(`No user found with login ${login}, adding to negative cache`);

      // Add to negative cache with current timestamp
      const now = Date.now();
      const newNegativeCache = new Map(negativeCache.value);
      newNegativeCache.set(login, now);
      negativeCache.value = newNegativeCache;

      console.log(`Added ${login} to negative cache, new negative cache size: ${negativeCache.value.size}`);
      return null;
    }

    const user = users[0];
    console.log(`User ${login} fetched from API:`, user);

    // Add to positive cache with current timestamp
    const now = Date.now();
    const cachedUser: CachedUser = {
      ...user,
      timestamp: now
    };

    const newMap = new Map(userMap.value);
    newMap.set(login, cachedUser);
    userMap.value = newMap;
    console.log(`User ${login} added to cache with timestamp ${new Date(now).toISOString()}, new cache size: ${userMap.value.size}`);

    return user;
  } catch (error) {
    console.error(`Error fetching user ${login} from API:`, error);

    // If we have stale data, return it as a fallback
    if (userMap.value.has(login)) {
      const staleUser = userMap.value.get(login)!;
      console.log(`Returning stale data for ${login} as fallback after API error`);
      return staleUser;
    }

    return null;
  }
}

export function clearUserMap(): void {
  console.log(`Clearing user map - current size: ${userMap.value.size}`);
  console.log(`Clearing negative cache - current size: ${negativeCache.value.size}`);

  // Clear both maps in memory
  userMap.value = new Map();
  negativeCache.value = new Map();

  // Clear both caches in localStorage
  localStorage.removeItem(USER_MAP_CACHE_KEY);
  localStorage.removeItem(NEGATIVE_CACHE_KEY);

  console.log('User map and negative cache cleared');
}
