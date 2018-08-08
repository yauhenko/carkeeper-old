export default function (message = "Неизвестная ошибка", code = -1) {
  if(message instanceof Array) {
    for(let i in message[0]) {
      message = message[0][i]
    }
  }
  console.error(`Error: ${message} (code: ${code})`);
  throw { message: message, code: code || -1 }
}
