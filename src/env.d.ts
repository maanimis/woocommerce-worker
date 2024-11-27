declare global {
  namespace NodeJS {
    interface ProcessEnv {
      URL: string;
      CONSUMER_KEY: string;
      CONSUMER_SECRET: string;
      BATCH_SIZE: string;
      CSV_FILE_PATH: string;
    }
  }
}

export {};
