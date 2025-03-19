// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

import { Client } from "node-mailjet"

export const template = {
    // a span in the url to trick the gmail parser
    validate: (username: string, token: string) => {
        return `<h3>${username} ,vérifiez votre adresse mail.</h3>
<p>Cliquez sur le lien suivant pour valider votre adresse email.</p>
<a href="${process.env.FRONT_URL}<span>connection/validating/${token}</span>" target="_blank">Vérifiez</a>
<p>Si vous n'êtes pas le destinataire de ce message, veuillez l'ignorer.</p>
<p>Ne donnez jamais vos informations personnelles. Nous ne vous demanderons jamais vos données personnelles, tel que vos numéros de carte bancaire, mot de passes, lieu de résidance, RIB...</p>
`;
    }
};

export const sendMail = (target: string, title: string, description: string, html: string, username = "You") => {
    const mailjet = Client.apiConnect(
        process.env.MJ_APIKEY_PUBLIC!,
        process.env.MJ_APIKEY_PRIVATE!
    );
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: 'leon.merin@gmail.com',
                    Name: 'Reotem (Projet CYTech)',
                },
                To: [
                    {
                        Email: target,
                        Name: username,
                    },
                ],
                Subject: title,
                TextPart: description,
                HTMLPart: html
            },
        ],
    });
    request
        .then(() => {
            console.log(`Sent mail to ${target} about ${title}`);
            // console.log(result.body);
        })
        .catch((err: Error) => {
            console.log("error");
            console.log(err);
        });
};