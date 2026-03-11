const language = (req, res, next) => {
    res.locals.locale = req.headers["accept-language"]?.split(",")[0] || "fr-TG";
    next();
}

export default language;