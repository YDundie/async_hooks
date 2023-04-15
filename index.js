const express = require("express");
const { contexts, async_hooks } = require("./context"); // import both contexts and async_hooks

const app = express();

const contextCleanup = () => {
  for (const [asyncId, context] of contexts) {
    console.log(`Context for async ID ${asyncId}:`, context);
  }

  // get the current execution context
  const currentContext = async_hooks.executionAsyncId;

  // get the context object for this execution context
  const contextObject = contexts.get(currentContext);

  // call the destroy function on the context object
  if (contextObject && contextObject.destroy) {
    contextObject.destroy();
  }

  // remove the context object from the map
  contexts.delete(currentContext);
  console.log("finished context cleanup");
};

const contextProvider = (req, res, next) => {
  const context = contexts.get(async_hooks.executionAsyncId); // Get the context object from the contexts Map
  context.jwt = "123" + Date.now().toString();
  next();
  contextCleanup();
};

//create a server object:
app.use(contextProvider);

app.get("/test", (req, res) => {
  console.log("Hello from function");
  const context = contexts.get(async_hooks.executionAsyncId); // Get the context object from the contexts Map
  res.send(context.jwt);
});

app.listen(8080, () => {
  console.log("listening on 8080...alo");
}); //the server object listens on port 8080
