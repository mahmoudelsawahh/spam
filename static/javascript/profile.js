let messageData = {};
let total = document.getElementById("total");
let divResult = document.getElementById("result");
let number = 5;
let search = document.getElementById("search");
let searchBtn = document.getElementById("searchBtn");
let q = "";

// ----------------------------------Auth Info-----------------------------------
var params = {};
var regex = /([^&=]+)=([^&]*)/g,
  m;
while ((m = regex.exec(location.href))) {
  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
if (Object.keys(params).length > 0) {
  localStorage.setItem("authInfo", JSON.stringify(params));
}
window.history.pushState({}, document.title, "/" + "allMessage.html");
let info = JSON.parse(localStorage.getItem("authInfo"));
const ACCESS_TOKEN = info.access_token;

total.innerHTML = number;
getMessages(number);

document.getElementById("number").onchange = () => {
  number = document.getElementById("number").value;
  total.innerHTML = number;
  getMessages(number);
};

searchBtn.onclick = () => {
  getMessages(number, q);
};

search.onchange = () => {
  q = search.value;
};

function getMessages(number, q = "") {
  divResult.innerHTML = "";
  let url = "";
  if (q == "") {
    url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=SPAM&maxResults=${number}`;
  } else {
    url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=SPAM&maxResults=${number}&q=${q}`;
  }
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  })
    .then((data) => data.json())
    .then((info) => {
      Array.from(info.messages).forEach((message) => {
        fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        )
          .then((info) => {
            return info.json();
          })
          .then((data) => {
            messageData = {
              id: data.id,
              msg: data.snippet,
            };
            let result = [];
            Array.from(data.payload.headers).forEach((message) => {
              if (
                message.name == "Date" ||
                message.name == "From" ||
                message.name == "To"
              ) {
                result.push(message.value);
              }
            });

            divResult.innerHTML += `
          <tr id='${messageData.id}'>
          <td>${result[0]}<td>
          <td>${result[1]}</td>
          <td>${result[2]}</td>
          <td><a target="_blank" href="https://mail.google.com/mail/u/0/#inbox/${messageData.id}">${messageData.msg}</a></td>
          <td>
          
          <button onclick="
          
          fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageData.id}/trash',{
            method:'POST',
            headers:new Headers({Authorization:'Bearer ${ACCESS_TOKEN}'})
          })
          .then((info) => {
            console.log(info)
            document.getElementById('${messageData.id}').remove()
          })    
          "
          >Trash</button>
          
          </td>
          <td>
          <button
          onclick="
          fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageData.id}',{
            method:'DELETE',
            headers:new Headers({Authorization:'Bearer ${ACCESS_TOKEN}'})
          })
          .then((info) => {
            console.log(info)
            document.getElementById('${messageData.id}').remove()
          })
          "
          >Delete</button>
          </td>
          </tr>
          `;
          });
      });
    });
}
// ----------------------------logout--------------------------------------------------------
const button = document.getElementById("logout");
button.addEventListener("click", logout);
function logout() {
  fetch("https://oauth2.googleapis.com/revoke?token=" + info["access_token"], {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
  }).then((data) => {
    location.href = "http://127.0.0.1:5000";
  });
}
