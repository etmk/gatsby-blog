---
title: "[4/4] Where is my cup 서버 사이드 개발기 - HTTPS 적용과 JWT 인증"
date: "2019-02-20"
draft: false
path: "/dev/where-is-my-cup-sprint-4"
category: "dev"
tags: ["aws", "ELB", "EC2", "ACM"]
project: "where-is-my-cup"
---

## # Apply SSL on EC2 instance

기존에는 EC2 instance 에 SSL 을 하나씩 씌우는 방법을 선택했어야 했다. 이렇게 되면 각 instance 마다 SSL 이 개별적으로 적용이 되어야 해서 만료일도 다 다르고 하나씩 관리하기도 어렵다. 인스타그램이 SSL 만료기간에 갱신을 잘 하지 못해서 접속이 안됐었던 적이 있었다. 이런 문제를 해결하기 위해 ACM(Amazon Certificate Manager) 이 나왔다. ACM 을 통해 발급받은 SSL 을 ELB 에 씌우고 ELB 에 EC2 instance 를 등록하면서 해당 ELB 에 추가된 EC2 는 모두 통합적으로 SSL 이 적용이 될 수 있게 되었다.

<br />

<span style="color: red;">*ELB 및 EC2 Instance 의 Security group 적용*</span>

SSL 이 적용된 ELB 그룹으로 들어오는 통신은 HTTPS 프로토콜이며 ELB 가 각 instance 에게 전달하는 통신은 HTTP 프로토콜이다. 이 flow 에 맞게 ELB 의 Security group 에는 Inbound 로 HTTPS 만 허락하도록 설정한다. ELB 에 리스너를 설정해줘야 하는데 이는 ELB 가 받은 통신을 instance 로 전달하는 방법에 대한 부분이다. HTTPS 로 받은 요청을 instance 에 HTTP 요청으로 다시 전달을 해줘야 하는데 이 때 `instance port` 에는 반드시 instance 에서 inbound 로 받기로 한 포트를 입력해줘야 한다. 그렇게 아래와 같은 흐름이 완성된다.

```text
[Client]     --HTTPS-->     [ELB]     --HTTP-->     [EC2 server]
             [443 PORT]             [Server PORT]
```

<br />

<span style="color: red;">*구체적으로 적용하는 방법에 대해서는 다음 링크를 참조해보자 : [링크](https://github.com/Sunjae-Kim/TIL/blob/master/aws/apply-ssl-on-ec2.md)*</span>

<br />
<br />

## # Token 기반 인증 시스템

Refresh token 과 access token 둘 다 '잘' 사용하는 인증 시스템을 만들기 위한 고민을 많이 하였다.

<br />

<span style="color: red;">*Refresh token 을 어디에 저장을 할 것인가?*</span>

Refresh token 으로 access token 을 발급받기 때문에 아무리 refresh token 에 유효기간이 정해져 있다고 해도 만약 탈취당할 시 그 기간동안 자유롭게 사용당할 수 있다는 우려가 있었다. Google 에서 많은 검색을 해보았지만 어디에서도 refresh token 에 대한 구체적인 구현방법이나 reference 를 찾을 수 없었다. 모두 'Somewhere safe' 에 보관하라는 말 뿐이었다. 같이 프로젝트를 진행했던 팀원이 모바일 앱에는 안전한 보관장소가 있다는 사실을 알았고 바로 *Key chain* 이었다. 그러나 key chain 에는 아이디와 비밀번호 한쌍만 저장할 수 있었기 때문에 아이디에 Refresh token 을 저장하였고 비밀번호에 사용자 아이디 및 비밀번호를 저장하는데 사용하였다.

사실 디바이스의 async storage 및 브라우저의 local storage 등도 이미 브라우저 및 OS 의 보호를 받고 있기 때문에 해당 장소에 저장해도 큰 이슈가 발생하지 않을것이다.

<br />

<span style="color: red;">*Token flow 를 어떻게 구현할 것인가?*</span>

*Access token 을 모든 리소스요청에 담아서 보낸다. Access token 이 만료되면 refresh token 을 통해서 access token 을 재발급 받는다.* 여기까지는 확정이었으나 로그인 시 발생하는 토큰의 흐름, 사용중에 토큰문제 때문에 끊기지 않는 어플리케이션 구현 등등을 여러가지를 고민했어야 했다. 

<br />

**시도 1** : 처음에는 access token 이 리소스 요청 중 만료되면 서버는 `401` 을 보내고 클라이언트는 다시 access token 재발급 요청을 보낸 뒤 발급받은 access token 으로 다시 이전 요청을 보내도록 구현을 하려고 하였다. 너무 복잡한 로직이 요구 됐으며 효율적이라고 생각되지 않아서 다시 고민하기로 했다.

<br />

**시도 2** : Access token 으로 리소스에 접근할 때 마다 새로운 access token 을 발급하여 리소스에 접근하는 한 계속 만료시간을 늘리도록 하는 로직을 생각해보았다. 그래서 모든 요청에 refresh token 과 access token 을 함께 보내도록 하였다. 그러나 결국 access token 을 새로 발급받는 시점에 refresh token 이 만료되면 어플리케이션 흐름이 중간에 끊기고 refresh token 의 재발급을 위해 로그인 요청까지 보내야 하는 상황이 발생하였다.

<br />

**최종** : Where's my cup 이라는 서비스는 게임이나 영상 streaming 과 같은 긴 시간동안 사용자가 사용할 만한 서비스를 제공하지 않기 때문에 최대 이용시간이 3시간을 넘기지 않는다고 생각하였다. 때문에 access token 의 만료시간 역시 3시간으로 설정하고 사용자가 앱을 active 하는 순간마다 3시간의 만료기간을 갖는 access token 을 발급해주기로 했다. 이 때 refresh token 이 만료됐을 시 key chain 에 저장된 아이디 및 패스워드로 access 및 refresh token 을 발급 받는다. 앱이 inactive 및 background 상태에 돌입하고 돌아올 때 마다 access token 발급 요청을 매번 보내는 건 부담스러울 수 있다고 판단하여 클라이언트에서 inactive 및 background 돌입 시점을 state 로 기억하여 active 상태로 돌아올 때 마다 시간을 계산하여 1시간 이상이 지나지 않았으면 token 을 발급받지 않도록 구현을 하였다. 그렇게 access 및 refresh token 을 발급받는 모든 시점을 앱을 시작하는 시점으로 하여 사용중 끊기지 않고 요청도 복잡하게 보내지 않는 토큰기반 인증시스템을 구현할 수 있었다.