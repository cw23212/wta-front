
function setupLogin() {
    const loginButton = document.querySelector(".loginButton");
  
    if (loginButton) {
      loginButton.addEventListener("click", function(event) {
        event.preventDefault(); // 기본 동작(폼 제출) 방지
        const userIdInput = document.getElementById("userIdInput");
        const userId = userIdInput.value;
        validate(userId);
      });
    } else {
      console.error("loginButton이 HTML에 존재하지 않습니다.");
    }
}

function validate(userId) {
    const url = `http://n2.psj2867.com:18080/api/user/login?user=${encodeURIComponent(userId)}`;
  
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          console.log("로그인 실패");
          //TODO: 로그인 실패 팝업 띄우기
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        console.log("id : " + data.id);
        window.location.href = 'index.html';
      });
  }
  
window.onload = function(){
    setupLogin();
}