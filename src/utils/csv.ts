import fs from "fs";
import { parse, format } from "fast-csv";
import type { Product } from "@/types";
import { FromCsv, ProductType } from "@/constants";
import { ProductValidator } from "./validator";

class ProductFactory implements Product {
  public [FromCsv.varID]: string;
  public [FromCsv.parentID]: string;
  public [FromCsv.name]: string;
  public [FromCsv.type]: ProductType[];
  public [FromCsv.regularPrice]: string;
  public [FromCsv.vipPrice]: string;
  public [FromCsv.usedPrice]: string;
  public _rawData: Record<string, any>;

  constructor(rawData: Record<string, any>) {
    this[FromCsv.varID] = rawData[FromCsv.varID].trim();
    this[FromCsv.name] = rawData[FromCsv.name].trim();
    this[FromCsv.type] = rawData[FromCsv.type].trim().toLowerCase().split(",");
    this[FromCsv.regularPrice] = rawData[FromCsv.regularPrice].trim();
    this[FromCsv.vipPrice] = rawData[FromCsv.vipPrice].trim();
    this[FromCsv.usedPrice] = rawData[FromCsv.usedPrice]?.trim() || "";
    this[FromCsv.parentID] = rawData[FromCsv.parentID]
      .replace("id:", "")
      .trim();

    this._rawData = rawData;
  }
}

function parseCsv(filePath: string): Promise<ProductFactory[]> {
  return new Promise((resolve, reject) => {
    const products: ProductFactory[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ headers: true }))
      .on("data", (row) => {
        const product = new ProductFactory(row);
        const productValidator = ProductValidator.validate(product);
        if (!productValidator.error) {
          products.push(productValidator.value);
        }
      })
      .on("end", () => resolve(products))
      .on("error", (error) => reject(error));
  });
}

function exportCsv(
  filePath: string,
  finalData: ProductFactory[]
): Promise<any> {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filePath);
    const csvStream = format({ headers: true, quote: '"' });

    csvStream.pipe(ws);
    finalData.forEach((row) => {
      const data = mapToRawData(row);
      csvStream.write(data);
    });
    csvStream.end();

    ws.on("finish", resolve);
    ws.on("error", (error) =>
      reject(new Error(`Failed to write to file: ${error.message}`))
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

export { parseCsv, exportCsv };
