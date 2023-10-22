const Habit = require('../models/Habit');
const User = require('../models/User');
const emailScheduler = require('../utils/emailScheduler'); 

let htmlString = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Your Custom Font', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
        }
        .header {
            background-color: #3498db;
            color: #ffffff;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
            text-align: left;
        }
        .content {
            padding: 20px;
            text-align: left;
        }
        .greeting {
            font-size: 20px;
            font-weight: bold;
        }
        .quote {
            font-style: italic;
            margin: 20px 0;
        }
        .motivation {
            color: #3498db;
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Got a Minute?
        </div>
        <div class="content">
            <p class="greeting">Hello, {{firstName}}!</p>
            <p>Here's a little reminder to help you stay motivated in developing your habit: {{habitTitle}}.</p>
            <p class="quote"><em>"The journey of a thousand miles begins with a single step." - Lao Tzu</em></p>
            <p class="motivation">Take that first step today, and you'll be one step closer to achieving your goals.</p>
            <p>Best regards,<br>Your Habit Development Team</p>
        </div>
    </div>
</body>
</html>
`;

function generateEmailContent(firstName, lastName, title) {
    return htmlString
        .replace('{{firstName}}', firstName)
        .replace('{{lastName}}', lastName)
        .replace('{{habitTitle}}', title);
}


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
        console.log(req.body);
        const { title, achievementDate, interval } = req.body;

        const habit = await Habit.findOne({ title, user: userID });

        if (habit) {
            return res.status(400).send('Habit already exists');
        }
        newString = generateEmailContent(user.firstName, user.lastName, title);
        const content = {
            subject: 'HabitLeaf: Your Personalized Habit Reminder is Here!',
            text: `Reminder to complete habit: ${title}`,
            html: newString,
            context: {
                firstName: user.firstName,
                habitTitle: title,
                lastName: user.lastName,
            }
        };
        
        const newHabit = new Habit({
            title,
            achievementDate,
            interval,
            user: userID,
        });

        await newHabit.save();
        const job = emailScheduler.scheduleEmail(interval.type, interval.number, email, content);

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