import fs from "fs";
import { parse, format } from "fast-csv";
import { FromCsv, ProductFactory } from "../constants";
import { ProductValidator } from "./validator";

/**
 * Parses a CSV file and returns an array of validated ProductFactory instances.
 * @param filePath - Path to the CSV file
 * @returns Promise of an array of validated products
 */
async function parseCsv(filePath: string): Promise<ProductFactory[]> {
  return new Promise((resolve, reject) => {
    const products: ProductFactory[] = [];

    fs.createReadStream(filePath)
      .pipe(parse({ headers: true }))
      .on("data", (row) => {
        const product = new ProductFactory(row);
        const validation = ProductValidator.validate(product);

        if (validation.error) {
          console.warn(`Invalid product data: ${validation.error.message}`);
          return;
        }

        products.push(validation.value as ProductFactory);
      })
      .on("end", () => resolve(products))
      .on("error", (error) =>
        reject(new Error(`Failed to parse CSV: ${error.message}`))
      );
  });
}

/**
 * Exports data to a CSV file.
 * @param filePath - Path to the CSV file
 * @param finalData - Array of ProductFactory instances to be written
 * @returns Promise that resolves when the file is written
 */
async function exportCsv(
  filePath: string,
  finalData: ProductFactory[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    const writableStream = fs.createWriteStream(filePath);
    const csvStream = format({ headers: true, quote: '"' });
    csvStream.pipe(writableStream);
    finalData.forEach((product) => csvStream.write(mapToRawData(product)));
    csvStream.end();

    writableStream
      .on("finish", resolve)
      .on("error", (error) =>
        reject(new Error(`Failed to write CSV: ${error.message}`))
      );
  });
}

/**
 * Updates a CSV file with new data.
 * @param filePath - Path to the CSV file
 * @param updatedData - Array of updated ProductFactory instances
 * @returns Promise that resolves when the file is updated
 */
async function updateCsv(
  filePath: string,
  updatedData: ProductFactory[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingData: ProductFactory[] = [];

    // Step 1: Read the existing CSV data
    fs.createReadStream(filePath)
      .pipe(parse({ headers: true, quote: '"' }))
      .on("data", (row) => existingData.push(row))
      .on("end", () => {
        // Step 2: Merge updates into the existing data
        const updatedEntries = new Map(
          updatedData.map((update) => [update[FromCsv.varID], update])
        );

        const mergedData = existingData.map((row) => {
          const updatedEntry = updatedEntries.get(row[FromCsv.varID]);
          return updatedEntry ? { ...row, ...mapToRawData(updatedEntry) } : row;
        });

        // Step 3: Write the updated data back to the CSV file
        const writableStream = fs.createWriteStream(filePath);
        const csvStream = format({ headers: true, quote: '"' });

        csvStream.pipe(writableStream);

        mergedData.forEach((row) => csvStream.write(row));
        csvStream.end();

        writableStream
          .on("finish", resolve)
          .on("error", (error) =>
            reject(new Error(`[B]Failed to write CSV: ${error.message}`))
          );
      })
      .on("error", (error) =>
        reject(new Error(`[A]Failed to read CSV: ${error.message}`))
      );
  });
}

function mapToRawData(data: ProductFactory): Record<string, any> {
  const { _rawData, ...rest } = data;
  const product: Record<string, any> = { ..._rawData, ...rest };
  product[FromCsv.type] = product[FromCsv.type].join(",");
  product[FromCsv.parentID] = `id:${product[FromCsv.parentID]}`;
  return product;
}

export { parseCsv, exportCsv, updateCsv };
