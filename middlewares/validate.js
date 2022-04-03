// Uses Joi validator to validate request body
const validate = (validator) => (req, res, next) => {
	const { error } = validator(req.body);
	if (error) return res.status(400).send({ message: error.details[0].message });

	next();
};

export default validate;
