const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
const router = require('./Routes/routes.js');

const corsOptions = {
    origin: [
      'https://word-to-pdf-app-8mb7-47ycpi3c9-satyam-40070s-projects.vercel.app',
      'http://localhost:3000',  // Add your local development URL
      // Add any other frontend URLs that need access
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  };

app.use(cors(corsOptions));
app.use(express.json());

app.use('/', router);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});