class Cache {
  constructor(size) {
    this.size = size;
    this.cacheMap = {};
    this.cacheList = [];
  }

  set(key, value, ttl) {
    ttl = Number(ttl);
    // Check if key already exists in the cache

    if (this.cacheMap.hasOwnProperty(key)) {
      // Update the value and expiration time of the existing item

      const itemIndex = this.cacheMap[key];
      this.cacheList[itemIndex].value = value;
      this.cacheList[itemIndex].expiration = new Date(Date.now() + ttl);
      return;
    }

    // Create a new item and add it to the cache
    const newItem = {
      key,
      value,
      expiration: new Date(Date.now() + ttl),
    };
    // Add the new item to the end of the cache list
    this.cacheList.push(newItem);

    // Add the new item to the cache map
    this.cacheMap[key] = this.cacheList.length - 1;

    // If the cache size is greater than the specified limit, remove the oldest item
    if (this.cacheList.length > this.size) {
      this.removeOldest();
    }
  }

  get(key) {
    // Check if key exists in the cache
    if (this.cacheMap.hasOwnProperty(key)) {
      const itemIndex = this.cacheMap[key];
      // Check if the item has expired
      if (this.cacheList[itemIndex].expiration <= new Date()) {
        // Remove the expired item from the cache
        this.remove(key);
        return undefined;
      }

      // Return the value of the item
      return this.cacheList[itemIndex].value;
    }

    // Key not found in cache
    return undefined;
  }

  remove(key) {
    // Check if key exists in the cache
    if (this.cacheMap.hasOwnProperty(key)) {
      const itemIndex = this.cacheMap[key];

      // Remove the item from the cache list and map
      this.cacheList.splice(itemIndex, 1);
      delete this.cacheMap[key];

      // Update the indexes in the cache map for the items after the removed item
      for (let i = itemIndex; i < this.cacheList.length; i++) {
        this.cacheMap[this.cacheList[i].key] = i;
      }
      return 204;
    } else {
      return 404;
    }
  }

  removeOldest() {
    // Get the oldest item from the back of the cache list
    const oldestItem = this.cacheList.pop();

    // Remove the oldest item from the cache map
    delete this.cacheMap[oldestItem.key];
  }
}

module.exports = Cache;
