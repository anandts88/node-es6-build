# node-es6-build
Node JS, express and ES6 - build using Gulp
Boiler plate application to develop REST API using Node JS, Express, mongoose and ES6.

Installation
============

1. Atom Editor
2. Download and install node js from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).
3. Install node-inspector(npm install -g node-inspector)

Set Up
======

1. Check out project.
2. Run npm install
3. Run npm start
4. Launch http://localhost:8080/health-check

Features
========

To ensure code standards this application is using JSHINT.

You can use JSCS and ESLINT also by adding additional tasks in gulpfile.

The build tool is developed in such a way whenever you do any code modifications, your code will automatically build and deployed into your development server. You no need to manually restart the server. This is done using Nodemon.

All the mongoose functions are Promisifyied using blubird.
