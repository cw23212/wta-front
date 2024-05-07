const userId = sessionStorage.getItem('userId');

$(document).ready(function(){
    const url = `http://n2.psj2867.com:18080/api/user/me?user=${encodeURIComponent(userId)}`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          console.log("유저 정보 받아오기 실패");
          throw new Error('Login failed');
        }

        return response.json();
      })
      .then(data => {
        console.log(data);
        $('#manageTable').DataTable({
            data: data.contents.map(content => [content.name, content.url]), // "name"과 "url"만 사용
            columns: [
                { title: "작품 이름" },
                { title: "작품 URL" },
                { // 버튼 열 추가
                    title: "작업 관리",
                    render: function(data, type, row) {
                        return '<a href="#" class="btn btn-success btn-icon-split"><span class="text">작품 관리하기</span></a>';
                    }
                }
            ]
        });
      });
})