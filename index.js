const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config.js");

// create an http server
const httpServer = http.createServer(unifiedServer);
// start the httpServer
httpServer.listen(config.httpPort, () => {
  console.log("HTTP server started on port: ", config.httpPort);
});

const httpsServerOptions = {
  // These won't be checked into git
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};

const httpsServer = https.createServer(httpsServerOptions, unifiedServer);
httpsServer.listen(config.httpsPort, () => {
  console.log("HTTPS server started on port: ", config.httpsPort);
});

// server logic for both out servers
function unifiedServer(req, res) {
  // we don't need any business logic for this simple API
  // other than to ensure that the user hits /hello
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path from the URL and trim it
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // get the method
  const method = req.method.toLowerCase();

  // Construct the data object to send to the handler
  // For this simple API we only need the path and method
  // as user input is inconsequential
  const data = {
    trimmedPath,
    method
  };

  // Choose the handler this request should go to
  const chosenHandler =
    typeof router[trimmedPath] !== "undefined"
      ? router[trimmedPath]
      : handlers.notFound;

  // Route the request to the handler specified in the router. Status and payload are given default values
  chosenHandler(data, (statusCode = 200, responsePayload = {}) => {
    // convert payload to string
    const payloadString = JSON.stringify(responsePayload);
    // return response
    res.setHeader("Content-Type", "application/json");
    res.writeHead(statusCode);
    res.end(payloadString);

    console.log("Returning res: ", statusCode, payloadString);
  });
}

// Define route handlers
const handlers = {};

// Not found handler
handlers.notFound = (data, cb) => {
  cb(404);
};

// Hello handler
handlers.hello = (data, cb) => {
  const acceptableMethods = ["post"];
  if (acceptableMethods.includes(data.method)) {
    cb(200, { hello: "world" });
  } else {
    cb(405);
  }
};

// Define a request router
const router = {};

router.hello = handlers.hello;

// Hello guys: here's my "Homework Assignment #1". Built a simple Node API that returns a greeting in json format on the /hello route.
