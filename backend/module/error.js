export default function (message = "Неизвестная ошибка", code = null) {

  console.log(message);

  if(message instanceof Array) {
    for(let i in message[0]) {
      message = message[0][i]
    }
  }

  const fake = String(Math.random().toFixed(4)).split('.')[1];
  throw {message: message, code: code || fake}
}