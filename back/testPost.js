import { hash as _hash } from "bcryptjs";
import { subtle } from "crypto";

async function hash(string) {
    const sourceBytes = new TextEncoder().encode(string);
    const disgest = await subtle.digest("SHA-256", sourceBytes);
    const hash = Array.from(new Uint8Array(disgest)).map(b => b.toString(16).padStart(2, "0")).join("");
    return hash;
}

let { challenge, salt } = await fetch("http://localhost:5000/session", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json; charset=UTF-8",
        "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "Referer": "http://localhost:5000/session",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "{\"id\":0}",
    "method": "POST"
}).then(res => res.json());

let hash_password = await _hash("ploof", salt);

let hash_challenge = await hash(challenge + hash_password);

//the user send the hash of the challenge and the password
fetch("http://localhost:5000/session", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json; charset=UTF-8",
        "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "Referer": "http://localhost:5000/session",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "{\"id\":0, \"hash\": \"" + hash_challenge + "\"}",
    "method": "POST"
}).then(res => res.json()).then(m => console.log(m)); // expect: session_id: String, id: Number