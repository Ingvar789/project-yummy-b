const validateRequest = () => {
    const func = (req, res, next) => {
        let { instructions } = req.body;
        instructions = JSON.parse(instructions);
        const ingredients = JSON.parse(req.body.ingredients).map((i)=> JSON.parse(i));
        req.body = { ...req.body, instructions, ingredients };
        next();
    };
    return func;
};
module.exports = { validateRequest };