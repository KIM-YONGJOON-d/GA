// 고유한 코드 생성 함수
function generateUniqueCode() {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomNum}`;
}
// 설문조사 양식 제출 시 실행되는 함수
document.getElementById("surveyForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        "code": generateUniqueCode(),
        "name": formData.get("name"),
        "phone": formData.get("phone")
    };

    try {
        const response = await sendDataToLambda(data);
        console.log("Lambda Response:", response);

        if (response.status === 200) {
            console.log('Data added successfully');
            console.log('Sent data:', data);

            // 페이지 새로고침
            setTimeout(function () {
                location.reload();
            }, 200);
        } else {
            console.error('Failed to add data');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    saveDataToDynamoDB(data, function () {
        console.log('Data saved to DynamoDB');
        handleSurveyResults(data);
        // 처리 완료 후 UI 업데이트 등 추가 작업 수행
    });

    const nameInput = document.getElementById("nameInput");
    const phoneInput = document.getElementById("phoneInput");
    nameInput.value = "";
    phoneInput.value = "";
});

// Lambda 함수에 데이터를 보내는 함수
async function sendDataToLambda(data) {
    const apiGatewayUrl = "https://8onfc4i91a.execute-api.ap-northeast-2.amazonaws.com/dev";
    const response = await fetch(apiGatewayUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            body: JSON.stringify(data),  // 데이터를 JSON 형식으로 변환하여 보냄
            httpMethod: "POST"
        })
    });
    return response;
}

// DynamoDB에 데이터를 저장하는 함수
function saveDataToDynamoDB(data, callback) {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: 'team7',
        Item: data
    };

    docClient.put(params, function (err, data) {
        if (err) {
            console.error('DynamoDB 저장 실패:', err);
        } else {
            console.log('DynamoDB에 데이터 저장 성공:', data);
            handleSurveyResults(data);
            callback();
        }
    });
}
// 로딩 화면 표시 함수
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'flex';
}

// 로딩 화면 숨기기 함수
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';
}

// 데이터 로딩 시작 시 로딩 화면 표시
showLoadingScreen();

// 서버에서 데이터 가져와서 화면에 표시
function fetchAndDisplayData() {
    fetch('https://9vod8uhybl.execute-api.us-east-2.amazonaws.com/dev/')
    .then(response => response.json())
    .then(data => {
        hideLoadingScreen();
        var valuesList = document.getElementById("valuesList");

        var jsonData = JSON.parse(data.body);

        // 기존 목록 아이템 삭제
        valuesList.innerHTML = "";

        updateCustomerCount(jsonData.length);

    
        jsonData.forEach(customer => {
                    var listItem = document.createElement("li");
                    var imgElement = document.createElement("img");
                    var name = customer["name"];
                    var phone = customer["phone"];
                    
                    // 이미지 설정
                    imgElement.src = "https://test7team.s3.ap-northeast-2.amazonaws.com/dcamapp/image/user.jpg";
                    imgElement.style.width = "40px";
                    imgElement.style.height = "40px";
                    imgElement.style.borderRadius = "50%";
                    listItem.appendChild(imgElement);
                    var customerElement = document.createElement("div");
                    var nameElement = document.createElement("span");
                    nameElement.textContent = customer.name;
                    nameElement.style.fontWeight = "bold"; // 진하게 설정
                    nameElement.style.fontSize = "1.1em"; // 크기 설정
                    nameElement.style.cursor = "pointer";
                    nameElement.style.marginTop = "-15px"; // 이름을 더 위로 이동
                    nameElement.style.color = "black"; // 검은색으로 변경
                    // 클릭 시 상세 페이지로 이동
                    listItem.addEventListener("click", function (event) {
                        event.stopPropagation();
                        window.location.href = `https://test7team.s3.ap-northeast-2.amazonaws.com/dcamapp/detail.html?code=${encodeURIComponent(customer.code)}`;
                    });
                    customerElement.appendChild(nameElement);
                    var phoneElement = document.createElement("span");
                    phoneElement.textContent = customer.phone;
                    phoneElement.style.marginTop = "10px"; // 전화번호를 남쪽으로 이동
                    phoneElement.style.marginLeft = "2px"; // 전화번호를 우측으로 이동
                    customerElement.appendChild(phoneElement);
                    listItem.appendChild(customerElement);
                    
                    
                    var button = document.createElement("button");
                    var link = document.createElement("a");
                    link.href = "javascript:void(0)"; // 클릭 시 동작을 실행할 함수를 호출하기 위해 "javascript:void(0)"로 설정
                    link.textContent = "발송";
                    link.style.zIndex = "1";
                    button.style.position="absolute";
                    button.style.top ="0"
                    button.style.right ="0"
                    button.style.margin="5px"
                    link.style.textDecoration ="none";
                    button.appendChild(link);
                    button.className = "btnSend"; // 버튼 스타일링을 위한 클래스 추가
                    
                    // 발송 버튼 클릭 시 이벤트 처리
                    button.addEventListener("click", function (event) {
                        event.stopPropagation();
                        showSendOptions(customer.phone, customer.code);
                    });
                    customerElement.appendChild(button);
                    valuesList.appendChild(listItem);
                });
                // 발송 옵션 표시 함수
                function showSendOptions(phone, code) {
                    var option = prompt("보낼 메시지 종류를 선택하세요:\n1. 암보험\n2. 자동차보험\n3. 치아보험\n4. 여행자보험\n5. 사망보험\n6. 자녀보험");
                    switch (option) {
                        case "1":
                            sendDefaultMessageCancer(phone, code);;
                            break;
                        case "2":
                            sendDefaultMessageCar(phone, code);
                            break;
                        case "3":
                            sendDefaultMessageTeeth(phone, code);
                            break;
                        case "4":
                            sendDefaultMessageTrip(phone, code);
                            break;
                        case "5":
                            sendDefaultMessageDeath(phone, code);
                            break;
                        case "6":
                            sendDefaultMessageChild(phone, code);
                            break;
                        default:
                            alert("올바른 종류를 선택해주세요.");
                            break;
                    }
                }

                function sendDefaultMessageCancer(destination, uniqueCode) {
                    var sBody =
                        "안녕하세요.\n" +
                        "Eulji-app입니다.\n" +
                        "설문조사에 참여해주시면 감사하겠습니다.\n" +
                        "고유 코드: " + uniqueCode + "\n" +
                        "코드를 복사, 붙여넣기 해주세요.\n" +
                        "https://test7team.s3.ap-northeast-2.amazonaws.com/cancer.html";
                
                    sBody = sBody.replace(/(\n|\r\n)/g, " ");
                    location.href = "sms:" + destination + "?body=" + encodeURIComponent(sBody);
                }

                function sendDefaultMessageCar(destination, uniqueCode) {
                    var sBody = "안녕하세요.\n" +
                    "Eulji-app입니다.\n" +
                    "설문조사에 참여해주시면 감사하겠습니다.\n" +
                    "고유 코드: " + uniqueCode + "\n" +
                    "코드를 복사, 붙여넣기 해주세요.\n" +
                        "https://test7team.s3.ap-northeast-2.amazonaws.com/car.html";

                    sBody = sBody.replace(/(\n|\r\n)/g, " ");
                    location.href = "sms:" + destination + "?body=" + encodeURIComponent(sBody);
                }

                function sendDefaultMessageTeeth(destination, uniqueCode) {
                    var sBody = "안녕하세요.\n" +
                    "Eulji-app입니다.\n" +
                    "설문조사에 참여해주시면 감사하겠습니다.\n" +
                    "고유 코드: " + uniqueCode + "\n" +
                    "코드를 복사, 붙여넣기 해주세요.\n" +
                        "https://test7team.s3.ap-northeast-2.amazonaws.com/teeth.html";

                    sBody = sBody.replace(/(\n|\r\n)/g, " ");
                    location.href = "sms:" + destination + "?body=" + encodeURIComponent(sBody);
                }

                function sendDefaultMessageTrip(destination, uniqueCode) {
                    var sBody = "안녕하세요.\n" +
                    "Eulji-app입니다.\n" +
                    "설문조사에 참여해주시면 감사하겠습니다.\n" +
                    "고유 코드: " + uniqueCode + "\n" +
                    "코드를 복사, 붙여넣기 해주세요.\n" +
                        "https://test7team.s3.ap-northeast-2.amazonaws.com/trip.html";

                    sBody = sBody.replace(/(\n|\r\n)/g, " ");
                    location.href = "sms:" + destination + "?body=" + encodeURIComponent(sBody);
                }

                function sendDefaultMessageDeath(destination, uniqueCode) {
                    var sBody = "안녕하세요.\n" +
                    "Eulji-app입니다.\n" +
                    "설문조사에 참여해주시면 감사하겠습니다.\n" +
                    "고유 코드: " + uniqueCode + "\n" +
                    "코드를 복사, 붙여넣기 해주세요.\n" +
                        "https://test7team.s3.ap-northeast-2.amazonaws.com/death.html";

                    sBody = sBody.replace(/(\n|\r\n)/g, " ");
                    location.href = "sms:" + destination + "?body=" + encodeURIComponent(sBody);
                }

                function sendDefaultMessageChild(destination, uniqueCode) {
                    var sBody = "안녕하세요.\n" +
                    "Eulji-app입니다.\n" +
                    "설문조사에 참여해주시면 감사하겠습니다.\n" +
                    "고유 코드: " + uniqueCode + "\n" +
                    "코드를 복사, 붙여넣기 해주세요.\n" +
                        "https://test7team.s3.ap-northeast-2.amazonaws.com/child.html";

                    sBody = sBody.replace(/(\n|\r\n)/g, "%0a");
                    location.href = "sms:" + destination + "?body=" + encodeURIComponent(sBody);
                }

                function sendCustomMessage(destination, uniqueCode, message) {
                    var fullMessage = message + "\n고유 코드: " + uniqueCode;
                    fullMessage = fullMessage.replace(/(\n|\r\n)/g, "%0a");
                    location.href = "sms:" + destination + "?body=" + encodeURIComponent(fullMessage);
                }

    })
    .catch(error => {
        console.error('Error fetching data:', error);
        hideLoadingScreen();
    });
} // 각 메시지 타입에 따른 기본 메시지 전송 함수들

