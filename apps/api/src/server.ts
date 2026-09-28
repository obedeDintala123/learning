import app from "./app";

const startServer = async () => {
  try {
    await app.listen({
      host: "0.0.0.0",
      port: 3004,
    });
    console.log("server running in port 3004");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
