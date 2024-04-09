import jwt from "jsonwebtoken";
const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY;

export class Auth {
    static async authenticate(req: any, res: any, next: any) {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

            if (!token) {
                return res.code(404).send({
                    message: "Token not found",
                })
            }


            jwt.verify(token, JWT_SECRET_KEY, (err: any, userDetails: any) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return res.code(401).send({
                            message: "Token has expired,please login again",
                        });
                    } else {
                        return res.code(400).send({
                            message: "Error occurred in JWT authentication...",
                            error: err,
                        });
                    }
                }
                
                req.user = {
                    userId: userDetails.userId,
                    token,
                  };
                  next();
            })
        } catch (error) {
            console.log(error);
        }
    }
}