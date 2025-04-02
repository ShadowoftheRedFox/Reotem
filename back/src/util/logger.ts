import * as fs from 'fs';

export default function (text: string) {
    console.log(text)
    fs.appendFile('./logs/debug.log', `${(text !== "\n" && !text.startsWith("\n|----------------|")) ? `[${new Date().toISOString()}]` : ""} ${text} \n`, function (err) {
        if (err) throw err;
    });
};