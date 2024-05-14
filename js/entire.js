const userId = sessionStorage.getItem('userId');
const addBtn = document.querySelector("#addBtn");
const contentName = document.querySelector("#contentName");
const contentUrl = document.querySelector("#contentUrl");
let contentId = null;
let originData = null;

function statistics(){
  sessionStorage.setItem('contentId', contentId);
  window.location.href = 'entireStatistics.html';
}

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
        originData = data;
        $('#manageTable').DataTable({
          data: data.contents.map(content => {
              return {
                  id: content.id,
                  name: content.name,
                  url: content.url
              };
          }),
          columns: [
              { title: "작품 이름", data: "name" },
              { title: "작품 URL", data: "url" },
              {
                  title: "작품 전체 통계 보기",
                  render: function(data, type, row) {
                      return '<button data-id="' + row.id + '" class="btn btn-info btn-icon-split statistics"><span class="text">작품 통계 보기</span></button>';
                  }
              }
          ]
        });

        $('#manageTable').on('click', '.deleteContent', function() {
          if (window.confirm("정말 작품을 삭제하시겠습니까?")) {
            contentId = $(this).data('id');
            deleteContent(contentId);
          } else {
            console.log("취소");
          }
        });

        $('#manageTable').on('click', '.statistics', function() {
          contentId = $(this).data('id');
          statistics();
        });

    });
})