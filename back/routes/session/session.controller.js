const { deleteSession, getSession, createSession } = require("./session.service");

const Router = require("express").Router;

const router = Router();

router.get('/:id', async (req, res, next) => {
    try {
        console.log(`getting sessions ${req.params.id}`)
        const session = getSession(req.params.id);
        if (session != undefined) {
            res.status(200).json({ session: session });
        } else {
            res.status(404);
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        console.log(`creating sessions ${req.body.id}`); // expect id and an optional hash
        const session = createSession(req.body.id, req.body.hash);
        res.status(201).json({ ...session });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        console.log(`deleting session ${req.params.id}`);
        deleteSession(req.params.id);
        res.status(200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;