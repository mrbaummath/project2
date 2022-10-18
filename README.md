# Stat Demo Generator

## Introduction

This is an app where statistics teachers can generate data and distributions for use in classroom activities. Teachers will be able to choose whether to generate binary categorical data or quantitative data from a gaussian distribution. They will be given back a randomly generated data set (randomness will be provided via the Random.org API) and a summary distribution (binom or normal curve as appropriate).
---
#### Technologeis used:
- HTML
- CSS
- Javascript
    - Node
    - express
    - mongoose
- MongoDB
- Desmos API
    -calculator: https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6 (this demo key is public )
- Random.org API
    - generateGaussians method
    - generateDecimalFractions method
---

## Installation
This is an express JS app. Dependencies are defined in a package.json file and can be installed by running npm install from the project directory. 

## Approach
The app uses an MVC pattern with express backend and liquid-express-views for view templating. Samples are stored as documents in one of two MongoDB collections depending on their type (normal, binom). Mongoose is used for document management.

Users initialize a sample with some basic information about the distribution and then the server calls to random.org within the relevant controller to get values. The values are then added to the request body before creating the document. All data models have some descriptive fields and an array of values (numerical for Normal, boolean for Bernoulli trials) stored in the document.

When viewing a particular sample, the app uses the Desmos API to do some basic data visualization

Users can edit documents using HTML forms. For Bernoulli trials, only labels about the data can be edited. If users want a different result they should create a new sample (keeping in the spirit of randomization). 

With samples from a normal dist, though, users do have the option of altering the shape of their sample distriubution by manipulating a Desmos graph. Programatically, the script on that page is using Desmos' obersve feature to detect changes to a list of bar heights. On submitting the form to edit, the script on the page generates n psuedo-random values for each histogram bin (where n is the new bar height) and sends it to the server for some more basic processing to update the values on the sample.

Users can leave comments on any set to give others ideas of how the sample might be used in class. Users can edit and delete their own generated samples.

## Using the app
After signing up/logging in, users can navigate to the "new" page via the nav bar and select the type of sample to take. There are two options: sample from a Normal distribution and run Bernoulli trials. Both options will reach out to Random.org to get truly random data. For the Normal distribution, Random.org can directly sample from a Gaussian distribution with specified mu and sigma. The bernoulli trials rely on generation of uniformly random decimals, which are converted by the server into booleans by checking to see if the value is no more than the target probability of success.

Once generated, descriptions of data can be edited. For samples of Normal Distributions, users can see an interactive Desmos histogram and can alter heights of bars to change the sample. On editing, the server will generate psuedorandom values to create a sample matching the histogram. The mu and sigma will also be set to the y-bar and s values of the sample.

Users can comment on data from the show page and can see the entire data set.

## Still to be done
While the site is functional, there are some less than ideal implementations. For v2, I would either ditch Desmos' native histogram feature altogether or else implement an async setting to get the bar heights to represent density on the main show page. I could also add the ability to edit binom set values, though this somewhat goes against the purpose of running a simulation. There are also some style elements to clean up. In particular, I'm not thrilled with the color scheme. 

## Routes

| URL                  | HTTP Verb | Action                                   |
|----------------------|-----------|------------------------------------------|
| /                    | GET       | show                                     |
| /datasets            | GET       | index all sets                           |
| /datasets/mine       | GET       | index user's sets                        |
| /datasets/new        | GET       | show form to make new set                |
| /datasets/:type/:id  | DELETE    | delete dataset given it's type and id    |
| /normalsets          | POST      | create a new normal set                  |
| /normalsets/:id      | GET       | show a normal set                        |
| /normalsets/:id      | PUT       | update a normal set                      |
| /normalsets/:id/edit | GET       | show edit page for particular normal set |
| /binomsets           | POST      | create a new bernoulli trial sample      |
| /binomsets/:id       | GET       | show a binom set                         |
| /binomsets/:id       | PUT       | update a binom set                       |
| /binomsets/:id/edit  | GET       | show edit page for a binom set           |


## Deployment

The app is currently deployed using flyio and is accessible  [here](https://stat-generator.fly.dev/)