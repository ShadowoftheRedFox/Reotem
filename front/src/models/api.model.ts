import { environment } from "../environments/environment";

const baseUrl = environment.api_url;

export type User = {
    _id: Number;
    first_name: String;
    last_name: String;
    login: String;
    password: String;
    age: Number;
}

export const API = {

}

export default API;

function sendApiRequest(method: "GET" | "POST" | "PUT", endpoint: String, parameters: Object = {}, message: String | undefined = undefined) {
    return new Promise(function (resolve, reject) {
        if (message !== undefined) {
            console.info("[API] " + message);
        }
        const urlParameters = JSON.stringify(parameters);

        var options: any = { method };
        if (method == "GET") {
            endpoint += "?data=" + urlParameters;
        } else {
            options.body = urlParameters; // TODO test if it works
            options.headers = { "Content-Type": "application/x-www-form-urlencoded" };
        }
        fetch(origin + baseUrl + "/api/" + endpoint, options)
            .then(res => {
                if (res.headers.get("Content-Type") === "application/json")
                    return res.json();
                else
                    throw new Error(res.statusText);
            })
            .then(function (response) {
                if (!response.success) {
                    console.error("[API] " + response.error);
                    reject(response.error);
                } else {
                    let data = response.data;
                    if (response.count !== undefined)
                        data.count = response.count;
                    resolve(data);
                }
            })
            .catch(reject);
    });
}
