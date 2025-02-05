import * as controller from "../controller";
import express from "express";
import verifyToken from "../middlewares/verify_token";
import { isCreatorOrAdmin } from "../middlewares/verify_roles";
import uploadCloud from "../middlewares/uploader";

const router = express.Router();

router.get("/", controller.getBooks);

router.use(verifyToken);
router.use(isCreatorOrAdmin);

router.post("/", uploadCloud.single("image"), controller.createBooks);
router.put("/", uploadCloud.single("image"), controller.updateBooks);
router.delete("/", uploadCloud.single("image"), controller.deleteBooks);

module.exports = router;
