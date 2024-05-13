const userId = sessionStorage.getItem('userId');
const addBtn = document.querySelector("#addBtn");
const contentName = document.querySelector("#contentName");
const contentUrl = document.querySelector("#contentUrl");
let contentId = null;
let originData = null;

function addContent(name, url){
  const contentUrl = `http://n2.psj2867.com:18080/api/user/content`
  const data = {
    user: {
        id: userId,
        additionalProp1: {}
    },
    content: {
        name: name,
        url: url,
        additionalProp1: {}
    }
  };

  return fetch(contentUrl, {method : "POST", body: JSON.stringify(data), headers:{"Content-Type": "application/json"}})
    .then(response => {
      if (!response.ok) {
        console.log("콘텐츠 추가 실패");
        throw new Error('콘텐츠 추가 failed');
      }
      return response.json();
    })
    .then(data => {
      location.reload();
    })
}

function deleteContent(contentId) {
  const deleteUrl = `http://n2.psj2867.com:18080/api/user/content`
  const data = {
    user: {
        id: userId,
        additionalProp1: {}
    },
    content: {
        id: contentId,
        additionalProp1: {}
    }
  };

  return fetch(deleteUrl, {method : "DELETE", body: JSON.stringify(data), headers:{"Content-Type": "application/json"}})
    .then(response => {
      if (!response.ok) {
        throw new Error('콘텐츠 삭제 failed');
      }
      return response.json();
    })
    .then(data => {
      location.reload();
    })
}

function manageChapter(){
  sessionStorage.setItem('contentId', contentId);
  window.location.href = 'manageChapter.html';
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
                  title: "회차 관리",
                  render: function(data, type, row) {
                      return '<button data-id="' + row.id + '" class="btn btn-success btn-icon-split manageChapter"><span class="text">회차 관리</span></button>';
                  }
              },
              {
                  title: "작품 삭제",
                  render: function(data, type, row) {
                      return '<button data-id="' + row.id + '" class="btn btn-danger btn-icon-split deleteContent"><span class="text">작품 삭제</span></button>';
                  }
              }
          ]
        });

        addBtn.addEventListener("click", function() {
          const name = contentName.value;
          const url = contentUrl.value;
          
          addContent(name, url);
        });

        $('#manageTable').on('click', '.deleteContent', function() {
          if (window.confirm("정말 작품을 삭제하시겠습니까?")) {
            contentId = $(this).data('id');
            deleteContent(contentId);
          } else {
            console.log("취소");
          }
        });

        $('#manageTable').on('click', '.manageChapter', function() {
          contentId = $(this).data('id');
          manageChapter();
        });

    });
})