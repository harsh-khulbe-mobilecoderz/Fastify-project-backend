import User from "../models/user.model";
import jwt from "jsonwebtoken";
const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY;

export class UserController {

    static async createUser(request: any, reply: any) {
        try {
            const { name, email, password } = request.body;

            if (!name || !email || !password) {
                return reply.code(400).send({
                    message: "All fields are required",
                })
            }

            const user = await User.findOne({ email });

            if (user) {
                return reply.code(404).send({
                    message: "Cannot create same user multiple times",
                })
            }

            const userData = await User.create({ name, email, password });

            return reply.code(201).send({
                message: "User created successfully",
                userData,
            })

        } catch (error) {
            console.log(error);
        }

    }

    static async getAllUsers(request: any, reply: any) {
        try {
            const users = await User.find();
            if (!users) {
                return reply.code(400).send({
                    message: "Users not found",
                })
            }

            return reply.code(200).send({
                message: "Users found successfully",
                users,
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async getASingleUser(request: any, reply: any) {
        try {
            const userId = request.params.id;
            const user = await User.findOne({ _id: userId });

            if (!user) {
                return reply.code(404).send({
                    message: "User not found",
                })
            }

            return reply.code(200).send({
                message: "User found successfully",
                user,
            })
        } catch (error) {
            console.log(error);
        }
    }


    static async updateUser(request: any, reply: any) {
        try {
            const user = request.user;
            const { name, email, password } = request.body;
            if (!user?.userId || !user?.token) {
                return reply.code(401).send({
                  message: "Unauthorized access: Missing or invalid token",
                });
            }

            const userInDatabase = await User.findOne({_id:user.userId});
            if(!userInDatabase?.token) {
                return reply.code(400).send({
                    message:"User is logged out, please login first...",
                })
            }

            const decodedToken = jwt.verify(user.token, JWT_SECRET_KEY, { complete: true });
        
            if(!decodedToken) {
                return reply.code(401).send({
                    message:"Provide token is wrong or expired",
                })
            }
            const updatedUser = await User.findByIdAndUpdate(user.userId, { name, email, password }, { new: true });

            if(!updatedUser) {
                return reply.code(400).send({
                    message:"Can't update the user",
                })
            }
            return reply.code(200).send({
                message: "User updated successfully",
                updatedUser,
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteUser(request: any, reply: any) {
        try {
            const user = request.user;

            if (!user?.userId || !user?.token) {
                return reply.code(401).send({
                  message: "Unauthorized access: Missing or invalid token",
                });
            }
            const userInDatabase = await User.findOne({_id:user.userId});
            if(!userInDatabase?.token) {
                return reply.code(400).send({
                    message:"User is logged out, please login first...",
                })
            }

            jwt.verify(user.token, JWT_SECRET_KEY, { complete: true });

            const deletedUser = await User.findByIdAndDelete(user.userId);

            if (!deletedUser) {
                return reply.code(400).send({
                    message: "Can't delete the user"
                })
            }

            return reply.code(200).send({
                message: "User deleted successfully",
                deletedUser,
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async loginUser(request: any, reply: any) {
        try {
            const { email, password } = request.body;

            const user = await User.findOne({ email });
            if (!user) {
                return reply.code(404).send({
                    message: "User not found,please register/create the user first",
                })
            }

            if (password !== user.password) {
                return reply.code(400).send({
                    message: "Wrong Password",
                })
            }
            const token = jwt.sign({ userId: user.id}, JWT_SECRET_KEY, { expiresIn: '30d' })
            await User.findOneAndUpdate({ email }, { token })
            return reply.code(200).send({
                message: "User successfully logged in...",
                token,
            })

        } catch (error) {
            console.log(error);
        }
    }

    static async logoutUser(request: any, reply: any) {
        try {
            // const {userId} = request.user;
            const userId = request.user.userId;
            console.log(request.user.userId);
            const user = await User.findOne({_id:userId});
            if (!user) {
                return reply.code(404).send({
                    message: "User not found or not logged in..."
                })
            }
            // await User.findByIdAndUpdate(userId, { token: '' });
            const updatedUserData = await User.findByIdAndUpdate(userId, { $unset: { token: '' } });
            if(updatedUserData) {
                return reply.code(200).send({
                    message:"User is successfully logged out...",
                })
            }
            

        } catch (error) {
            console.log(error);
        }

    }
}
