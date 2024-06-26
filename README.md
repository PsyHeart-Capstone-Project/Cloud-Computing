<p align="center">
  <img src="image/PsyHeart Logo.png" alt="PsyHeart Logo" height="180" />
</p>

<h1 align="center">PsyHeart Web Service</h1>

PsyHeart Web Service is a web service that allows you to listen to songs according to your mood. The songs here are classified based on genre and BPM, so you can find music that fits your current feelings. This service is under development and will be updated soon.

> Base URL of this service is: http://localhost:9000/

The service available:

- Authentications
  <pre>POST /login</pre>
  <pre>POST /logout</pre>

- Users
  <pre>GET  /profiles</pre>
  <pre>POST /register</pre>
  <pre>PUT  /profiles</pre>

- Predictions
  <pre>POST /predict_category</pre>

- Categories
  <pre>GET  /song_categories</pre>
  <pre>GET  /song_categories/{id}</pre>

- Questionnaire
  <pre>GET  /questionnaire</pre>
  <pre>POST /questionnaire</pre>
  <pre>PUT  /questionnaire</pre>

- Recommendation
  <pre>GET  /song_recommendation</pre>

# Quick Look

## Architecture

<p align="center">
  <img src="image/PsyHeart Architecture.png" alt="PsyHeart logo" />
</p>

# Authentications

This service uses tokens for authentication. You should have an account to access this service. First, create a new account if you don't have one. Then, the token for authentication will automatically saved. It's like login; you need to authenticate yourself with your email and password. If the authentication is valid, you will get a token. You can use this token to access the service. If you don't, you will get an error message.

# Instructions

## Predictions Category Service

The prediction service utilizes one of the Google Cloud Platform services, Cloud Functions, and model endpoints. The endpoint predicts the genre and category based on features and BPM extracted from a song, and Cloud Functions extracts features and BPM from a song uploaded to the bucket.

Cloud Functions will be triggered when a new song is uploaded to the bucket, and then it sends a POST request with the extracted features and BPM values to be processed by the model. Then, it receives a response from the model endpoint.

If the prediction is successful, you will get a JSON object containing the prediction result, which includes the highest probability and the predicted class.

If the predicted class matches the desired one, the prediction results and song metadata will be stored in the song database and displayed in the application.

# Environment

In order to run this project, you need to configure the following environment variables:

```bash

# node-postgres configuration
DATABASE_URL = {your database url}
DB_HOST = {your database host}
DB_NAME = {your database name}
DB_USER = {your database username }
DB_PASS = {your database password}
DB_PORT = {your database port}

# JWT Token Key
ACCESS_TOKEN_KEY = {define your own token key}
ACCESS_TOKEN_AGE = {define how long the access token is valid}

# Model
MODEL_URL = {define your own model url}

# Predict API Url
PREDICT_API_URL= {your predict api url}

```

Then you can use the following image to create your own database:

<a href="">
  <img src="image/PsyHeart ERD.png" />
</a>

<p align="center">Databases ERD</p>

### Dependency

- [Hapi Server](https://www.npmjs.com/package/@hapi/hapi)
- [JWT](https://www.npmjs.com/package/@hapi/jwt)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [DotEnv](https://www.npmjs.com/package/dotenv)
- [Joi](https://www.npmjs.com/package/joi)
- [Nanoid](https://www.npmjs.com/package/nanoid)
- [node-pg-migrate](https://www.npmjs.com/package/node-pg-migrate)
- [pg](https://www.npmjs.com/package/pg)
- [Tensorflow JS](https://www.npmjs.com/package/@tensorflow/tfjs-node)

# Testing

This Web service uses Postman to test.

- You can download the Postman documentation [here](https://documenter.getpostman.com/view/25236404/2sA3XTezv8).

If you want to contribute to this project, please contact us.

## Contributors

### CC Member

The CC member is tasked with developing the API service, deploying the service, and the model. Essentially, in this project, CC handles backend operations and infrastructure.

#### Individuals

<ul>
    <li><strong>Aliyah Nisa Lathifah</strong> - C009D4KX1152 - <a href="https://github.com/aliyahnl">aliyahnl</a></li>
    <li><strong>Anisa Amalia Putri</strong> - C009D4KX0707 - <a href="https://github.com/ansmlptr">ansmlptr</a></li>
</ul>


