exports.handler = async (_event, context) => {
  const { user } = context.clientContext;
  const roles = user.app_metadata.roles;

  if (!roles || !roles.includes('sub:pro')) {
    return {
      statusCode: 402,
      body: JSON.stringify({
        src:
          'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto/v1592618179/stripe-subscription/subscription-required.jpg',
        alt: 'corgi in a crossed circle with the text “subscription required”',
        credit: 'Jason Lengstorf',
        creditLink: 'https://dribbble.com/jlengstorf',
        message: 'This content requires a pro subscription or higher.',
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      src:
        'https://images.unsplash.com/photo-1519098901909-b1553a1190af?auto=format&fit=crop&w=600&h=600&q=80',
      alt: 'close-up of a corgi with its tongue hanging out',
      credit: 'Florencia Potter',
      creditLink: 'https://unsplash.com/photos/yxmNWxi3wCo',
      message:
        'This is protected content! It’s only available if you have the pro plan or higher.',
    }),
  };
};
