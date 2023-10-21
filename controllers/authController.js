const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.getUser = async (req, res, next) => {
    try {
        console.log('getUser');
        console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).send('Missing email or password');
        }

        res.user = await User.findOne({ email: email });

        next();
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }
}

exports.signup = async (req, res) => {
    try {
        const user = res.user;
        const firstName   = req.body.firstName;
        const lastName    = req.body.lastName;
        const age = req.body.age;
        const joinDate = new Date();
        const points = 0;
        const email = req.body.email;
        const password = req.body.password;

        if (user) {
            return res.status(409).send('User already exists');
        }

        if (!firstName || !lastName || !age || !email || !password) {
            return res.status(400).send('Missing fields');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            email: email,
            firstName: firstName,
            lastName: lastName,
            age: age,
            joinDate: joinDate,
            points: points,
            password: hashedPassword,
        });
        
        req.session.email = email;
        return res.status(201).send('User created');

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }
}

exports.login = async (req, res)  => {
    try {
        const user = res.user;
        const email = req.body.email;
        const password = req.body.password;

        if (!user) {
            return res.status(404).send('User does not exist');
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).send('Incorrect password');
        }

        req.session.email = email;
        req.session.save();

        return res.status(200).json({ user: { email: req.session.email } });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }
}

exports.getLoginStatus = async (req, res) => {
    try {
        if (!req.session.email) {
            return res.status(401).send('Unauthorized');
        }

        console.log(req.session.email);
        const user = await User.findOne({ email: req.session.email }, { password: 0 });

        if (!user) {
            return res.status(404).send('User not found');
        }

        return res.status(200).json({ user });

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }
};


exports.logout = (req, res) => {
    try {
        req.session.destroy();
        return res.status(200).send('Successfully logged out');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
}

exports.checkLoggedIn = (req, res, next) => {
    try {
        if (req.session.email) {
            next();
        } else {
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }
}
