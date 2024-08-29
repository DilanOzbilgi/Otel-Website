const express = require("express");
const Models = require("../models");
const bcrypt = require("bcrypt");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Img = Models.img;
const Site = Models.siteDetay;
const User = Models.user;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./public/img"; // Dinamik klasör belirleme
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Orijinal dosya adını kullan
  },
});

const upload = multer({ storage: storage });

exports.getAdminPage = async (req, res, next) => {
  res.render("adminPage");
};

exports.postAdminPage = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);

    const user = await User.findOne({ where: { user_name: username } });
    if (user === null) {
      console.log("User not found");
      return res.redirect("/admin"); // Kullanıcı bulunamazsa giriş sayfasına yönlendir
    }

    const password_valid = await bcrypt.compare(password, user.password);
    console.log(password_valid);

    if (password_valid) {
      const token = jwt.sign(
        { username: user.user_name },
        "hashsadgfhsadhjgfa",
        {
          expiresIn: "1d",
        }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      const siteDetay = await Site.findOne({ where: { id: 1 } });
      console.log(siteDetay);
      siteDetay.online = siteDetay.online + 1;
      await siteDetay.save();
      return res.send(`
                <script>
                var confirmation = confirm("Giriş işlemi başarılı. Kullanıcı sayfasına yönlendiriliyorsunuz.");
                if (confirmation) {
                    window.location.href = "/admin/upload";
                } else {
                    setTimeout(function(){
                        window.location.href = "/admin/upload";
                    }, 3000); // 3 saniye bekledikten sonra yönlendirme yapılıyor
                }
                </script>
            `);
    } else {
      console.log("Invalid password");
      return res.redirect("/admin"); // Parola yanlışsa giriş sayfasına yönlendir
    }
  } catch (error) {
    console.error(error);
    return res.redirect("/admin"); // Hata durumunda giriş sayfasına yönlendir
  }
};

exports.getUploadPage = async (req, res, next) => {
  const images = await Img.findAll();
  res.render("upload", { images: images });
};

exports.postUploadPage = async (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(500).send("Error uploading file.");
    }
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.send(
      `File uploaded successfully: <a href="/${req.body.uploadDir}/${req.file.filename}">${req.file.filename}</a>`
    );
    const img = {
      img_url: `../static/img/${req.file.filename}`,
    };
    const imgUpload = Img.create(img);
  });
};

exports.postDeleteImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const img = await Img.findByPk(id);
    if (img) {
      await img.destroy();
      console.log("Database record deleted successfully");
    }
    res.redirect("/admin/delete-images");
  } catch (error) {
    console.error("Error deleting image record:", error);
    res.status(500).send("Error deleting image record.");
  }
};

exports.getDeleteImagesPage = async (req, res, next) => {
  const images = await Img.findAll();
  res.render("delete", { images: images });
};

exports.postRegisterPage = async function (req, res, next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const usr = {
      user_name: "dilan",
      password: await bcrypt.hash("dilan123", salt),
    };
    const created_user = await User.create(usr);
    res.status(201).json(created_user);
  } catch (error) {
    let errors2 = {};
    if (error.name === "SequelizeValidationError") {
      Object.keys(error.errors).forEach((a) => {
        errors2[error.errors[a].path] = error.errors[a].message;
      });
    }
    console.log(errors2);
    res.status(400).json(errors2);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('jwt'); // JWT çerezini temizleyin
  res.redirect('/'); // Ana sayfaya yönlendirin
};
