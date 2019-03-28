---
title: "[4/4] Where is my cup 서버 사이드 개발기"
date: "2019-02-20"
draft: false
path: "/dev/where-is-my-cup-sprint-4"
category: "dev"
tags: ["aws", "ELB", "EC2", "ACM"]
project: "where-is-my-cup"
---

## # Apply SSL on EC2 instance

기존에는 EC2 instance 에 SSL 을 하나씩 씌우는 방법을 선택했어야 했다. 이렇게 되면 각 instance 마다 SSL 이 개별적으로 적용이 되어야 해서 만료일도 다 다르고 하나씩 관리하기도 어렵다. 인스타그램이 SSL 만료기간에 갱신을 잘 하지 못해서 접속이 안됐었던 적이 있었다. 이런 문제를 해결하기 위해 ACM(Amazon Certificate Manager) 이 나왔다. ACM 을 통해 발급받은 SSL 을 ELB 에 씌우고 ELB 에 EC2 instance 를 등록하면서 해당 ELB 에 추가된 EC2 는 모두 통합적으로 SSL 이 적용이 될 수 있게 되었다.

<span style="color: red;">*ELB 및 EC2 Instance 의 Security group 적용*</span>

> SSL 이 적용된 ELB 그룹으로 들어오는 통신은 HTTPS 프로토콜이며 ELB 가 각 instance 에게 전달하는 통신은 HTTP 프로토콜이다. 이 flow 에 맞게 ELB 의 Security group 에는 Inbound 로 HTTPS 만 허락하도록 설정한다. ELB 에 리스너를 설정해줘야 하는데 이는 ELB 가 받은 통신을 instance 로 전달하는 방법에 대한 부분이다. HTTPS 로 받은 요청을 instance 에 HTTP 요청으로 다시 전달을 해줘야 하는데 이 때 `instance port` 에는 반드시 instance 에서 inbound 로 받기로 한 포트를 입력해줘야 한다. 그렇게 아래와 같은 흐름이 완성된다.
>
> ```
> [Client]     --HTTPS-->     [ELB]     --HTTP-->     [EC2 server]
>              [443 PORT]             [Server PORT]
> ```

<span style="color: red;">*구체적으로 적용하는 방법에 대해서는 다음 링크를 참조해보자 : [링크](https://github.com/Sunjae-Kim/TIL/blob/master/aws/apply-ssl-on-ec2.md)*</span>