module.exports = {
  apps: [
    {
      name: 'leuchtturm-kellner-dev',
      cwd: './leuchtturm-kellner',
      script: 'npm',
      args: 'run dev',
      autorestart: true,
    },
    {
      name: 'leuchtturm-waerter-dev',
      cwd: './leuchtturm-waerter',
      script: 'npm',
      args: 'run dev',
      autorestart: true,
    },
  ],
};
