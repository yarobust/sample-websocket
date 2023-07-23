'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

const THRESHOLD = 30;

wss.on('connection', function (ws) {
  let responseNumber = 0;

  const id = setInterval(function () {
    if (responseNumber++ > THRESHOLD) {
      console.log(`exceeding threshold(${THRESHOLD})`);
      clearInterval(id);
      return;
    }
    console.log('send ' + responseNumber)
    ws.send(JSON.stringify(process.memoryUsage()), function () {
      //
      // Ignore errors.
      //
    });
  }, 1000);
  console.log('started client interval');

  ws.on('close', function () {
    console.log('stopping client interval');
    clearInterval(id);
  });
});

server.listen(8080, function () {
  console.log('Listening on http://0.0.0.0:8080');
});