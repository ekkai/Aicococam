# Ai코코캠(Aicococam)

코코캠은 AI 비전 센서 기능을 통해 다양한 AI프로젝트를 제작하는데 활용할 수 있고, 온라인 교육 및 화상회의용 웹캠으로도 사용하실 수 있습니다.

코코캠은 얼굴 인식, 마스크 인식, 사물 인식, 사물 추적, 컬러인식, 라인 추적, 모델 학습, 태그 인식, 숫자 인식 기능을 사용할 수 있습니다.

cococam can be used to create various AI projects through the AI Vision Sensor function, and can also be used as a webcam for online education and video conferencing.
cococam can use face recognition, mask recognition, object recognition, object tracking, color recognition, line tracking, model learning, tag recognition, and number recognition functions.


## ~ hint
아래 링크를 통해 코코캠에 대한 자세한 정보를 볼 수 있습니다.

You can find more information about cococam through the link below.

→ [Ai코코캠 제품 살펴보기](https://kocoafab.cc/product/aicococam)

## ~

## 기본 사용법(Basic usage)

```blocks
    Aicococam.initI2c()
    Aicococam.initMode(protocolAlgorithm.ALGORITHM_FACE_RECOGNITION)
```

* 코코캠은 ``||I2C통신||`` 을 사용해 Makecode와 통신합니다.
* Coco Cam communicates with Makecode using ``||I2C Communication||``
　
 

* ``||모드 설정||`` 을 통해 코코캠의 모드를 블록으로 변경할 수 있습니다.
* You can change the mode of the cococam using block on makecode



```blocks
    serial.redirectToUSB()
    Aicococam.initI2c()
    Aicococam.initMode(protocolAlgorithm.ALGORITHM_FACE_RECOGNITION)
```
* 코코캠은 ``||시리얼통신||`` 을 사용해 컴퓨터에 결과를 전달할 수 있습니다.
* cococam can use ``||Serial Communication||`` to deliver results to the computer.


```blocks
    basic.forever(function () {
        Aicococam.request()
        if (Aicococam.isLearned(1)) {
            serial.writeString("1")
        } else {
            serial.writeString("2")
        }
    })
```
* ID1이 검출되면 컴퓨터로 "1"을 전달하고 검출되지 않았다면 "2"를 전달합니다.
* If ID1 is detected, deliver "1" to the computer and "2" if not detected.


## 지원제품(Supported targets)

* for PXT/microbit

## 라이선스(License)

MIT

## 제품 문의(product Inquiries) 

제품에 관한 문의는 ``||02-3470-2829||`` 또는 [minierz@kocoa.or.kr](mailto:minierz@kocoa.or.kr)를 통해 문의 부탁드립니다.

For product inquiries, please contact `|02-3470-2829||` or [minierz@kocoa.or.kr] (mail to: minierz@kocoa.or.kr).
　

코코아팹 공식 스토어 바로가기 → [코코아팹 스마트 스토어](https://smartstore.naver.com/kocoafab)

Go to the official store of kocoafab



> 이 페이지를 [https://ekkai.github.io/aicococam/](https://ekkai.github.io/aicococam/)으로 열기

## 확장으로 사용

이 저장소는 MakeCode에서 **확장**으로 추가될 수 있습니다.

* [https://makecode.microbit.org/](https://makecode.microbit.org/) 열기
* **새로운 프로젝트**에서 클릭
* 톱니바퀴 모양 메뉴에서 **확장**을 클릭합니다
* **https://github.com/ekkai/aicococam**으로 검색하고 가져오기

## 이 프로젝트 편집 ![상태 배지 빌드](https://github.com/ekkai/aicococam/workflows/MakeCode/badge.svg)

MakeCode에서 이 저장소를 편집합니다.

* [https://makecode.microbit.org/](https://makecode.microbit.org/) 열기
* **가져오기**를 클릭한 다음 **가져오기 URL**를 클릭합니다
* **https://github.com/ekkai/aicococam**를 붙여넣고 가져오기를 클릭하세요.

## 블록 미리보기

이 이미지는 마스터의 지난 확정에서 블록 코드를 보여줍니다.
이 이미지는 다시 읽어오는데 몇 분 정도 걸립니다.

![블록 렌더링 보기](https://github.com/ekkai/aicococam/raw/master/.github/makecode/blocks.png)

#### 메타데이터(검색, 렌더링에 사용)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
