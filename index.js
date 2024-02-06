const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const replaceTemplate = require("./modules/replaceTemplate");
// const url = require("url");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const jsonData = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const objData = JSON.parse(jsonData);

const server = http.createServer((req, res) => {
  // This code does'nt work properly, In the Nodejs documentation they says it's Depricated now. Here the main problem is the QueryString object remians empty sometimes. That means the QueryString Object key shows empty({"": "0"}) like this, though the value shows proeprly.
  // const { pathname, query } = url.parse(req.url, true);
  // console.log("Pathname ---> ", pathname);
  // console.log("Query ---> ", query);

  const pathname = req.url;
  const obj = querystring.parse(pathname);
  const [[key, value]] = Object.entries(obj);

  // ROOT or OVERVIEW ROUTE:
  if (pathname === "/" || pathname === "/overview") {
    const cardHtml = objData
      .map((product) => replaceTemplate(tempCard, product))
      .join("");

    const overviewHtml = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(overviewHtml);
  }
  // PRODUCT ROUTE:
  else if (pathname === `${key}=${value}`) {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = objData[value];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  // API ROUTE:
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(jsonData);
  }
  // NOT FOUND ROUTE:
  else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "A.K. Polash",
    });
    res.end("<h1>Page Not Found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => console.log("PORT IR RUNNIG ON 8000"));
