const Habit = require('../models/Habit');
const User = require('../models/User');

exports.getHabits = async (req, res) => {
    try {
        const email = req.session.email;
        const user = await User.findOne({ email });
        const userID = user._id;

        const habits = await Habit.find({ user: userID }, { user: 0 });
        res.status(200).json(habits);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
};

exports.createHabit = async (req, res) => {
    try {
        const email = req.session.email;
        const user = await User.findOne({ email });
        const userID = user._id;
        const { title, achievementDate, interval } = req.body;

        const habit = await Habit.findOne({ title, user: userID });

        if (habit) {
            return res.status(400).send('Habit already exists');
        }

        const newHabit = new Habit({
            title,
            achievementDate,
            interval,
            user: userID,
        });

        await newHabit.save();

        res.status(201).send('Habit created');
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
};

exports.deleteHabit = async (req, res) => {
    try {
        const email = req.session.email;
        const user = await User.findOne({ email });
        const userID = user._id;
        const habitID = req.params.habitID;

        const habit = await Habit.deleteOne({ user: userID, _id: habitID });

        res.status(200).send('Habit deleted');
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
};

exports.updateHabit = async (req, res) => {
    try {
        const email = req.session.email;
        const user = await User.findOne({ email });
        const userID = user._id;
        const habitID = req.params.habitID;
        const { title, achievementDate, interval } = req.body;

        const habit = await Habit.updateOne(
        { user: userID, _id: habitID },
        { title, achievementDate, interval }
        );

        res.status(200).send('Habit updated');
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
};