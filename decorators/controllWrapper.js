const controlWrapper = ctrl => {
    const func = async (req, res, next) => {
        try{
            await ctrl(req, res, next);
        }
        catch (e) {
            next(e);
        }
    }
    return func;
}

module.exports = controlWrapper;