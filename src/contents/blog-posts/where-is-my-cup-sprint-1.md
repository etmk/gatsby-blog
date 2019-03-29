---
title: "[1/4] Where is my cup 서버 사이드 개발기"
date: "2019-02-09"
draft: false
path: "/dev/where-is-my-cup-sprint-1"
category: "dev"
tags: ["eslint", "mongo-db", "jwt"]
project: "where-is-my-cup"
---

## # Before get started

<br />

<span style="color: red;">*프로젝트를 시작하기 전에 어떤 환경에서 어떤 구조로 빌드 할지 결정했다.*</span>

**Eslint** : *Airbnb standard && Ecma script* 버전을 2018 년으로 세팅했다.

**Structure** : Directory 는 *Library, Service, Model, Route* 총 4가지로 나누었고 Route 는 크게 <span style="text-decoration: line-through;">`oauth`</span> 및 `api` 로 나누었다.
> <span style="color: #aaa">*나중에 알게 된 사실로 OAuth 2.0 표준에 따르면 인증 관련 서버는 따로 관리한다고 한다.*</span>

**Logging** : 체계적이고 논리적으로 하는것을 중요하게 생각했다. 단순히 개발할 때 콘솔에서 테스트용으로 확인하는것에 그치지 않고 추후 *production 레벨에서 서버에서 발생하는 이슈들을 파일로* 기록해야 한다고 생각 했기에 신경을 더 쓰고싶었다.

<br />

<span style="color: red;">*어떤 기술스택으로 프로젝트를 구현을 할 지 미리 팀원들과 결정했다.*</span>

**MongoDB && Mongoose** : MongoDB 는 마치 데이터들을 종이에 적어서 보관하는것 처럼 자유도가 엄청 높아서 DB schema 에 field 를 추가하거나 수정하기가 용이했다. 개발한 서비스에서 필요한 데이터들의 관계가 복잡하지 않았으며 사용자가 정말 원하는 태그가 어떤것인지에 대한 고민에 따라 태그를 조금씩 수정하기도 했었기 때문에 mongoDB 가 성격에 잘 맞았다. Compass 및 mongoose library 등 익숙한 스택이기 때문에 구현에 더 자신이 있었다.

**JsonWebToken** : 토큰기반 인증시스템을 제대로 구현해보고 싶은 욕심도 있었으며 모바일 어플리케이션에서 더 잘 구현될 수 있다고 생각하고 결정했다.

<br />

<span style="color: red;">*어떤 middleware 및 module 을 사용할 지 미리 결정했다.*</span>

**Morgan** : 특정 메소드의 엔드포인트에서 들어온 요청이 응답되기 까지 시간이 얼마나 소요됐으며 어떤 status code 로 응답이 되었는지 까지 친절하게 보여주는 모듈로 필수적이라고 생각했다.

[**Helmet**](https://www.npmjs.com/package/helmet) : 요청이 서버로 도착을 했고 다른 미들웨어로 접근하기 전에 많은 보안적인 이슈를 해결해주고 다양한 기능을 수행하는 모듈로 없어선 안될 모듈 중 하나라고 생각했다.

<br />
<br />

## # Configuration

<br />

<span style="color: red;">*`dotenv` 모듈을 사용하여 외부에 노출되면 민감할 수 있는 정보들은 따로 관리하였다.*</span>

프로젝트 루트 디렉토리에서 `.env` 파일에 민감할 수 있는 정보를 `KEY=value` 형태로 저장한 뒤 실제 코드에서는 `process.env.KEY` 라는 변수 이름으로 호출해서 사용하여 코드에 직접 정보를 노출시키지 않도록 하였다.

<br />

<span style="color: red;">*`configure.js` 파일에서 여러 환경설정을 하였다.*</span>

Database 에 대한 세팅들 및 `log4js` 에 관한 로깅 세팅들을 모아두고 관리하였으며 필요한 부분에서 `export` 해서  사용했다.

<br />
<br />

## # Route 분리

<br />

<span style="color: red;">*가장 큰 로직 2가지로 분기한 뒤 각각 기능 및 리소스에 따라서 또 여러번 분기하여 routing 하였다.*</span>

`api` 및 `oauth` 라우트로 분리하고 모든 리소스에 관한 요청은 `api` 로, 인증에 관한 요청은 `oauth` 로 분리하였다. 내부적으로도 각 모델별로 `cafe`, `user` 등으로 라우트 분기 하였으며 `index.js` 파일과 `controller.js` 파일을 따로 만들어 관리하였다.