const jsonwebtoken=require("jsonwebtoken");

const authVerify = async(req, res, next) => {
    try{
        const header = req.headers.authorization;
        if (header == null){
            return res.status(420).json({
                message: "missing token",
                err: null,
            })
        }
        let token = header.split(" ")[1];
        const SECRET_KEY = "secretcode";

        let decodedtoken;
        try{
            decodedtoken= await jsonwebtoken.verify(token, SECRET_KEY);
        } catch(error){
            if(error instanceof jsonwebtoken.TokenExpiredError){
                return res.status(401).json({
                    message:"tokennya expired",
                    err:error,
                });
            }
            return res.status(401).json({
                message:"internal error",
                err:error,
            });
        }
    }
}