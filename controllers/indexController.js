exports.getHelloWorld = (req, res) =>  {
    res.send('Hello World');
}

exports.getErrorMessageTest = (req, res) => {
    throw new CustomError('This is a test error message', 402);
}