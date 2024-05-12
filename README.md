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

### Account APIs

#### Login

```
  POST /api/account/token/
```

| Data       | Type     | Mandatory | Description                                 |
| :--------- | :------- | :-------: | :------------------------------------------ |
| `username` | `String` |    Yes    | User's username                             |
| `password` | `String` |    Yes    | Password associated with the user's account |

| Response data | Type     | Description   |
| :------------ | :------- | :------------ |
| `access`      | `String` | Access token  |
| `refresh`     | `String` | Refresh token |

#### Refresh JWT tokens

```
  POST /api/account/token/refresh/
```

| Headers         | Type     | Mandatory | Description                     |
| :-------------- | :------- | :-------: | :------------------------------ |
| `Authorization` | `String` |    Yes    | Bearer token: "Bearer `access`" |

| Data      | Type     | Mandatory | Description   |
| :-------- | :------- | :-------: | :------------ |
| `refresh` | `String` |    Yes    | Refresh token |

| Response data | Type     | Description       |
| :------------ | :------- | :---------------- |
| `access`      | `String` | New access token  |
| `refresh`     | `String` | New refresh token |

#### Logout

```
  POST /api/account/logout/
```

| Headers         | Type     | Mandatory | Description                     |
| :-------------- | :------- | :-------: | :------------------------------ |
| `Authorization` | `String` |    Yes    | Bearer token: "Bearer `access`" |

| Data      | Type     | Mandatory | Description                |
| :-------- | :------- | :-------: | :------------------------- |
| `refresh` | `String` |    Yes    | Refresh token to blacklist |

#### Register

```
  POST /api/account/register/
```

| Data         | Type     | Mandatory | Description                                    |
| :----------- | :------- | :-------: | :--------------------------------------------- |
| `username`   | `String` |    Yes    | Account's username. **Must be unique**         |
| `email`      | `String` |    Yes    | Account's email. **Must be unique**            |
| `password`   | `String` |    Yes    | **Min 8 characters and not a common password** |
| `password2`  | `String` |    Yes    | **Must be identical to "password"**            |
| `first_name` | `String` |    Yes    |                                                |
| `last_name`  | `String` |    Yes    |                                                |

#### Retrieve user's information

```
  GET /api/account/user/
```

| Headers         | Type     | Mandatory | Description                     |
| :-------------- | :------- | :-------: | :------------------------------ |
| `Authorization` | `String` |    Yes    | Bearer token: "Bearer `access`" |

| Response data | Type      | Description |
| :------------ | :-------- | :---------- |
| `id`          | `Integer` |             |
| `username`    | `String`  |             |
| `email`       | `String`  |             |
| `first_name`  | `String`  |             |
| `last_name`   | `String`  |             |

### Post APIs

#### List all public posts

```
  GET /api/post/public/
```

| Headers         | Type     | Mandatory | Description                     |
| :-------------- | :------- | :-------: | :------------------------------ |
| `Authorization` | `String` |    Yes    | Bearer token: "Bearer `access`" |

| Response data | Type      | Description                                                                                                    |
| :------------ | :-------- | :------------------------------------------------------------------------------------------------------------- |
| `count`       | `Integer` | Total number of objects found                                                                                  |
| `next`        | `String`  | Link to next page                                                                                              |
| `previous`    | `String`  | Link to previous page                                                                                          |
| `results`     | `Array`   | List of posts. Example: [{"id": 1, "author": "admin", "content": "Some text", "created_at": "1 Genuary 2024"}] |

#### List all user's posts

```
  GET /api/post/user/
```

| Headers         | Type     | Mandatory | Description                     |
| :-------------- | :------- | :-------: | :------------------------------ |
| `Authorization` | `String` |    Yes    | Bearer token: "Bearer `access`" |

