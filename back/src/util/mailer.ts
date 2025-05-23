// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();

import { Client } from "node-mailjet";
import logger from "./logger";

export const template = {
  // a span in the url to trick the gmail parser
  validate: (username: string, token: string) => {
    return `<h3>${username}, vérifiez votre adresse mail.</h3>
<p>Cliquez sur le lien suivant pour valider votre adresse email.</p>
<a href="${process.env.FRONT_URL}connection/validating/${token}" target="_blank">Vérifiez</a>
<p>Si vous n'êtes pas le destinataire de ce message, veuillez l'ignorer.</p>
<p>Ne donnez jamais vos informations personnelles. Nous ne vous demanderons jamais vos données personnelles, tel que vos numéros de carte bancaire, mot de passes, lieu de résidance, RIB...</p>
`;
  },
  revalidate: (username: string, token: string) => {
    return `<h3>${username}, vous venez de changer d'adresse email, vérifiez votre la.</h3>
<p>Cliquez sur le lien suivant pour valider votre nouvelle adresse email.</p>
<a href="${process.env.FRONT_URL}connection/validating/${token}" target="_blank">Vérifiez</a>
<p>Si vous n'êtes pas le destinataire de ce message, veuillez l'ignorer.</p>
<p>Ne donnez jamais vos informations personnelles. Nous ne vous demanderons jamais vos données personnelles, tel que vos numéros de carte bancaire, mot de passes, lieu de résidance, RIB...</p>
`;
  },
  passwordChange: (username: string) => {
    return `<h3>${username}, vous venez de changer dde mot de passe.</h3>
<p>Si cette action ne viens pas de vous, contactez au plus vite votre administrateur et changer votre mot de passe à nouveau..</p>
<p>Si vous n'êtes pas le destinataire de ce message, veuillez l'ignorer.</p>
<p>Ne donnez jamais vos informations personnelles. Nous ne vous demanderons jamais vos données personnelles, tel que vos numéros de carte bancaire, mot de passes, lieu de résidance, RIB...</p>
`;
  }
};

export const sendMail = (target: string, title: string, description: string, html: string, username = "You") => {
  const mailjet = Client.apiConnect(process.env.MJ_APIKEY_PUBLIC!, process.env.MJ_APIKEY_PRIVATE!);
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "leon.merin@gmail.com",
          Name: "Reotem (Projet CYTech)",
        },
        To: [
          {
            Email: target,
            Name: username,
          },
        ],
        Subject: title,
        TextPart: description,
        HTMLPart: html,
      },
    ],
  });
  request
    .then(() => {
      logger(`Sent mail to ${target} about ${title}`);
      // logger(result.body);
    })
    .catch((err: Error) => {
      logger("error");
      logger(JSON.stringify(err));
    });
};
