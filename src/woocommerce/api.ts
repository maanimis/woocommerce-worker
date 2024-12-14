import { OUTPUT } from "@/types";
import { Api } from "./connection";
import { FromCsv, ProductFactory, ProductType } from "../constants";

async function updatePrice(endpoint: string, price: string): Promise<boolean> {
  try {
    const response = await Api.put(endpoint, { regular_price: price });
    const { status, statusText } = response;
    console.log(`[OK]${endpoint}=> New price: $${price}`);
    return status === 200 && statusText === "OK" ? true : false;
  } catch (error: any) {
    console.error(
      `-[Failed]${endpoint}:`,
      error.response ? error.response.data : error.message
    );
    return false;
  }
}

async function updateProductPrice(product: ProductFactory): Promise<OUTPUT> {
  let success: boolean;
  const isVariation = product[FromCsv.type][0] === ProductType.Variation;
  try {
    // const productResponse = await Api.get(
    //   `products/${product[FromCsv.parentID]}`
    // );
    if (isVariation) {
      const endpoint = `products/${product[FromCsv.parentID]}/variations/${
        product[FromCsv.varID]
      }`;
      success = await updatePrice(endpoint, product[FromCsv.regularPrice]);
      if (success) {
        product[FromCsv.usedPrice] = product[FromCsv.regularPrice];
      }
    } else {
      success = false;
    }
  } catch (error: any) {
    console.error(
      `ERROR@Product:${product[FromCsv.varID]}:`,
      error.response ? error.response.data : error.message
    );
    success = false;
  }

  return { success, product, isVariation };
}

export { updateProductPrice };
