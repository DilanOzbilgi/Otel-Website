const { where } = require('sequelize');
const Models = require('../models');
const img = Models.img;
const Site = Models.siteDetay;

var Visitor = 10;
exports.getHomePage = async (req, res,next) => {

    //const images = await img.create({img_url:"../static/img/normalReg.png"});
    const images = await img.findAll();
    const siteDetay = await Site.findOne({where:{id:1}})
    console.log(siteDetay);
    siteDetay.visitor = siteDetay.visitor + 1;
    siteDetay.save();
    var a = siteDetay.visitor
    var b = siteDetay.online
    res.render('index',{images,a,b});
}
