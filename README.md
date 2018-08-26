# tc-predictor

Setup:
- get yarn (`brew install yarn`)
- install dependencies (`yarn`)
- install nodemon (`yarn global add nodemon`)
- build the frontend (`cd react-ui && yarn build`)
- run the server (`yarn start`)
- go to http://localhost:5000

Other things:
- run redis server locally on `127.0.0.1:6379` (https://redis.io/topics/quickstart)
- setup the `.env` file to contain your a topcoder sso key (look at `document.cookie` on community.topcoder.com) (only required for /api/round websocket stuff)
