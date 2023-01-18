const { Router } = require("express");
const { methods: userControllers } = require("../controllers/users.controllers");
const { ensureAuth } = require("../middlewares/authenticated")
const router = Router();

router.get("/usuarios", ensureAuth, userControllers.getUsers)
router.post("/usuarios", userControllers.createUser)
router.post("/login", userControllers.validateUser)

module.exports = router;