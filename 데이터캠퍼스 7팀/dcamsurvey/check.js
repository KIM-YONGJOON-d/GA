const Button = document.getElementById('z');
const ageInput = document.querySelector('input[name="age"]');
const genderInputs = document.querySelectorAll('input[name="성별"]');
const oButton1 = document.getElementById('q1');
const xButton1 = document.getElementById('q2');
const oButton2 = document.getElementById('w1');
const xButton2 = document.getElementById('w2');
const oButton3 = document.getElementById('e1');
const xButton3 = document.getElementById('e2');
const oButton4 = document.getElementById('r1');
const xButton4 = document.getElementById('r2');
const oButton5 = document.getElementById('t1');
const xButton5 = document.getElementById('t2');
const back1 = document.getElementById('b1');
const back2 = document.getElementById('b2');
const back3 = document.getElementById('b3');
const back4 = document.getElementById('b4');
const back5 = document.getElementById('b5');
const back6 = document.getElementById('b6');
const question1 = document.getElementById('question1');
const question2 = document.getElementById('question2');
const question3 = document.getElementById('question3');
const question4 = document.getElementById('question4');
const question5 = document.getElementById('question5');
const submitPage = document.getElementById('submitpage');
const submit1 = document.getElementById('s');

Button.addEventListener('click', function() {
    private.style.display = 'none';
    question1.style.display = 'block';
});

oButton1.addEventListener('click', function () {
    oButton1.parentNode.classList.add('selected');
    xButton1.parentNode.classList.remove('selected');
    question1.style.display = 'none';
    question2.style.display = 'block';
});

xButton1.addEventListener('click', function () {
    xButton1.parentNode.classList.add('selected');
    oButton1.parentNode.classList.remove('selected');
    question1.style.display = 'none';
    question2.style.display = 'block';
});

back1.addEventListener('click', function () {
    question1.style.display = 'none';
    private.style.display = 'block';
});


oButton2.addEventListener('click', function () {
    oButton2.parentNode.classList.add('selected');
    xButton2.parentNode.classList.remove('selected');
    oButton2.checked = true;
    question2.style.display = 'none';
    question3.style.display = 'block';
});

xButton2.addEventListener('click', function () {
    xButton2.parentNode.classList.add('selected');
    oButton2.parentNode.classList.remove('selected');
    xButton2.checked = true;
    question2.style.display = 'none';
    question3.style.display = 'block';
});

back2.addEventListener('click', function () {
    question1.style.display = 'block';
    question2.style.display = 'none';
});

oButton3.addEventListener('click', function () {
    oButton3.parentNode.classList.add('selected');
    xButton3.parentNode.classList.remove('selected');
    oButton3.checked = true;
    question3.style.display = 'none';
    question4.style.display = 'block';
});

xButton3.addEventListener('click', function () {
    xButton3.parentNode.classList.add('selected');
    oButton3.parentNode.classList.remove('selected');
    xButton3.checked = true;
    question3.style.display = 'none';
    question4.style.display = 'block';
});

back3.addEventListener('click', function () {
    question2.style.display = 'block';
    question3.style.display = 'none';
});

oButton4.addEventListener('click', function () {
    oButton4.parentNode.classList.add('selected');
    xButton4.parentNode.classList.remove('selected');
    oButton4.checked = true;
    question4.style.display = 'none';
    question5.style.display = 'block';
});

xButton4.addEventListener('click', function () {
    xButton4.parentNode.classList.add('selected');
    oButton4.parentNode.classList.remove('selected');
    xButton4.checked = true;
    question4.style.display = 'none';
    question5.style.display = 'block';
});

back4.addEventListener('click', function () {
    question3.style.display = 'block';
    question4.style.display = 'none';
});

oButton5.addEventListener('click', function () {
    oButton5.parentNode.classList.add('selected');
    xButton5.parentNode.classList.remove('selected');
    oButton5.checked = true;
    question5.style.display = 'none';
    submitPage.style.display = 'block';
});

xButton5.addEventListener('click', function () {
    xButton5.parentNode.classList.add('selected');
    oButton5.parentNode.classList.remove('selected');
    xButton5.checked = true;
    question5.style.display = 'none';
    submitPage.style.display = 'block';
});

back5.addEventListener('click', function () {
    question4.style.display = 'block';
    question5.style.display = 'none';
});
back6.addEventListener('click', function () {
    question5.style.display = 'block';
    submitPage.style.display = 'none';
});

submit1.addEventListener('click', function () {
    const codeValue = document.querySelector('input[name="code"]').value;
    const ageValue = ageInput.value;
    let genderChecked = false;
    for (const genderInput of genderInputs) {
        if (genderInput.checked) {
            genderChecked = true;
            break;
        }
    }

    if (!codeValue) {
        alert('고유코드를 입력해주세요.');
        return;
    }

    if (!ageValue) {
        alert('나이를 입력해주세요.');
        return;
    }

    if (!genderChecked) {
        alert('성별을 선택해주세요.');
        return;
    }

    // 모든 질문에 답변한 경우
    alert('설문조사에 참여해주셔서 감사합니다!');
});

const previousScreens = [];

// 각 질문 섹션에서 이전 버튼을 눌렀을 때 호출되는 함수

// 현재 화면을 저장할 변수
let currentScreen = 'private';

// 다음 버튼을 눌렀을 때 호출되는 함수
function goToNext(nextScreen) {
    // 현재 화면을 스택에 저장
    previousScreens.push(currentScreen);

    // 현재 화면을 숨기고 다음 화면을 보이도록 변경
    document.getElementById(currentScreen).style.display = 'none';
    document.getElementById(nextScreen).style.display = 'block';
    currentScreen = nextScreen;
}
function goBack() {
    window.history.back();
}