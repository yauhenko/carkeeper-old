import User from "../store/User";

export default async (url, params) => {
  return fetch("http://192.168.1.20:8000/" + url, {
    method: 'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    mode: "cors",
    body: JSON.stringify(Object.assign(params, {token: User.token}))
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        let error = data.error.message || data.error.sql || "Внутренняя ошибка";
        return Promise.reject(error);
      }
      return data.result;
    });
}