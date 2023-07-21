const validateRequest = () => {
    const func = (req, res, next) => {
        let { instructions, ingredients } = req.body;
        instructions = JSON.parse(instructions);
        ingredients = JSON.parse(ingredients);
        req.body = { ...req.body, instructions, ingredients };
        next();
    };
    return func;
};
module.exports = { validateRequest };