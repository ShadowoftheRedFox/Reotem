require('dotenv').config();

const template = {
    validate: (username, token) => {
        return `<h3>${username} ,vérifiez votre adresse mail.</h3>
<p>Cliquez sur le lien suivant pour valider votre adresse email.</p>
<a href="${process.env.FRONT_URL}connection/validating/${token}" target="_blank">Vérifiez</a>
<p>Si vous n'êtes pas le destinataire de ce message, veuillez l'ignorer.</p>
<p>Ne donnez jamais vos informations personnelles. Nous ne vous demanderons jamais vos données personnelles, tel que vos numéros de carte bancaire, mot de passes, lieu de résidance, RIB...</p>
`;
    }
}

const sendMail = (target, title, description, html, username = "You") => {
    const mailjet = require('node-mailjet').Client.apiConnect(
        process.env.MJ_APIKEY_PUBLIC,
        process.env.MJ_APIKEY_PRIVATE
    )
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
    })
    request
        .then(result => {
            console.log(`Sent mail to ${target} about ${title}`);
            // console.log(result.body);
        })
        .catch(err => {
            console.log("error");
            console.log(err);
        })
}

module.exports = { sendMail, template };