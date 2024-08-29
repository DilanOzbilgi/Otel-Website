var express = require("express");
var router = express.Router();


var adminPageController = require("../controller/adminPageController");
const authMiddleware = require("../milddleware/authMid");

router.get("/", adminPageController.getAdminPage);
router.post("/", adminPageController.postAdminPage);
router.get(
  "/upload",
  authMiddleware.authToken,
  adminPageController.getUploadPage
);
router.post(
  "/upload",
  authMiddleware.authToken,
  adminPageController.postUploadPage
);
router.post(
  "/delete/:id",
  authMiddleware.authToken,
  adminPageController.postDeleteImage
);
router.get('/logout', adminPageController.logout);
router.get('/delete-images', authMiddleware.authToken, adminPageController.getDeleteImagesPage);
//router.get('/dilan',adminPageController.postRegisterPage); Admin paneli için bir kullanıcı oluştur.
module.exports = router;
