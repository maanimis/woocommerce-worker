import { Product } from "@/types";
import { Api } from "./connection";
import { FromCsv, ProductType } from "@/constants";

async function updatePrice(endpoint: string, price: string): Promise<boolean> {
  try {
    const response = await Api.put(endpoint, { regular_price: price });
    console.log(`Successfully updated price. New price: $${price}`);
    return true;
  } catch (error: any) {
    console.error(
      `Failed to update price at endpoint ${endpoint}:`,
      error.response ? error.response.data : error.message
    );
    return false;
  }
}

async function updateProductPrice(product: Product): Promise<void> {
  try {
    if (product[FromCsv.type][0] === ProductType.Variation) {
      const endpoint = `products/${product[FromCsv.parentID]}/variations/${
        product[FromCsv.varID]
      }`;
      const result = await updatePrice(endpoint, product[FromCsv.regularPrice]);
      if (result) {
        product[FromCsv.usedPrice] = product[FromCsv.regularPrice];
      }
    }
  } catch (error: any) {
    console.error(
      `ERROR@Product:${product[FromCsv.varID]}:`,
      error.response ? error.response.data : error.message
    );
  }
}

export { updateProductPrice };
