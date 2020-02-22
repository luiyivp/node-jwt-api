import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
    // creating a new user
    const { username, email, password } = req.body;
    const user: IUser = new User({
        username,
        email,
        password
    });
    user.password = await user.encryptPassword(user.password);
    const newUser = await user.save();
    // token
    const token: string = jwt.sign(
        { id: newUser._id },
        process.env.TOKEN_SECRET || 'mysecrettoken'
    );
    res.header('auth-token', token).json(newUser);
};

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json('Invalid email or password');

    const isPasswordCorrect: boolean = await user.validatePassword(password);
    if (!isPasswordCorrect) return res.status(400).json('Invalid email or password');
    
    const token: string = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET || 'mysecrettoken', {
        expiresIn: 60 * 60
    });

    res.header('auth-token', token).json(user);
};

export const profile = async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json('User not found');
    res.json(user);
};
