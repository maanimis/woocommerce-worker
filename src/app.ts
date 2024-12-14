import { parseCsv, exportCsv, updateCsv } from "./utils/csv";
import { updateProductPrice } from "./woocommerce/api";
import chalk from "chalk";
import * as dotenv from "dotenv";
import { FromCsv, ProductFactory } from "./constants";

const env = dotenv.config();
if (env.error) {
  throw new Error("Failed to load .env file");
}

async function main() {
  const output_OK: ProductFactory[] = [];
  const output_FAILED: ProductFactory[] = [];

  try {
    const filePath = process.env.CSV_FILE_PATH;
    const batchSize = +process.env.BATCH_SIZE;
    let totalUpdated = 0;

    console.log(chalk.blue("Reading and processing the CSV file..."));
    const Products = await parseCsv(filePath.trim());
    const filterUnUsedPrice = Products.filter(
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

      const updatedProducts = await Promise.allSettled(
        batch.map((product) => updateProductPrice(product))
      );

      for (const newProduct of updatedProducts) {
        if (newProduct.status === "fulfilled") {
          const data = newProduct.value;
          if (data.isVariation && data.success) {
            output_OK.push(data.product);
            continue;
          }
          output_FAILED.push(data.product);
        }
      }

      totalUpdated += batch.length;

      console.log(
        chalk.green(`Successfully processed batch of ${batch.length} products.`)
      );
    }

    await updateCsv(filePath, output_OK);
    await exportCsv(process.env.CSV_FAILED_FILE_PATH, output_FAILED);
    console.log(
      chalk.green(`${totalUpdated} products have been successfully updated.`)
    );
  } catch (error: any) {
    console.error(chalk.red("Error occurred: "), error.message);
  }
}

main();
