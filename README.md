## Simple guide

```bash
# install dependencies
$ npm install

# create a file called "env_config.js", and fill in information with the following format

module.exports = {
  MESSAGE_API:
    'https://graph.facebook.com/v6.0/me/messages something like this',
  VERIFY_TOKEN: 'random string that you create',
  ACCESS_TOKEN: 'long long string you can get on FB',
};

# serve with hot reload at localhost:5000
$ npm run dev
```

You might have to use tools for example [ngrok](https://ngrok.com/) or deploy the server to sites for example [Heroku](https://www.heroku.com/) to see the result. 

 [API reference](https://developers.facebook.com/docs/messenger-platform/send-messages) 


