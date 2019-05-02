const paystack = request => {
	const PAYSTACK_SECRET_KEY = `Bearer ${process.env.PAYSTACK_SECRET_KEY}`;

	const verifyPayment = (ref, mycallback) => {
		const options = {
			url: 'https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref),
			headers: {
				authorization: PAYSTACK_SECRET_KEY,
				'content-type': 'application/json',
				'cache-control': 'no-cache',
			},
		};
		const callback = (error, response, body) => {
			return mycallback(error, body);
		};
		request(options, callback);
	};

	return { verifyPayment };
};

module.exports = paystack;
