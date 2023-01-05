import bodyParser from "body-parser";
import express, { Response } from "express";
import morganBody from "morgan-body";
import fs from "fs";
import path from "path";

const app = express();

const log = fs.createWriteStream(
  path.join(__dirname, "logs", `${Date.now()}.log`),
  {
    flags: "a",
  }
);

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// application/json
app.use(bodyParser.json());
// application/xml
app.use(bodyParser.text({ type: "text/xml" }));

// morgan logger
const morganOptions = {
  includeFinalNewLine: true,
  prettify: true,
  logAllReqHeader: true,
  logReqUserAgent: true,
  logRequestBody: true,
  logIP: true,
  logReqDateTime: true,
  logResponseBody: false,
  immediateReqLog: true,
};

morganBody(app, morganOptions);

morganBody(app, {
  noColors: true,
  stream: log,
  ...morganOptions,
});

const successResponse = (res: Response) => {
  res.status(200).send(JSON.stringify({ status: "success" }));
};

app.get("*", (_, res) => successResponse(res));
app.post("*", (_, res) => successResponse(res));
app.put("*", (_, res) => successResponse(res));
app.delete("*", (_, res) => successResponse(res));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
