const Router = require("express").Router;
const { createUser } = require("./signup.service");

const router = Router();

router.get('/signup', async (req, res, next) => {
    try {
        console.log("creating user...")
        const user = await createUser({ ...req.query });
        res.status(201).json({ user: user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;