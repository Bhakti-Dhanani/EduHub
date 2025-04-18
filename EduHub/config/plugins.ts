// E:/LMS/EduHub/config/plugins.js
module.exports = ({ env }) => ({
    'users-permissions': {
      enabled: true,
      config: {
        jwt: {
          expiresIn: '7d',
        },
      },
    },
  });