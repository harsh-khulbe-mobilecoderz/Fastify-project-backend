import { UserController } from "../controllers/user.controller";
import { Auth } from "../middlewares/auth.middleware";

async function userRoutes(router:any, options:any) {
    //Create user
    router.post('/create-user', UserController.createUser);
    //Get all users
    router.get('/',UserController.getAllUsers);
    //Get a single user
    router.get("/:id",UserController.getASingleUser);
    //Update a user
    router.put("/",{preHandler:Auth.authenticate},UserController.updateUser);
    //Delete a user
    router.delete("/:id",{preHandler:Auth.authenticate},UserController.deleteUser);
    //user login 
    router.post("/login",UserController.loginUser);
    //user logout
    router.post("/logout",{preHandler:Auth.authenticate},UserController.logoutUser);
}
  
export default userRoutes;