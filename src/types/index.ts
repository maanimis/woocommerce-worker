import { FromCsv, ProductType } from "@/constants";

export interface Product {
  [FromCsv.varID]: string;
  [FromCsv.parentID]: string;
  [FromCsv.name]: string;
  [FromCsv.type]: ProductType[];
  [FromCsv.regularPrice]: string;
  [FromCsv.vipPrice]: string;
  [FromCsv.usedPrice]: string;
  _rawData?: Record<string, any>;
}
