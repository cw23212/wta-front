

function setupRegister() {
    const registerButton = document.querySelector(".registerButton");
  
    if (registerButton) {
      registerButton.addEventListener("click", function(event) {
        event.preventDefault(); // 기본 동작(폼 제출) 방지
        const userIdInput = document.getElementById("userIdInput");
        const userId = userIdInput.value;
        signUp(userId);
      });
    } else {
      console.error("registerButton HTML에 존재하지 않습니다.");
    }
  }
  
  
  
  function signUp(userId) {
    const url = `http://n2.psj2867.com:18080/api/user/signup`;
    const data = {name: userId}

    return fetch(url, {method : "POST", body: JSON.stringify(data), headers:{"Content-Type": "application/json"}})
    .then(response => {
      if (!response.ok) {
        console.log("회원가입 실패");
        throw new Error('signup failed');
      }
      return response.json();
    })
    .then(data => {
      console.log("id : " + data.id);
      userId = data.id;
      window.location.href = 'index.html';
    })
  }

  window.onload = function(){
    setupRegister();
}