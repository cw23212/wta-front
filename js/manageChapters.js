const contentId = sessionStorage.getItem('contentId');
const userId = sessionStorage.getItem('userId');
const addBtn = document.querySelector("#addBtn");
const chapterName = document.querySelector("#contentName");
const chapterUrl = document.querySelector("#contentUrl");

function addContent(name, url){
  const chapterUrl = `https://back.psj2867.com/api/user/chapter`
  const data = {
    user: {
        id: userId,
        additionalProp1: {}
    },
    content: {
        id: contentId,
        additionalProp1: {}
    },
    chapter: {
        name: name,
        url, url,
        additionalProp1: {}
    }
  };

  return fetch(chapterUrl, {method : "POST", body: JSON.stringify(data), headers:{"Content-Type": "application/json"}})
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

function deleteContent(chapterId) {
  const deleteUrl = `https://back.psj2867.com/api/user/chapter`
  const data = {
    user: {
        id: userId,
        additionalProp1: {}
    },
    content: {
        id: contentId,
        additionalProp1: {}
    },
    chapter: {
        id: chapterId,
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
  sessionStorage.setItem('contentId', contentId);
  var chapterData = originData.contents.find(item => item.id = contentId);
  console.log(chapterData);
  window.location.href = 'manageChapter.html';
}

$(document).ready(function(){
    const url = `https://back.psj2867.com/api/user/me?user=${encodeURIComponent(userId)}`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          console.log("유저 정보 받아오기 실패");
          throw new Error('Login failed');
        }

        return response.json();
      })
      .then(data => {
        var chapterData = data.contents.find(item => item.id == contentId);
        console.log(chapterData);
        $('#manageTable').DataTable({
          data: chapterData.chapters.map(chapter => {
              return {
                  id: chapter.id,
                  content_name: chapterData.name,
                  chapter_name: chapter.name,
                  url: chapter.url
              };
          }),
          columns: [
              { title: "작품 이름", data: "content_name" },
              { title: "회차 이름", data: "chapter_name" },
              { title: "회차 URL", data: "url"},
              {
                  title: "회차 삭제",
                  render: function(data, type, row) {
                      return '<button data-id="' + row.id + '" class="btn btn-danger btn-icon-split deleteContent"><span class="text">회차 삭제</span></button>';
                  }
              }
          ]
        });

        addBtn.addEventListener("click", function() {
          const name = chapterName.value;
          const url = chapterUrl.value;
          
          addContent(name, url);
        });

        $('#manageTable').on('click', '.deleteContent', function() {
          if (window.confirm("정말 작품을 삭제하시겠습니까?")) {
            var chapterId = $(this).data('id');
            deleteContent(chapterId);
          } else {
            console.log("취소");
          }
        });

    });
})