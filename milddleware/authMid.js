const jwt = require("jsonwebtoken")
const Models = require('./../models');
const User = Models.user;
exports.checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
  
    if (token) {
      jwt.verify(token, "hashsadgfhsadhjgfa", async (err, decodedToken) => {
        if (err) {
          
          res.locals.user = null;
          next();
        } else {
          const user = await User.findOne({ where : {username : decodedToken.username }});
          res.locals.user = user;
          next();
        }
      });
    


      



    } else {
      res.locals.user = null;
      next();
    }
  };
exports.authToken = async (req,res,next)=>{
    try{
       const token = req.cookies.jwt;
        if(token){
            jwt.verify(token,"hashsadgfhsadhjgfa",(err)=>{
                if(err){
                    
                    res.redirect("/admin");
                }else{
                    next();
                }
            });
        }else{
            res.redirect("/admin");
        }
    }catch(err){
        res.status(401).json({
            succ:false,
            err:"not auth"
        });
    }
}
