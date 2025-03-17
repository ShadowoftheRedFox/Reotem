const { deleteSession, getSession, createSession } = require("./session.service");

const Router = require("express").Router;

const router = Router();

router.get('/signin/:id', async (req, res, next) => {
    try {
        console.log(`getting sessions ${req.params.id}`);
        const session = getSession(req.params.id);

        if (session != undefined) {
            res.status(200).json(session);
        } else {
            res.status(404);
        }
    } catch (error) {
        next(error);
    }
});

/*
Test the route with a fetch: node ./testPost.js
*/

router.post('/signin', async (req, res, next) => {
    try {
        console.log(`creating sessions ${JSON.stringify(req.body)}`); // expect id and an optional hash
        const session = createSession(req.body.mail, req.body.hash);
        res.status(201).json({ ...session });
    } catch (error) {
        next(error);
    }
});

router.delete('/disconnect/:id', async (req, res, next) => {
    try {
        console.log(`deleting session ${req.params.id}`);
        deleteSession(req.params.id, req.body.session);
        res.status(200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;