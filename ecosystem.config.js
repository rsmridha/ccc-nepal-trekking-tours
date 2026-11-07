module.exports = {
  apps: [
    {
      name: "nnn-trekking-3200",
      script: "npm",
      args: "run dev",
      cwd: "/Volumes/Mac SSD - Data/Gitter/CCC/Project/Sohel Vai/Nepal Trekking Tours",
      env: {
        PORT: 3200,
        NODE_ENV: "development",
      },
      restart_delay: 2000,
      max_restarts: 10,
    },
  ],
};
