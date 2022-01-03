const bcrypt = require('bcryptjs');

const data = {
  users: [
    {
      firstName: 'Pablo',
      lastName: 'Pérez',
      email: 'pablo@example.com',
      password: bcrypt.hashSync('123456'),
      imageAvatar: 'https://i.pravatar.cc/500',
      isAdmin: true,
      isHosted: true,
      hosted: {
        name: 'Casa do Monte',
        logo: 'https://i.pravatar.cc/500',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor elementum faucibus. Etiam lacus est, ullamcorper sed ipsum sit amet, dapibus tristique diam. Morbi dignissim, justo at mattis consequat, elit tortor mollis risus, vel rutrum libero mauris vel arcu. Vivamus velit orci, varius non sagittis ac, pharetra in sem. Nullam eget scelerisque magna.',
        reviewStart: 3.75,
        reviewCount: 105,
        speakLanguages: ['Inglés, Francés, Español'],
      },
    },
    {
      firstName: 'María',
      lastName: 'Fernández',
      email: 'maria@example.com',
      password: bcrypt.hashSync('123456'),
      imageAvatar: 'https://i.pravatar.cc/500',
      isAdmin: false,
      isHosted: true,
      hosted: {
        name: 'Granja escuela El Pinar',
        logo: 'https://i.pravatar.cc/500',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor elementum faucibus. Etiam lacus est, ullamcorper sed ipsum sit amet, dapibus tristique diam. Morbi dignissim, justo at mattis consequat, elit tortor mollis risus, vel rutrum libero mauris vel arcu. Vivamus velit orci, varius non sagittis ac, pharetra in sem. Nullam eget scelerisque magna.',
        reviewStart: 4.99,
        reviewCount: 350,
        speakLanguages: ['Español'],
      },
    },
    {
      firstName: 'Berta',
      lastName: 'Casal',
      email: 'berta@example.com',
      password: bcrypt.hashSync('123456'),
      imageAvatar: 'https://i.pravatar.cc/500',
      isAdmin: false,
      isHosted: true,
      hosted: {
        name: 'NombreHosted',
        logo: 'LogoHosted',
        description: 'DescriptionHosted',
        reviewStart: 0,
        reviewCount: 0,
        speakLanguages: [],
      },
    },
  ],
};
module.exports = data;