| Response data | Type      | Description                                                                                                                     |
| :------------ | :-------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `count`       | `Integer` | Total number of objects found                                                                                                   |
| `next`        | `String`  | Link to next page                                                                                                               |
| `previous`    | `String`  | Link to previous page                                                                                                           |
| `results`     | `Array`   | List of posts. Example: [{"id": 1, "author": "admin", "content": "Some text", "created_at": "1 Genuary 2024", "hidden": false}] |

#### Create new post

```
  POST /api/post/user/
```

| Headers         | Type     | Mandatory | Description                     |
| :-------------- | :------- | :-------: | :------------------------------ |
| `Authorization` | `String` |    Yes    | Bearer token: "Bearer `access`" |

| Data      | Type      | Mandatory | Description                         |
| :-------- | :-------- | :-------: | :---------------------------------- |
| `content` | `String`  |    Yes    | Post message                        |
| `hidden`  | `Boolean` |    Yes    | Flag to hide posts from other users |

#### Edit a user's post

```
  PUT /api/post/user/<id>/
```

| URL params | Type      | Mandatory | Description |
| :--------- | :-------- | :-------: | :---------- |
| `id`       | `Integer` |    Yes    | Post `id`   |

| Headers         | Type     | Mandatory | Description                     |
| :-------------- | :------- | :-------: | :------------------------------ |
| `Authorization` | `String` |    Yes    | Bearer token: "Bearer `access`" |

| Data      | Type      | Mandatory | Description                         |
| :-------- | :-------- | :-------: | :---------------------------------- |
| `content` | `String`  |    No     | Post message                        |
| `hidden`  | `Boolean` |    No     | Flag to hide posts from other users |

#### Delete a user's post

```
  DELETE /api/post/user/<id>/
```

| URL params | Type      | Mandatory | Description |
| :--------- | :-------- | :-------: | :---------- |
| `id`       | `Integer` |    Yes    | Post `id`   |

| Headers         | Type     | Mandatory | Description                     |
| :-------------- | :------- | :-------: | :------------------------------ |
| `Authorization` | `String` |    Yes    | Bearer token: "Bearer `access`" |

## Environment Variables

#### Backend

| Variable                        | Type      | Description                                                     | More details                                                        |
| :------------------------------ | :-------- | :-------------------------------------------------------------- | :------------------------------------------------------------------ |
| `SECRET_KEY`                    | `String`  | Django secret key                                               | Random string                                                       |
| `DEBUG`                         | `Boolean` | Flag for enable debug mode                                      | Set this to False in production                                     |
| `ALLOWED_HOSTS`                 | `Array`   | Array of domains on which the backend is served                 | Typically the local host and IP and domain of the production server |
| `CORS_ALLOW_CREDENTIALS`        | `Boolean` | Flag for enable CORS for credentials                            | Allows cookies to be included in cross-site HTTP requests           |
| `CORS_ORIGIN_ALLOW_ALL`         | `Boolean` | Flag for enable CORS origins                                    |                                                                     |
| `ENABLE_SESSION_AUTHENTICATION` | `Boolean` | Flag for enable session authentication                          | Useful for API debugging with DRF templates                         |
| `ACCESS_TOKEN_MINUTES_LIFETIME` | `Integer` | Number of minutes that access token will be valid if not used   |                                                                     |
| `REFRESH_TOKEN_DAYS_LIFETIME`   | `Integer` | Number of days that the refresh token will be valid if not used |                                                                     |

#### Frontend

| Variable                  | Type      | Description                                | More details                |
| :------------------------ | :-------- | :----------------------------------------- | :-------------------------- |
| `PORT`                    | `Integer` | Port on which to expose the application    |                             |
| `REACT_APP_WEBSITE_NAME`  | `String`  | Name of the website used in the index.html |                             |
| `REACT_APP_AXIOS_TIMEOUT` | `Integer` | Maximum waiting time during HTTP calls     | 1000 = 1 sec                |
| `REACT_APP_BACKEND_HOST`  | `String`  | Backend address                            | Base URL used for API calls |
