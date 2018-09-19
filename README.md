# tc-predictor

Setup:
- get yarn (`brew install yarn`)
- install dependencies (`yarn`)
- install frontend dependencies (`cd react-ui && yarn`)
- build the frontend (`yarn build`)
- optionally, install nodemon (`yarn global add nodemon`)
- run the server (`yarn start` or `nodemon` for hot-reloading server)
- go to http://localhost:5000
- optionally, run standalone hot-reloading frontend server (`cd fronted && yarn start`)
  - go to http://localhost:3000

Other things:
- run redis server locally on `127.0.0.1:6379` (https://redis.io/topics/quickstart)
- setup the `.env` file to contain your a topcoder sso key (look at `document.cookie` on community.topcoder.com) (only required for /api/round websocket stuff)
- setup the `.env` file to specify `ENABLE_CACHE=1` to cache api results
