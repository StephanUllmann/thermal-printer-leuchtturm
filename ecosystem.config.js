module.exports = {
  apps: [
    {
      name: 'leuchtturm-kellner-build',
      cwd: './leuchtturm-kellner',
      script: 'npm',
      args: 'run build',
      autorestart: false,
    },
    {
      name: 'leuchtturm-kellner-serve',
      cwd: './leuchtturm-kellner/dist',
      script: 'pm2',
      args: 'serve . 8080 --spa',
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
