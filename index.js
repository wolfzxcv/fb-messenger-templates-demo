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
  let replyData;
  if (
    event.message &&
    event.message.text &&
    event.message.text.includes('按鈕')
  ) {
    replyWords = 'Site links here';
    (replyData = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: replyWords,
          buttons: [
            {
              type: 'web_url',
              url: 'https://www.google.com.tw/',
              title: 'Google',
            },
            {
              type: 'web_url',
              url: 'https://www.youtube.com/',
              title: 'Youtube',
            },
            {
              type: 'web_url',
              url: 'https://www.yahoo.com/',
              title: 'Yahoo',
            },
          ],
        },
      },
    }),
      sendMessage(userId, replyData);
  } else if (
    event.message &&
    event.message.text &&
    event.message.text.includes('快選')
  ) {
    replyData = {
      text: 'Yes or No',
      quick_replies: [
        {
          content_type: 'text',
          title: 'Yes',
          payload: '<POSTBACK_PAYLOAD>',
          image_url:
            'https://image.shutterstock.com/image-vector/smiley-vector-happy-face-260nw-408014413.jpg',
        },
        {
          content_type: 'text',
          title: 'No',
          payload: '<POSTBACK_PAYLOAD>',
          image_url:
            'https://i.pinimg.com/736x/b4/42/b3/b442b3c2ac6ac0beffc9e554474a208c.jpg',
        },
      ],
    };
    sendMessage(userId, replyData);
  } else if (
    event.message &&
    event.message.text &&
    event.message.text.includes('牌卡')
  ) {
    (replyData = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Taiwan',
              image_url:
                'http://thinkpower.com.tw/demo/thsrcAI/images/card-station.png',
              buttons: [
                {
                  type: 'postback',
                  payload: 'Taipei',
                  title: 'Taipei',
                },
                {
                  type: 'postback',
                  title: 'Taichung',
                  payload: 'Taichung',
                },
                {
                  type: 'postback',
                  title: 'Kaohsiung',
                  payload: 'Kaohsiung',
                },
              ],
            },
            {
              title: 'Norway',
              image_url:
                'http://thinkpower.com.tw/demo/thsrcAI/images/card-station.png',
              buttons: [
                {
                  type: 'postback',
                  payload: 'Oslo',
                  title: 'Oslo',
                },
                {
                  type: 'postback',
                  title: 'Bergen',
                  payload: 'Bergen',
                },
                {
                  type: 'postback',
                  title: 'Tromsø',
                  payload: 'Tromsø',
                },
              ],
            },
            {
              title: 'Finland',
              image_url:
                'http://thinkpower.com.tw/demo/thsrcAI/images/card-station.png',
              buttons: [
                {
                  type: 'postback',
                  payload: 'Helsinki',
                  title: 'Helsinki',
                },
                {
                  type: 'postback',
                  title: 'Espoo',
                  payload: 'Espoo',
                },
                {
                  type: 'postback',
                  title: 'Tampere',
                  payload: 'Tampere',
                },
              ],
            },
          ],
        },
      },
    }),
      sendMessage(userId, replyData);
  } else if (event.message && event.message.text) {
    replyWords = `You said ${userText}`;
    replyData = {
      text: replyWords,
    };
    sendMessage(userId, replyData);
  } else if (event.message && !event.message.text) {
    replyWords = `Text only, please.`;
    replyData = {
      text: replyWords,
    };
    sendMessage(userId, replyData);
  } else {
    res
      .status(400)
      .json({ msg: 'Something went wrong when receiving message.' });
  }
  res.sendStatus(200);
}

function sendMessage(receiver, replyData) {
  const allData = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: receiver,
    },
    message: replyData,
  };

  axios
    .post(`${env.MESSAGE_API}?access_token=${env.ACCESS_TOKEN}`, allData)
    .then(function(response) {
      // console.log('response', response);
    })
    .catch(function(error) {
      // console.log('error', error);
    });
}

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
