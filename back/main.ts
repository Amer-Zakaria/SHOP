import "dotenv/config";
import Server from "./src/index.ts";

const main = (): void => {
  try {
    Server.start();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
};

main();
