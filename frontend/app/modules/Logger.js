LogHub = function (key, app, sessid = null) {
  let loghub = this;

  loghub.key = key;
  loghub.app = app;
  loghub.sessid = sessid || null;

  loghub.session = function(name = null, success = null, error = null) {
    loghub.api('sessions/start', {
      id: loghub.sessid,
      name: name
    }, function (res) {
      loghub.sessid = res.id;
      if(success) success(res.id);
    }, error);
  };

  loghub.debug = function(message, context = null) {
    console.log('LogHub: ' + message, context);
    loghub.push({ level: 'debug', message: message, context: context });
  };

  loghub.info = function(message, context = null) {
    console.log('LogHub: ' + message, context);
    loghub.push({ level: 'info', message: message, context: context });
  };

  loghub.notice = function(message, context = null) {
    console.log('LogHub: ' + message, context);
    loghub.push({ level: 'notice', message: message, context: context });
  };

  loghub.warning = function(message, context = null) {
    console.log('LogHub: ' + message, context);
    loghub.push({ level: 'warning', message: message, context: context });
  };

  loghub.error = function(message, context = null) {
    console.log('LogHub: ' + message, context);
    loghub.push({ level: 'error', message: message, context: context });
  };

  loghub.critical = function(message, context = null) {
    console.log('LogHub: ' + message, context);
    loghub.push({ level: 'critical', message: message, context: context });
  };

  loghub.alert = function(message, context = null) {
    console.log('LogHub: ' + message, context);
    loghub.push({ level: 'alert', message: message, context: context });
  };

  loghub.emergency = function(message, context = null) {
    console.log('LogHub: ' + message, context);
    loghub.push({ level: 'emergency', message: message, context: context });
  };

  loghub.tag = function(tag, context = null) {
    console.log('LogHub: ' + tag, context);
    loghub.push({ tag: tag, context: context });
  };

  loghub.push = function(data, success = null, error = null) {
    data.session = loghub.sessid;
    loghub.api('journal/push', data, success, error);
  };

  loghub.api = function (method, data, success = null, error = null) {
    data = data || {};
    data.key = loghub.key || null;
    data.app = loghub.app || null;
    let ops = {
      mode: 'cors',
      method: 'post',
      body: JSON.stringify(data)
    };
    fetch('https://api.loghub.pro/v1/' + method, ops).then(function(response) {
      if(response.status !== 200) {
        console.log('LogHub Error: ' + response.status);
        if(error) error('LogHub Error', response.status);
      } else {
        response.json().then(function(data) {
          if(data.result && success) success(data.result);
          if(data.error) {
            console.log('LogHub Error: ', data.error);
            if(error) error(data.error.message, data.error.code);
          }
        });
      }
    }).catch(function(err) {
      console.log('LogHub Fetch Error', err);
    });
  }
};

export default new LogHub("z9ndbJ0plUvDwkPOV3WyqRxNmctDflPV4J8jMg9b", "CarKeeper");