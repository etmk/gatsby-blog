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

<span style="color: red;">*프로젝트를 시작하기 전에 어떤 환경에서 어떤 구조로 빌드 할지 결정했다.*</span>

> **Eslint** 
>
> *Airbnb standard && Ecma script* 버전을 2018 년으로 세팅했다.
>
> **Directory structure**
>
> - *Library, Service, Model, Route* 총 4가지로 나누었다.
> - Route 는 크게 `oauth` 및 `api` 로 나누었다.
>
> **Logging**
>
> Logging 을 체계적이고 논리적으로 하는것을 중요하게 생각했다. 단순히 개발할 때 콘솔에서 테스트용으로 확인하는것에 그치지 않고 추후 *production 레벨에서 서버에서 발생하는 이슈들을 파일로* 기록해야 한다고 생각 했기에 신경을 더 쓰고싶었다.

<span style="color: red;">*어떤 기술스택으로 프로젝트를 구현을 할 지 미리 팀원들과 결정했다.*</span>

> **MongoDB && Mongoose**
>
> MongoDB 는 마치 데이터들을 종이에 적어서 보관하는것 처럼 자유도가 엄청 높아서 DB schema 에 field 를 추가하거나 수정하기가 용이했다. 개발한 서비스에서 필요한 데이터들의 관계가 복잡하지 않았으며 사용자가 정말 원하는 태그가 어떤것인지에 대한 고민에 따라 태그를 조금씩 수정하기도 했었기 때문에 mongoDB 가 성격에 잘 맞았다. Compass 및 mongoose library 등 익숙한 스택이기 때문에 구현에 더 자신이 있었다.
>
> **JsonWebToken**
>
> 토큰기반 인증시스템을 제대로 구현해보고 싶은 욕심도 있었으며 모바일 어플리케이션에서 더 잘 구현될 수 있다고 생각하고 결정했다.

<span style="color: red;">*어떤 middleware 및 module 을 사용할 지 미리 결정했다.*</span>

