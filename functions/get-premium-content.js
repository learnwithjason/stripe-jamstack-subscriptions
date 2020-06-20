exports.handler = async (_event, context) => {
  const { user } = context.clientContext;
  const roles = user.app_metadata.roles;

  if (
    !roles ||
    (!roles.includes('sub:pro') && !roles.includes('sub:premium'))
  ) {
    return {
      statusCode: 402,
      body: JSON.stringify({
        src:
          'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto/v1592618179/stripe-subscription/subscription-required.jpg',
        alt: 'corgi in a crossed circle with the text “subscription required”',
        credit: 'Jason Lengstorf',
        creditLink: 'https://dribbble.com/jlengstorf',
        message: 'This content requires a premium subscription.',
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      src:
        'https://images.unsplash.com/photo-1546975490-e8b92a360b24?auto=format&fit=crop&w=600&h=600&q=80',
      alt: 'corgi in a tent with string lights in the foreground',
      credit: 'Cole Keister',
      creditLink: 'https://unsplash.com/photos/cX-KEISwDIw',
      message:
        'This is protected content! It’s only available if you have the premium plan.',
    }),
  };
};
