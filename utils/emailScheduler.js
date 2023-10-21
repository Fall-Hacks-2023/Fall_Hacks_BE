const sgMail = require('@sendgrid/mail');
const cron = require('node-cron');
require('dotenv').config();
console.log(process.env.SENDGRID_API_KEY)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function scheduleEmail(intervalType, intervalValue, emailAddress, emailContent) {
    const currentDate = new Date();
    const minutes = currentDate.getMinutes();
    const hours = currentDate.getHours();

    const convertIntervalToCron = (type, value) => {
        switch (type) {
            case 'minutes':
                // Every X minutes
                return `*/${value} * * * *`;
            case 'days':
                // 1 minute after the current time every X days
                return `${minutes} ${hours} */${value} * *`;
            case 'weeks':
                // 1 minute after the current time every X weeks on a specific day
                return `${minutes} ${hours} * * 0`;
            case 'months':
                // 1 minute after the current time on the 1st day of every X months
                return `${minutes} ${hours} 1 */${value} *`;
            default:
                throw new Error('Invalid interval type provided');
        }
    };

    const cronPattern = convertIntervalToCron(intervalType, intervalValue);

    const job = cron.schedule(cronPattern, async function() {
        const msg = {
            to: emailAddress,
            from: 'manvir_heer@sfu.ca',
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html,
        };

        await sgMail.send(msg).then(() => {
            console.log(`Email scheduled successfully for ${emailAddress}`);
        }
        ).catch(error => {
            console.dir(error, { depth: 5 });

         
        });
    });

    return job;
}

function cancelEmail(job) {
    job.destroy();
}

module.exports = {
    scheduleEmail,
    cancelEmail
};
