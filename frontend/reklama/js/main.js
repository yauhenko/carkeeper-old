$(function () {
  //
  var language = window.navigator.language;
  language = language.substr(0, 2).toLowerCase();


  //  function getListLangyage() {
  //   $.ajax({
  //     url: 'https://srv.mobi.club/API/Langs/GetSimpleList',
  //     dataType: "json",
  //     success: function (res) {
  //       listLanguage = res.result
  //       var ss = listLanguage.filter(function (item) {
  //         return item === language
  //       })
  //       if (!ss.length) {
  //         language = 'en'
  //       }
  //
  //     }
  //   });
  // }
  $.ajax({
    url: 'https://srv.mobi.club/API/Translates/GetMap?domain=mortu.land&lang=en' ,
    dataType: "json",
    success: function (res) {
      $('.content-text-sogl').html(res.result.AGREEMENT_HTML)
      $('.content-text-politicy').html(res.result.PRIVACY_POLICY_HTML)
      $('.politic-title').html(res.result.PRIVACY_POLICY_TITLE)
      $('.conditions-title').html(res.result.AGREEMENT_TITLE)
      $('.politic-confidence').html(res.result.PRIVACY_POLICY_TITLE)
      $('.rules-user').html(res.result.AGREEMENT_TITLE)
      $('.logo_title_small').html(res.result.LOGO_SUBTITLE)
      $('.logo_text').html(res.result.LOGO_TEXT_HTML)
      $('.spinner').hide()
    }
  })

  // getListLangyage()





});
