const Subscribe = require('./promise').Subscribe;
const Agent1 = require('./promise').AgentDb;
const request = require('request');
const _ = require('lodash');
const validateAgentQueryText = require('../validation/agent');
const Payment = require('../models/payment');
const { verifyPayment } = require('../config/paystack')(request);
const Home = require('../controllers/home');

const Subscription = {
	async viewAllEmailSubscribers(req, res) {
		try {
			let Subscribers = await Subscribe.find();
			return res.status(200).json({
				dataCount: Object.keys(Subscribers).length,
				data: Subscribers,
			});
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async viewOneEmailSubscriber(req, res) {
		const { _id } = req.params;

		try {
			let Subscribers = await Subscribe.findOne({_id});
			return res.status(200).json({
				data: Subscribers,
			});
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async DeleteOneEmailSubscriber(req, res) {
		const { _id } = req.params;
		try {
			let Subscribers = await Subscribe.findOneAndDelete({_id});
			// data: `${Subscribers.email} successfully deleted`,
			// return res.status(200).json({
				// });
				req.flash('adminSuccess', 'Subscriber deleted successfully');
					return res.redirect('/admin/managesubscribers');
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async DeleteAllEmailSubscribers(req, res) {
		try {
			await Subscribe.drop();
			// return res.status(200).json({
			// 	data: `All subscribers successfully deleted`,
			// });
			req.flash('adminSuccess', 'All Subscribers deleted successfully');
					return res.redirect('/admin/managesubscribers');
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async create_agent(req, res) {
		const { errors, isValid } = validateAgentQueryText(req.body);

		// Check Validation
		if (!isValid) {
			return res.status(400).json(errors);
		}

		const queryText = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			phone_number: req.body.phone_number,
			rate: 0,
			totalRate: 0,
			totalPeople: 0,
		};
		try {
			let createdAgent = await Agent1.create(queryText);
			return res.status(200).json({
				status: 'success',
				message: createdAgent,
			});
		} catch (error) {
			return res.status(500).send(error);
		}
	},

	async rateAnAgent(req, res) {
		const { _id } = req.params;
		const { rate } = req.body;

		try {
			let Agent = await Agent1.findOne({ _id: _id });
			if (Agent != undefined) {
				const totalRate = parseInt(Agent.totalRate, 10);
				const totalPeople = parseInt(Agent.totalPeople, 10);
				const rateNumber = parseInt(rate, 10);

				const newTotalRate = totalRate + rateNumber;
				const presentTotalPeople = totalPeople + 1;
				const presentRate = newTotalRate / presentTotalPeople;
				const presentRate1 = Math.round(presentRate);

				const data = {
					first_name: Agent.first_name,
					last_name: Agent.last_name,
					email: Agent.email,
					phone_number: Agent.phone_number,
					rate: presentRate1,
					totalRate: newTotalRate,
					totalPeople: presentTotalPeople,
				};
				await Agent1.findOneAndUpdate(Agent._id, data);
				return res.status(200).json({
					status: 'success',
					message: 'Thank you for your rating',
				});
			} else {
				return res.status(400).json({
					status: 'error',
					message: `Such agent does not exist`,
				});
			}
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async get_all_agents(req, res) {
		try {
			let Agents = await Agent1.find();
			return res.status(200).json({
				dataCount: Object.keys(Agents).length,
				data: Agents,
			});
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async get_one_agent(req, res) {
		const { _id } = req.params;
		try {
			let AgentOne = await Agent1.findOne({_id});
			return res.status(200).json({
				data: AgentOne,
			});
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async DeleteOneAgent(req, res) {
		const { _id } = req.params;
		try {
			let Agnt = await Agent1.findOneAndDelete({ _id: _id });
			// return res.status(200).json({
			// 	data: `${Agnt.first_name} ${Agnt.last_name} successfully deleted`,
			// });
			req.flash('adminSuccess', 'Agent deleted Successfully');
					return res.redirect('/admin/manageagents');
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async DeleteAllAgents(req, res) {
		try {
			// await Agent1.remove();
			await Agent1.drop();
			// return res.status(200).json({
			// 	data: `All agents successfully deleted`,
			// });
			req.flash('adminSuccess', 'All Agents deleted Successfully');
					return res.redirect('/admin/manageagents');
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async savePayment(req, res) {
		const ref = req.query.reference;
		verifyPayment(ref, (error, body) => {
			if (error) {
				req.flash('paymentError', 'Payment not successful, Something went wrong');
				return res.redirect('/');
			}
			response = JSON.parse(body);

			const data = _.at(response.data, ['reference', 'amount', 'customer.email']);

			[reference, amount, email] = data;
			created_At = new Date();

			newPayment = { reference, amount, email, created_At };

			const payment = new Payment(newPayment);

			payment
				.save()
				.then(payment => {
					if (!payment) {
						return res.status(500).json({
							status: 'no payment made',
							message: 'error',
						});
					}
					res.redirect('/receipt/' + payment._id);
				})
				.catch(error => {
					return res.status(500).json(error);
				});
		});
	},

	async redirect(req, res) {
		const id = req.params.id;
		Payment.findById(id)
			.then(payment => {
				if (!payment) {
					req.flash('paymentError', 'Payment not successful');
					return res.redirect('/');
				} else {
					req.flash('payment', 'Payment successful, Please kindly fill the form below to continue');
					return res.redirect('/applicant');
				}
			})
			.catch(e => {
				return res.status(500).json(e);
			});
	},

	async view_all_payments(req, res) {
		try {
			let Payments = await Payment.find();
			return res.status(200).json({
				dataCount: Object.keys(Payments).length,
				data: Payments,
			});
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async view_one_payment(req, res) {
		const { _id } = req.params;
		try {
			let Payment1 = await Payment.findOne({_id});
			return res.status(200).json({
				data: Payment1,
			});
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async deleteOnePayment(req, res) {
		const { _id } = req.params;
		try {
			let Payment1 = await Payment.findOneAndDelete({ _id: _id });
			// return res.status(200).json({
			// 	data: `${Payment1.email} and related data successfully deleted`,
			// });
			req.flash('adminSuccess', 'Payment deleted Successfully');
				return res.redirect('/admin/manage_payments');
		} catch (error) {
			return res.status(500).json(error);
		}
	},

	async deleteAllPayments(req, res) {
		try {
			// await Payment.remove();
			await Payment.drop();
			// return res.status(200).json({
			// 	data: `All payments successfully deleted`,
			// });
			req.flash('adminSuccess', 'All Payments deleted Successfully');
					return res.redirect('/admin/manage_payments');
		} catch (error) {
			return res.status(500).json(error);
		}
	},
};

module.exports = Subscription;
