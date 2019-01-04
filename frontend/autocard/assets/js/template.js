var formData = {},
  form = document.getElementById("form"),
  formCode = document.getElementById("form_code"),
  more = document.getElementById("list_more_btn"),
  detail = document.getElementById("card_list-detail"),
  image = document.getElementById("card_image"),
  message = document.getElementById("card_success");

(function () {
  carkeeper.init({ source: 'land_card2' });

  if(!carkeeper.param("card")) {
    var a = document.getElementById("block_tabs");
    if(a) a.style.removeProperty("display")
  }

  if(localStorage.success) {
    message.style.display = "block";
  }

  if(form) {
    form.onsubmit = function (e) {
      e.preventDefault();

      formData  = {
        lastname: e.target.lastname.value || "",
        firstname: e.target.firstname.value || "",
        middlename: e.target.middlename.value || "",
        tel: e.target.tel.value || "",
        email: e.target.email.value || "",
      };

      sendCode(formData.tel).then(()=>{
        form.style.display = "none";
        formCode.style.display = "block";
      }).catch(function (err) {
        notification(err.message)
      });
    };
  }

  if(formCode) {
    formCode.onsubmit = function (e) {
      e.preventDefault();
      formData.code = e.target.code.value;
      submitForm(formData).then(function () {
        localStorage.setItem("success", "1");
        window.location.href = "app.html"
      }).catch((e)=>{
        notification(e.message);
      })
    }
  }

  if(more) {
    more.onclick = function () {
      detail.style.display = "block";
      more.style.display = "none";
      image.style.display = "none";
    };
  }
})();

var sendCode = function (tel) {
  return api("account/tel", {tel: tel});
};

var submitForm = function (data) {
  return api("autocard/submit2", data);
};

function api(method, args = {}, silent = false) {
  return new Promise(function(resolve, reject) {
    function processReject(error) {
      if(!silent) reject(error);
      else resolve(false);
    }
    let endpoint = window.location.host.match(/^(localhost|192)/) ? 'http://192.168.1.223:9090/' : 'https://api.carkeeper.pro/';
    fetch(endpoint + method, {
      method: 'POST',
      body: JSON.stringify(args)
    }).then(function (data) {
      return data.json();
    }).then(function (data) {
      if(data.hasOwnProperty('error')) processReject(data.error);
      else if(data.hasOwnProperty('result')) resolve(data.result);
      else processReject({ message: 'Ошибка ответа от сервера', code: 2 })
    }).catch(function (error) {
      processReject({ message: 'Ошибка соединения', code: 1, raw: error});
    });
  });
}


var notification = function (message) {
  new Toast({
    message: message || "Ошибка",
    type: "danger"
  })
};