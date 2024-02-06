const http = require("http");
const fs = require("fs");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

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
  const pathName = req.url;
  // ROOT or OVERVIEW ROUTE:
  if (pathName === "/" || pathName === "/overview") {
    const cardHtml = objData
      .map((product) => replaceTemplate(tempCard, product))
      .join("");

    const overviewHtml = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(overviewHtml);
  }
  // PRODUCTS ROUTE:
  else if (pathName === "/products") {
    res.end("Product Route");
  }
  // API ROUTE:
  else if (pathName === "/api") {
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