// 페이지 로드 시 초기 데이터 표시
fetchAndDisplayData();

// 상세 페이지로 이동하는 함수
function detail() {
    window.location.href = "https://test7team.s3.ap-northeast-2.amazonaws.com/dcamapp/detail.html";
}
// 홈 페이지로 이동하는 함수
function home() {
    window.location.href = "https://test7team.s3.ap-northeast-2.amazonaws.com/dcamapp/index.html";
}
// 뒤로 가기 기능 함수
function goBack() {
    window.history.back();
}
// SMS 공유 기능 함수
 function fn_smsShare(destination, uniqueCode) {
            var sBody = "[RELATION.CO.KR~~!! ]\n" +
                "안녕하세요.\n" +
                "GA영업비서어플입니다.\n" +
                "설문조사에 참여해주시면 감사하겠습니다.\n" +
                "고유 코드: " + uniqueCode + "\n" + // 이 부분에서 uniqueCode를 추가
                "코드를 복사, 붙여넣기 해주세요." +
                "https://test7team.s3.ap-northeast-2.amazonaws.com/survey.html";


            sBody = sBody.replace(/(\n|\r\n)/g, "%0a");
            location.href = "sms:" + destination + "?body=" + sBody;
        }
// 사용자 카운트 업데이트 함수
function updateCustomerCount(count) {
    const customerCountElement = document.getElementById("customerCount");
    customerCountElement.textContent = count;
}
 src="https://code.jquery.com/jquery-latest.min.js" // jquery 라이브러리 호출

 


