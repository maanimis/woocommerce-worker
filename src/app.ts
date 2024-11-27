import { parseCsv, exportCsv } from "./utils/csv";
import { updateProductPrice } from "./woocommerce/api";
import chalk from "chalk";
import * as dotenv from "dotenv";
import { FromCsv } from "./constants";

const env = dotenv.config();
if (env.error) {
  throw new Error("Failed to load .env file");
}

async function main() {
  try {
    const filePath = process.env.CSV_FILE_PATH;
    const batchSize = +process.env.BATCH_SIZE;
    let totalUpdated = 0;

    console.log(chalk.blue("Reading and processing the CSV file..."));
    const products = await parseCsv(filePath.trim());
    const filterUnUsedPrice = products.filter(
      (product) => product[FromCsv.regularPrice] !== product[FromCsv.usedPrice]
    );

    console.log(
      chalk.magenta(`Found ${filterUnUsedPrice.length} products to process.`)
    );

    for (let i = 0; i < filterUnUsedPrice.length; i += batchSize) {
      const batch = filterUnUsedPrice.slice(i, i + batchSize);

      console.log(
        chalk.magenta(`Processing batch of ${batch.length} products...`)
      );

      await Promise.allSettled(
        batch.map((product) => updateProductPrice(product))
      );

      totalUpdated += batch.length;

      console.log(
        chalk.green(`Successfully processed batch of ${batch.length} products.`)
      );
    }

    // const finalData=[...products,...filterUnUsedPrice]
    await exportCsv(filePath, filterUnUsedPrice);
    console.log(
      chalk.green(`${totalUpdated} products have been successfully updated.`)
    );
  } catch (error: any) {
    console.error(chalk.red("Error occurred: "), error.message);
  }
}

main();
