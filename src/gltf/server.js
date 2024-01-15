// server.js
const express = require("express");
const app = express();
const path = require("path");

const modelFilePath = "C:/Users/fern/Desktop/conworth/revit-gltf/test/homework"; // Update with your model path

app.use(express.static(path.dirname(modelFilePath))); // Serve files from the directory containing your GLTF model

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
