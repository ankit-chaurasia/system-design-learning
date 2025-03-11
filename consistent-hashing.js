import crypto from "crypto";

class ConsistentHashing {
  constructor(replicas) {
    this.replicas = replicas;
    this.ring = new Map();
    // It is used to locate the nearest server in the ring
    this.sortedHashes = [];
  }
  _hash(value) {
    return parseInt(
      crypto.createHash("md5").update(value).digest("hex").slice(0, 8),
      16
    );
  }

  addServer(serverId) {
    for (let i = 0; i < this.replicas; i++) {
        const hash = this._hash(`${serverId}-${i}`);
        this.ring.set(hash, serverId);
        this.sortedHashes.push(hash);
    }
    this.sortedHashes.sort((a, b) => a - b);
  }

  removeServer(serverId) {
    for (let i = 0; i < this.replicas; i++) {
        const hash = this._hash(`${serverId}-${i}`);
        this.ring.delete(hash);
        this.sortedHashes = this.sortedHashes.filter(h = h !== hash);
    }
  }

  getServer(key) {
    if (this.ring.size === 0) return null;
    const keyHash = this._hash(key);
    for(let hash of this.sortedHashes) {
        if (keyHash <= hash) {
            return this.ring.get(hash);
        }
    }
    return this.ring.get(this.sortedHashes[0]);
  }

}

// Example Usage
const ch = new ConsistentHashing(3);
ch.addServer("server1");
ch.addServer("server2");
ch.addServer("server3");

console.log("Key1 maps to:", ch.getServer("Key1"));
console.log("Key2 maps to:", ch.getServer("Key2"));
console.log("Key3 maps to:", ch.getServer("Key3"));
