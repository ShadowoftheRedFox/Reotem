const Router = require("express").Router;
const { createUser, checkTokenExists, validateUser } = require("./signup.service");

const router = Router();

router.post('/signup', async (req, res, next) => {
    try {
        console.log("creating user...")
        const user = await createUser({ ...req.body });
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

router.post("/signup/token", async (req, res, next) => {
    try {
        console.log("Checking token exists");
        const exists = await checkTokenExists(req.body.token);
        res.status(200).json(exists);
    } catch (error) {
        next(error);
    }
});

router.post("/signup/validating", async (req, res, next) => {
    try {
        console.log("Validating token");
        const exists = await validateUser(req.body.token, req.body.session);
        res.status(200).json(exists);
    } catch (error) {
        next(error);
    }
});

module.exports = router;