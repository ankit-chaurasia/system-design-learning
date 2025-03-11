class LRUCache {
    constructor(capacity) {
      this.capacity = capacity;
      this.cache = new Map(); // Maintains key-value pairs in order of usage
    }
  
    get(key) {
      if (!this.cache.has(key)) return -1;
  
      // Move the accessed item to the end to mark it as recently used
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      console.log(`LRU Cache Get: Key ${key}`, this.cache);
      return value;
    }
  
    put(key, value) {
      if (this.cache.has(key)) {
        this.cache.delete(key); // Remove old value before reinserting
      }
  
      this.cache.set(key, value);
  
      if (this.cache.size > this.capacity) {
        // Remove the least recently used item (first item in Map)
        const leastUsedKey = this.cache.keys().next().value;
        this.cache.delete(leastUsedKey);
      }
      console.log(`LRU Cache Put: Key ${key}`, this.cache);
    }
  }
  
  const lru = new LRUCache(3);
  
  lru.put(1, "A");
  lru.put(2, "B");
  lru.put(3, "C");
  
  console.log(lru.get(1)); // "A" (moves 1 to the end)
  lru.put(4, "D"); // Removes key 2 (least recently used)
  
  console.log(lru.get(2)); // -1 (key 2 was removed)
  console.log(lru.get(3)); // "C"
  console.log(lru.get(4)); // "D"
  