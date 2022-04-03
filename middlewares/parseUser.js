// Parses Google signin response profileObj
const parseUser = (req, res, next) => {
	let { profile, token: googleToken } = req.body;
	let {
		email,
		givenName: firstName,
		familyName: lastName,
		googleId,
		imageUrl,
	} = profile;

	req.body = { email, firstName, lastName, googleId, imageUrl };
	req.googleToken = googleToken;
	next();
};

export default parseUser;
