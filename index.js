const sassMiddleware = require("node-sass-middleware"),
  dictionary = require("./dictionary"),
  express = require("express"),
  path = require("path"),
  http = require("http"),
  fs = require("fs");

const app = express();
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

function normalizePort(val) {
  const portValue = parseInt(val, 10);

  if (isNaN(portValue)) {
    // named pipe
    return val;
  }

  if (portValue >= 0) {
    // port number
    return portValue;
  }

  return false;
}
// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  sassMiddleware({
    force: true,
    dest: path.join(__dirname, "public"),
    src: path.join(__dirname, "styles"),
    outputStyle: "compressed",
    debug: true,
  })
);
app.use(express.static("public"));

app.get("/:view", (req, res) => {
  res.render(req.params.view, dictionary[req.params.view] || {});
});

console.log("\n\nAplicación inicializada:");
const viewsPath = path.join(__dirname, "views");
const files = fs.readdirSync(viewsPath);

console.log("\nVistas Disponibles");
console.log("---------------------------------\n");
files
  .filter((file) => fs.lstatSync(path.join(viewsPath, file)).isFile())
  .forEach((file, index) => {
    console.log(
      `${index + 1} - http://127.0.0.1:${port}/${file.split(".")[0]} \n`
    );
  });
