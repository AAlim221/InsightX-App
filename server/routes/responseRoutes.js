const express = require("express");
const { submitResponse, getResponsesByFormId } = require("../controllers/responseController");

//router object
const router = express.Router();

//routes
router.post("/submitResponse", submitResponse);

router.get("/form/:formId", getResponsesByFormId);

module.exports = router;
