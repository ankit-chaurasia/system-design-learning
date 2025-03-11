class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity; // Max no. of tokens that bucket can hold
    this.tokens = capacity; // Current no. of tokens
    this.refillRate = refillRate; // Tokens added per seconds
    this.lastRefillTime = Date.now(); // Last time tokens were filled
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefillTime) / 1000;
    const tokensToAdd = elapsed * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  consume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }
}

const bucket = new TokenBucket(10, 5); // Max 10 token, refills at 5 token per sec

let requestCount = 0;
setInterval(() => {
  requestCount++;
  if (bucket.consume(2)) {
    // Consume more tokens per request to trigger denials
    console.log(`Request ${requestCount} allowed at`, new Date().toISOString());
  } else {
    console.log(`Request ${requestCount} denied at`, new Date().toISOString());
  }
}, 200);
