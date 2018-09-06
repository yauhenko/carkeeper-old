import User from "../store/User";
import Url from "../modules/Url";
import App from "../store/App";
import Notification from "../components/Notification";

export default async (path, params = {}) => {
    if(!App.connect) return;

    let result = await fetch( Url + "/" +path, {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      mode: "cors",
      body: JSON.stringify(Object.assign(params, {token: User.token}))
    });

    let data = await result.json();

    if (data.error) {
      const error = data.error.message || data.error.sql || "Внутренняя ошибка";
      Notification(error);
      throw error;
    }

    console.log(data.result);
    return data.result;
}