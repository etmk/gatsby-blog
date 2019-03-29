---
title: "[3/4] Where is my cup 서버 사이드 개발기"
date: "2019-02-16"
draft: false
path: "/dev/where-is-my-cup-sprint-3"
category: "dev"
tags: ["collaborative-filtering", "mongoose", "no-sql"]
project: "where-is-my-cup"
---

## # Collaborative Filtering

Collaborative filtering 머신러닝에서 기초가 되면서 가장 많이 쓰이기도 하는 기법이다. 짧은 예시로 A 와 B 를 동시에 구매하는 사람들을 공통점으로 C 라는 물건을 산다는 결과가 나왔다면 다른 A 와 B 를 구매하는 사람에게 C 를 추천해주는 방식이다. Node.js 에서 지원하는 module 인  `ger` 를 사용하기로 하였으며 이 중에서 User based recommendation 으로 연관성 검사를 진행하였다.

<br />

<span style="color: red;">*User based recommendation 으로 사용자와 가장 성향이 비슷한 사람 및 추천 아이템을 탐색*</span>

User based recommendation 으로 반환되는 값은 총 두가지가 있다. 첫째로는 가장 연관성이 깊고 성향이 비슷한 사람들인 *Neighbor* 들이 있으며 둘째로는 *Recommendations* 로 추천되는 아이템들이 있다. 

제작한 서비스는 태그기반 카페 추천 시스템이기에 찾은 Neighbor 들이 좋아하는 카페들을 찾아서 사용자에게 추천을 해주는 로직을 구현하였다.

<br />

<span style="color: red;">*추천된 아이템과 사용자 성향을 통해 사용자와 연관성이 깊은 카페를 탐색*</span>

추천이된 아이템들 중 가장 *Weight (연관성)* 가 높은 태그(아이템) 와  함께 사용자가 이미 가장 선호하는 태그로 해당 태그들과 가장 성향이 비슷하고 연관성이 비슷한 카페들을 주변 200m 범위에서 찾는다. 

그렇게 나온 카페 목록에서 이미 Neighbor 들을 통해서 추천이 된 카페와 weight 가 일정 기준이상이 아닌 카페를 제외하고 사용자에게 추천을 하는 로직을 구현하여 총 2가지 방법으로 사용자에게 추천하도록 추천시스템을 빌드하였다.

<br />
<br />

## # Mongoose

Node.js 에서 MongoDB 와 연결하여 쉽게 데이터를 읽고 쓰게 해주는 모듈이다. MongoDB 와 node.js 를 함께 사용하는 사람들은 거의 대부분 mongoose 를 사용한다고 생각하면 될 정도라고 알고있고 MongoDB 에는 존재하지 않는 schema 의 개념 등도 지원해줘서 함께 사용하기 아주 좋은 모듈이다.

<br />

<span style="color: red;">*`$set` operator 의 사용법*</span>

Document 의 field 의 값을 변경하기 위한 용도로만 사용하였었다.

```
User.findByIdAndUpdate( id, { $set:{ password: newPassword } } );
```

만약 field 가 Object 타입이고 그 field 의 property 로 값을 할당하고 싶을 때는 어떻게 해야할지 고민을 했다. 처음에는 변경하고 싶은 field 를 가지고 있는 document 를 불러와서 해당 field 의 property 를 변경하고 다시 update 하는 방식으로 했었다. 이 방법은 Database 에 2번 트래픽을 발생시켰는데 1번에 해결할 수 있는 방법이 있을것 같았다.

그래서 생각한 방법이 `$set` operator 를 사용해보는 것이었는데 아래와 같은 문법이 가능하였다.

```
User.findByIdAndUpdate( id, { $set:{ `hasFeedbacked.${cafeId}`: timestamp } } );
```

이렇게 사용자가 특정 카페에 피드백을 남기면 `hasFeedbacked` 라는 object 에 property key 값으로 카페의 id, value 값으로 피드백을 남긴 시간을 세팅할 수 있었다.

<br />

<span style="color: red;">*`$push` operator 의 사용법*</span>

기존에는 배열타입의 field 에 push 하는 방법을 알지 못해서 항상 find 한 document 의 field 에 push 하고 update 를 시켰었다. 이렇게 2번의 Database 로의 트래픽을 1번으로 줄이고 싶어서 분명히 push 로 해결할 수 있는 방법이 있을거라는 생각에 검색을 통해서 아래와 같은 방법을 알게 되었다.

```
User.findByIdAndUpdate( id, { $push:{ favorites: cafeId } } );
```

<br />

<span style="color: red;">*`ObjectId` 타입 때문에 발생한 이슈*</span>

사용자 요청으로 받은 Document 의 id 값과 Model 을 통해서 DB 에서 꺼낸 id 값을 비교할 일이 빈번하게 발생했다. 단순하게 `===` 연산자를 통해서 equality 가 성립하지 않는다는 이슈를 테스트 과정중에서 발견하게 되었고 사용자 input 으로 받은 모든 id 를 `ObjectId` 타입으로 전환하여 비교해보았으나 여전히 일치하지 않았다.

`ObjectId` 타입 자체가 하나의 `Object` 타입이었으며 이는 reference 타입으로 같은 주소값을 가지지 않으면 내부의 모든 값이 같더라도 일치하지 않는 형식이었음을 깨닫고 Model 에서 꺼낸 모든 id 값을 `toString` 함수로 `String` 타입으로 바꾼 다음에 비교를 해서야 이슈를 해결할 수 있었다.