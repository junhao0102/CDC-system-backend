import express from "express";
import routes from "@/routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api", routes);

// http server 、 ocpp server
(async () => {
  try {
    app.listen(3000, () => {
      console.log("HTTP server is listening on http://localhost:3000");
    });
  } catch (e) {
    console.error(`Start server error:, ${e}`);
  }
})();
