import User from "../store/User";
import Url from "../modules/Url";

export default async (path, params = {}) => {
    let result = await fetch( Url + "/" +path, {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      mode: "cors",
      body: JSON.stringify(Object.assign(params, {token: User.token}))
    });

    let data = await result.json();

    if (data.error) {
      let error = data.error.message || data.error.sql || "Внутренняя ошибка";
      throw error
    }

    return data.result
}