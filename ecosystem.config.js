module.exports = {
  apps: [
    {
      name: 'leuchtturm-kellner-serve',
      cwd: '.',
      script: 'npm',
      args: 'run serve',
      autorestart: true,
    },
    {
      name: 'leuchtturm-waerter',
      cwd: './leuchtturm-waerter',
      script: 'npm',
      args: 'run start',
      autorestart: true,
    },
  ],
};