> **Morgan**
>
> 특정 메소드의 엔드포인트에서 들어온 요청이 응답되기 까지 시간이 얼마나 소요됐으며 어떤 status code 로 응답이 되었는지 까지 친절하게 보여주는 모듈로 필수적이라고 생각했다.
>
> **Helmet**
>
> 요청이 서버로 도착을 했고 다른 미들웨어로 접근하기 전에 많은 보안적인 이슈를 해결해주고 다양한 기능을 수행하는 모듈로 없어선 안될 모듈 중 하나라고 생각했다. [링크](https://www.npmjs.com/package/helmet)

## # Configuration

<span style="color: red;">*`dotenv` 모듈을 사용하여 외부에 노출되면 민감할 수 있는 정보들은 따로 관리하였다.*</span>

> 프로젝트 루트 디렉토리에서 `.env` 파일에 민감할 수 있는 정보를 `KEY=value` 형태로 저장한 뒤 실제 코드에서는 `process.env.KEY` 라는 변수 이름으로 호출해서 사용하여 코드에 직접 정보를 노출시키지 않도록 하였다.

<span style="color: red;">*`configure.js` 파일에서 여러 환경설정을 하였다.*</span>

> Database 에 대한 세팅들 및 `log4js` 에 관한 로깅 세팅들을 모아두고 관리하였으며 필요한 부분에서 `export` 해서  사용했다.

## # Route 분리

<span style="color: red;">*가장 큰 로직 2가지로 분기한 뒤 각각 기능 및 리소스에 따라서 또 여러번 분기하여 routing 하였다.*</span>

> `api` 및 `oauth` 라우트로 분리하고 모든 리소스에 관한 요청은 `api` 로, 인증에 관한 요청은 `oauth` 로 분리하였다. 내부적으로도 각 모델별로 `cafe`, `user` 등으로 라우트 분기 하였으며 `index.js` 파일과 `controller.js` 파일을 따로 만들어 관리하였다.

## # Token 기반 인증 시스템

Refresh token 과 access token 둘 다 '잘' 사용하는 인증 시스템을 만들기 위한 고민을 많이 하였다.

<span style="color: red;">*Refresh token 을 어디에 저장을 할 것인가?*</span>

> Refresh token 으로 access token 을 발급받기 때문에 아무리 refresh token 에 유효기간이 정해져 있다고 해도 만약 탈취당할 시 그 기간동안 자유롭게 사용당할 수 있다는 우려가 있었다. Google 에서 많은 검색을 해보았지만 어디에서도 refresh token 에 대한 구체적인 구현방법이나 reference 를 찾을 수 없었다. 모두 'Somewhere safe' 에 보관하라는 말 뿐이었다. 같이 프로젝트를 진행했던 팀원이 모바일 앱에는 안전한 보관장소가 있다는 사실을 알았고 바로 *Key chain* 이었다. 그러나 key chain 에는 아이디와 비밀번호 한쌍만 저장할 수 있었기 때문에 아이디에 Refresh token 을 저장하였고 비밀번호에 사용자 아이디 및 비밀번호를 저장하는데 사용하였다.
>
> 사실 디바이스의 async storage 및 브라우저의 local storage 등도 이미 브라우저 및 OS 의 보호를 받고 있기 때문에 해당 장소에 저장해도 큰 이슈가 발생하지 않을것이다.

<span style="color: red;">*Token flow 를 어떻게 구현할 것인가?*</span>

> *Access token 을 모든 리소스요청에 담아서 보낸다. Access token 이 만료되면 refresh token 을 통해서 access token 을 재발급 받는다.* 여기까지는 확정이었으나 로그인 시 발생하는 토큰의 흐름, 사용중에 토큰문제 때문에 끊기지 않는 어플리케이션 구현 등등을 여러가지를 고민했어야 했다. 
>
> **시도 1** : 처음에는 access token 이 리소스 요청 중 만료되면 서버는 `401` 을 보내고 클라이언트는 다시 access token 재발급 요청을 보낸 뒤 발급받은 access token 으로 다시 이전 요청을 보내도록 구현을 하려고 하였다. 너무 복잡한 로직이 요구 됐으며 효율적이라고 생각되지 않아서 다시 고민하기로 했다.
>
> **시도 2** : Access token 으로 리소스에 접근할 때 마다 새로운 access token 을 발급하여 리소스에 접근하는 한 계속 만료시간을 늘리도록 하는 로직을 생각해보았다. 그래서 모든 요청에 refresh token 과 access token 을 함께 보내도록 하였다. 그러나 결국 access token 을 새로 발급받는 시점에 refresh token 이 만료되면 어플리케이션 흐름이 중간에 끊기고 refresh token 의 재발급을 위해 로그인 요청까지 보내야 하는 상황이 발생하였다.
>
> **해결책** : Where's my cup 이라는 서비스는 게임이나 영상 streaming 과 같은 긴 시간동안 사용자가 사용할 만한 서비스를 제공하지 않기 때문에 최대 이용시간이 3시간을 넘기지 않는다고 생각하였다. 때문에 access token 의 만료시간 역시 3시간으로 설정하고 사용자가 앱을 active 하는 순간마다 3시간의 만료기간을 갖는 access token 을 발급해주기로 했다. 이 때 refresh token 이 만료됐을 시 key chain 에 저장된 아이디 및 패스워드로 access 및 refresh token 을 발급 받는다. 앱이 inactive 및 background 상태에 돌입하고 돌아올 때 마다 access token 발급 요청을 매번 보내는 건 부담스러울 수 있다고 판단하여 클라이언트에서 inactive 및 background 돌입 시점을 state 로 기억하여 active 상태로 돌아올 때 마다 시간을 계산하여 1시간 이상이 지나지 않았으면 token 을 발급받지 않도록 구현을 하였다. 그렇게 access 및 refresh token 을 발급받는 모든 시점을 앱을 시작하는 시점으로 하여 사용중 끊기지 않고 요청도 복잡하게 보내지 않는 토큰기반 인증시스템을 구현할 수 있었다.