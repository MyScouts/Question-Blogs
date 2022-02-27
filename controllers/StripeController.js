const stripe = require('stripe')('sk_test_51KXd5uAbGeXCC4Fy2GHqFgTP8nTnnG7ynTU8E3WEM6N6Wv7fg5XnjrVZo5hVsB2PfktxX0nGrkxQtXYgN0xNdI6x00rS8oDyqn');

const createCustomer = async (email) => {
    const customer = await stripe.customers.create({
        email: email,
        description: ""
    });
    return customer.id;
}

const createPaymentMethod = async (customerId, paymentInfo) => {
    const { number, expMonth, expYear, cvc, name } = paymentInfo;

    const input = {
        type: 'card',
        // customer: customerId,
        card: {
            number: number,
            exp_month: expMonth,
            exp_year: expYear,
            cvc: cvc,
        },
        billing_details: {
            name: name,
        },
    }

    const paymentMethod = await stripe.paymentMethods.create(input);
    await stripe.paymentMethods.attach(paymentMethod.id, { customer: customerId });
    return paymentMethod.id;
}

const checkOutMethod = async (customerId, paymentMethodId) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: '',
        cancel_url: '',
    });
}


module.exports = {
    createCustomer,
    createPaymentMethod
}