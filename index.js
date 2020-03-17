const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const env = require('./env_config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/fb', handleVerify);
app.post('/fb', receiveMessage);

function handleVerify(req, res) {
  if (req.query['hub.verify_token'] === env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.status(400).json({
      msg: `Validation failed, please check your verify token.`,
    });
  }
}

function receiveMessage(req, res) {
  const event = req.body.entry[0].messaging[0];
  console.log(event);
  const userId = event.sender.id;
  const userText = event.message.text;
  let replyWords;
  if (event.message && event.message.text) {
    replyWords = `You said ${userText}`;
    sendMessage(userId, replyWords);
  } else if (event.message && !event.message.text) {
    replyWords = `Text only, please.`;
    sendMessage(userId, replyWords);
  } else {
    res
      .status(400)
      .json({ msg: 'Something went wrong when receiving message.' });
  }
  res.sendStatus(200);
}

function sendMessage(receiver, replyWords) {
  const replyData = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: receiver,
    },
    message: {
      text: replyWords,
    },
  };

  axios
    .post(`${env.MESSAGE_API}?access_token=${env.ACCESS_TOKEN}`, replyData)
    .then(function(response) {
      // console.log('response', response);
    })
    .catch(function(error) {
      // console.log('error', error);
    });
}

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
