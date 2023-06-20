import {Router} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {auth} from "../middlewares/auth";
import {User} from "../models/schemas/user.model";
import {Product} from "../models/schemas/product.model";

const router = Router();

router.use('/product', auth);
router.post('/user/register', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (!user) {
            const passwordHash = await bcrypt.hash(req.body.password, 10);
            let userData = {
                username: req.body.username,
                password: passwordHash
            };
            const newUser = await User.create(userData);
            res.json({user: newUser, code: 200});
        } else {
            res.json({err: 'User existed!'});
        }
    } catch (err) {
        res.json({err: err});
    }
});
router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (user) {
            const comparePass = await bcrypt.compare(req.body.password, user.password);
            if (!comparePass) {
                return Promise.reject({
                    code: 404,
                    message: 'PASSWORD_NOT_VALID',
                });
            }
            let payload = {
                user_id: user['id'],
                username: user['username']
            }
            const token = jwt.sign(payload, '123456789', {
                expiresIn: 36000,
            });
            return res.json({token: token, code: 200});
        } else {
            return res.json({err: 'Email has not been registered!'});
        }
    } catch (err) {
        return res.json({err: err});
    }
});
router.post('/product/create', async (req, res) => {
    try {
        const product = await Product.findOne({name: req.body.name});
        if (!product) {
            let productData = {
                name: req.body.name,
                price: req.body.price,
                category: req.body.category
            };
            const newProduct = await Product.create(productData);
            res.json({product: newProduct, code: 200});
        } else {
            res.json({err: 'Product existed!'});
        }
    } catch (err) {
        res.json({err: err});
    }
});

export default router;