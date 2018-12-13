import User from "../store/User";
import Url from "../modules/Url";

export default async (path, params = {}) => {
  console.log({["request: " + path]: params});

  let result = await fetch(Url + "/" + path, {
    method: 'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    mode: "cors",
    body: JSON.stringify(Object.assign(params, {token: User.token}))
  });

  let data = await result.json();

  console.log({["response: " + path]: data});

  if (data.error) {
    if(data.error.code === 51) {User.logout(true)}
    throw data.error.message || data.error.sql || "Внутренняя ошибка";
  }

  return data.result;
}