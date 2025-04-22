import https from "node:https";

const isCronActive = process.env.IS_CRON_ACTIVE || false;
const backenUrl = "https://shop-back-ufdi.onrender.com";
const keepTheServerAlive = () => {
  if (isCronActive) https.get(backenUrl);
};

export default keepTheServerAlive;
