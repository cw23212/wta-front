
  

function includeHTML(callback) {
  var z, i, elmnt, file, xhttp;
  var elementsToLoad = 0;

  function onReady() {
      elementsToLoad--;
      if (elementsToLoad === 0 && typeof callback === 'function') {
          callback();
      }
  }

  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain attribute:*/
      file = elmnt.getAttribute("include-html");
      if (file) {
          elementsToLoad++;
          /* Make an HTTP request using the attribute value as the file name: */
          (function(elmnt, file) {
              xhttp = new XMLHttpRequest();
              xhttp.onreadystatechange = function() {
                  if (this.readyState == 4) {
                      if (this.status == 200) {
                          elmnt.innerHTML = this.responseText;
                      }
                      if (this.status == 404) {
                          elmnt.innerHTML = "Page not found.";
                      }
                      /* Remove the attribute, and call this function once more: */
                      elmnt.removeAttribute("include-html");
                      onReady();
                  }
              }
              xhttp.open("GET", file, true);
              xhttp.send();
          })(elmnt, file);
      }
  }

  // If there are no elements to load, immediately call the callback
  if (elementsToLoad === 0 && typeof callback === 'function') {
      callback();
  }
}

function setUserName() {
  var userName = sessionStorage.getItem('userName');
  if (userName) {
      var userNameElement = document.getElementById('userName');
      if (userNameElement) {
          userNameElement.textContent = userName;
      } else {
          console.error("Element with id 'userName' not found.");
      }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  includeHTML(setUserName);
});
