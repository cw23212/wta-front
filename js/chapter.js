let contentId;
let chapterId;
const userId = sessionStorage.getItem('userId');
const addBtn = document.querySelector("#addBtn");

function showChapters(){
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
              { title: "작품 이름", data: "content_name"},
              { title: "회차 이름", data: "chapter_name" },
              { title: "회차 URL", data: "url"},
              {
                  title: "회차 통계 보기",
                  render: function(data, type, row) {
                      return '<button data-id="' + row.id + '" class="btn btn-info btn-icon-split statistics"><span class="text">회차 통계 보기</span></button>';
                  }
              }
          ]
        });
    })
}

function statistics(){
  sessionStorage.setItem('contentId', contentId);
  sessionStorage.setItem('chapterId', chapterId);
  window.location.href = 'chapterStatistics.html';
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

        var selectBox = $('#contentSelect');
        selectBox.empty();
        selectBox.append('<option selected>작품을 선택하세요</option>');
        $.each(data.contents, function(index, content){
            selectBox.append($('<option>',{
                value: content.id,
                text: content.name
            }))
        });

        $('#manageTable').on('click', '.statistics', function() {
          chapterId = $(this).data('id');
          statistics();
        });

        selectBox.change(function(){
           contentId = $(this).val();
           var table = $('#manageTable').DataTable();
           table.destroy();
           $('#manageTable').empty();
           showChapters();
        });
    });
})