# Corob test

Twitter-like web application based on Django and React.\
Test for technical interview with Corob

## Features

#### Platform

- Users can authenticate and register on the platform
- Only registered users can access the web application
- Each user can post a tweet
- Each user can edit its own tweets but cannot modify other user's tweets
- Tweets can be set to hidden, so other users can only see the list of public tweets

#### Technical

- JWT authentication
- Automatically refresh JWT tokens if they expire during the session
- Form validation both client-side and server-side
- Mobile ready (:construction: work in progress)

## Run Locally

Clone the project

```bash
git clone https://github.com/pogginicolo98/corob-test.git
```

Go to the project directory

```bash
cd corob-test
```

Build docker images

```bash
docker compose build
```

Start docker

```bash
docker compose up
```

Open your browser and navigate to:

```
http://localhost/
```

## Run backend unit tests

```bash
docker exec twitter-backend sh ./test_coverage.sh
```

## API Reference

#### Create new item

```
  POST /api/items/new
```

| Headers         | Type     | Mandatory | Description  |
| :-------------- | :------- | :-------: | :----------- |
| `Authorization` | `string` |    Yes    | Bearer token |

| Data      | Type     | Mandatory | Description                         |
| :-------- | :------- | :-------: | :---------------------------------- |
| `param_1` | `string` |    Yes    | Description of param_1              |
| `param_2` | `object` |    No     | Example of the structure of param_2 |

| Response data | Type     | Description                          |
| :------------ | :------- | :----------------------------------- |
| `return_1`    | `string` | Description of return_1              |
| `return_2`    | `object` | Example of the structure of return_2 |

## Environment Variables

#### Backend

| Variable                        | Type    | Description                                                     | More details                                                        |
| :------------------------------ | :------ | :-------------------------------------------------------------- | :------------------------------------------------------------------ |
| `SECRET_KEY`                    | String  | Django secret key                                               | Random string                                                       |
| `DEBUG`                         | Boolean | Flag for enable debug mode                                      | Set this to False in production                                     |
| `ALLOWED_HOSTS`                 | Array   | Array of domains on which the backend is served                 | Typically the local host and IP and domain of the production server |
| `CORS_ALLOW_CREDENTIALS`        | Boolean | Flag for enable CORS for credentials                            | Allows cookies to be included in cross-site HTTP requests           |
| `CORS_ORIGIN_ALLOW_ALL`         | Boolean | Flag for enable CORS origins                                    |                                                                     |
| `ENABLE_SESSION_AUTHENTICATION` | Boolean | Flag for enable session authentication                          | Useful for API debugging with DRF templates                         |
| `ACCESS_TOKEN_MINUTES_LIFETIME` | Integer | Number of minutes that access token will be valid if not used   |                                                                     |
| `REFRESH_TOKEN_DAYS_LIFETIME`   | Integer | Number of days that the refresh token will be valid if not used |                                                                     |

#### Frontend

| Variable                  | Type    | Description                                | More details                |
| :------------------------ | :------ | :----------------------------------------- | :-------------------------- |
| `PORT`                    | Integer | Port on which to expose the application    |                             |
| `REACT_APP_WEBSITE_NAME`  | String  | Name of the website used in the index.html |                             |
| `REACT_APP_AXIOS_TIMEOUT` | Integer | Maximum waiting time during HTTP calls     | 1000 = 1 sec                |
| `REACT_APP_BACKEND_HOST`  | String  | Backend address                            | Base URL used for API calls |
