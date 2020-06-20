const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch = require('node-fetch');
const { faunaFetch } = require('./utils/fauna');

exports.handler = async ({ body, headers }, context) => {
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (stripeEvent.type === 'customer.subscription.updated') {
      const subscription = stripeEvent.data.object;

      const result = await faunaFetch({
        query: `
          query ($stripeID: ID!) {
            getUserByStripeID(stripeID: $stripeID) {
              netlifyID
            }
          }
        `,
        variables: {
          stripeID: subscription.customer,
        },
      });

      const { netlifyID } = result.data.getUserByStripeID;
      const { identity } = context.clientContext;
      const plan = subscription.items.data[0].plan.nickname;
      const role = `sub:${plan.split(' ')[0].toLowerCase()}`;

      await fetch(`${identity.url}/admin/users/${netlifyID}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${identity.token}`,
        },
        body: JSON.stringify({
          app_metadata: {
            authorization: {
              roles: [role],
            },
          },
        }),
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
};
