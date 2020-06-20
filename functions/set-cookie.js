const cookie = require('cookie');

exports.handler = async (event) => {
  const { token } = JSON.parse(event.body);

  const netlifyCookie = cookie.serialize('nf_jwt', token, {
    secure: true,
    path: '/',
    maxAge: 14 * 24 * 3600000,
  });

  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': netlifyCookie,
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({ token }),
  };
};
