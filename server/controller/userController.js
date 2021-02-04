const { User } = require('../models/index')
const { comparePass } = require('../helper/bcrypt')
const { generateToken } = require('../helper/jwt')
const {OAuth2Client} = require('google-auth-library');

class userController {
	static register(req, res, next) {
		let newUser = {
			email: req.body.email,
			password: req.body.password
		}
		User.create(newUser)
		.then(user => {
			res.status(201).json(user)
		})
		.catch( err=> {
			next(err)
			//console.log(err.constructor.name);
			//const error = err.errors[0].message || 'Internal server error'
			//res.status(400).json({ error })
		})
	}

	static login (req, res, next) {
		User.findOne({
			where: {
				email: req.body.email
			}
		})
		.then(user => {
			if(!user) throw {msg: "invalid email or password!" }
			const comparedpassword = comparePass(req.body.password, user.password)
			if (!comparedpassword) throw {msg: "invalid email or password!" }
			const token = generateToken({
				id: user.id,
				email: user.email
			})
			res.status(200).json({ token })
		})
		.catch(err => {
			//console.log(err);
			next(err)
			// const error = err.msg || 'Internal server error'
			// res.status(400).json({error})
		})
	}

	static googleLogin(req,res,next) {
		const client = new OAuth2Client(process.env.CLIENT_ID);
		let email = ''
		client.verifyIdToken({
			idToken : req.body.googleToken,
			audience: process.env.CLIENT_ID
		})
		.then(ticket => {
			const payload = ticket.getPayload()
			email = payload.email

			return User.findOne( { where: {email:email}})
		})
		.then(user => {
			if (user) {
				//generate token
				const token = generateToken({
					id: user.id,
					email: user.email
				})
				res.status(200).json({token:token})
			} else {
				return User.create({
					email: email,
					password: '123456'
				})
			}
		})
		.then(registeredUser => {
			const token = generateToken({
				id: registeredUser.id,
				email: registeredUser.email
			})
			res.status(201).json({token:token})
		})
		.catch(err=>{
			console.log(err);
		})
	}
}

module.exports = userController