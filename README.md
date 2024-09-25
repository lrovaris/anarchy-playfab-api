
<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">An advanced microservice built with the <a href="http://nodejs.org" target="_blank">NestJS</a> framework, designed to handle data communication between a <a href="https://godotengine.org/" target="_blank">Godot Engine</a> game and Microsoft's PlayFab service.</p>
  
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
</p>

## 🚀 Anarchy PlayFab API

Anarchy PlayFab API is a microservice designed to handle real-time data communication between a **Godot Engine** game and Microsoft's **PlayFab** backend service. Developed using the **NestJS** framework, this project implements high-performance, scalable backend solutions tailored for game data management.

## ✨ Features

- **Seamless Integration**: Built with NestJS, integrating with the Godot game engine to handle player data.
- **PlayFab Management**: Manages player profiles, leaderboards, and statistics stored in Microsoft's PlayFab service.
- **Microservice Architecture**: Designed for scalability and performance to meet high-traffic gaming environments.
- **Secure Data Handling**: Ensures secure communication and data management between the game and PlayFab.

## 🛠️ Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **PlayFab**: Managed Microsoft's PlayFab service to store and handle player data securely.
- **Godot Engine**: Integrated the API to interact with a game built on the Godot Engine.
- **TypeScript**: Typed language for building robust applications.
- **Microservices**: Architecture designed for performance and scalability.

## 📖 Project Overview

This project was developed for a client named **PixelrogueArt**, who required a robust solution for managing game data using Microsoft's PlayFab service. It involved:

- Creating an API to interact with the **Godot Engine** game.
- Utilizing **NestJS** for its powerful features, including module-based architecture, dependency injection, and integrated TypeScript support.
- Implementing PlayFab's REST API to manage player data, leaderboards, and in-game events efficiently.

## ⚡ Quick Start

### Installation

```bash
$ npm install
```

### Running the Microservice

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 🧩 Integrating with Godot

This microservice acts as a backend for a **Godot Engine** game. It provides REST endpoints to handle data operations for players, such as profile management, inventory updates, and leaderboard interactions. The integration allows for seamless synchronization between the game and PlayFab's cloud services.

## 💡 What I Learned

Working on this project enhanced my expertise in:

- **NestJS**: Leveraged the power of NestJS for building scalable microservices.
- **API Integration**: Deepened my skills in integrating third-party services like **PlayFab** into gaming applications.
- **Secure Data Management**: Implemented secure data transfer protocols between the game client and backend services.
- **Performance Optimization**: Applied performance tuning techniques to handle high-volume game data transactions efficiently.

## 🤝 Contact & Support

For more information or collaboration opportunities, feel free to contact me:

- **Email**: luis.gabrielrovaris@gmail.com
- **LinkedIn**: [linkedin.com/in/luisrovaris](https://www.linkedin.com/in/luisrovaris)

---

## 📝 License

This project is [MIT licensed](LICENSE).
