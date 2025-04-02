import * as fs from 'fs';

export default function(text: string) {
  fs.appendFile('output.txt', text + '\n', function (err) {
   if (err) throw err;
 });
};