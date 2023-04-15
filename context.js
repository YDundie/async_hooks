const async_hooks = require("async_hooks");

// Create a new async hook to track the lifecycle of each request
const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    // When a new async resource is created, create a new context object
    if (type === "HTTPINCOMINGMESSAGE") {
      const context = {};
      async_hooks.executionAsyncId = asyncId; // Store the executionAsyncId in the async_hooks module
      contexts.set(asyncId, context);
    }
  },
  destroy(asyncId) {
    // When an async resource is destroyed, remove its associated context object
    contexts.delete(asyncId);
  },
});

const contexts = new Map();

// Enable the async hook
asyncHook.enable();

// Export the contexts Map so it can be used in other files
module.exports = {
  contexts,
  async_hooks, // export async_hooks here
};
