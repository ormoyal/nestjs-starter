// import express from "express";
// import {isAuthenticated} from "./../middleware/passport";

// import * as user from "./../controllers/user";
// import { validator, validSearch } from "./../middleware/validate";

// const userR = express.Router();

// userR.post("/login", 
//     validator(["phone", "password"]),
//     user.login);

// userR.post("/",
//     validator(["email","name","password","phone","roles", "products"]),
//     user.create);
 
// userR.get("/",
//     validSearch(["id","roles", "deleted"]),
//     user.read);

// userR.patch("/:id",
//     validator(["id","email","name","phone","roles", "products"]),
//     user.update);

// userR.patch("/",
//     validator(["email","name","phone"]),
//     user.update_self);
    
// userR.get("/check",
//     user.check);
    
// userR.delete("/:id",
//     validator(["id"]),
//     user.softDelete);
    
// userR.post("/changePassword",
//     validator(["phone","password","newPassword","confirmPassword"]),
//     user.changePassword);
    
// userR.post("/forgetPassword/:id",
//     validator(["id","password"]),
//     user.forgetPassword);




// export {
//     userR,
// };