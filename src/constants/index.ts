import { Product } from "@/types";

export const enum ProductType {
  Variation = "variation",
  Virtual = "virtual",
  Variable = "variable",
}

export enum FromCsv {
  varID = "شناسه",
  parentID = "مادر",
  name = "نام",
  type = "نوع",
  regularPrice = "قیمت عادی",
  vipPrice = "قیمت فروش ویژه",
  usedPrice = "usedPrice",
}


export class ProductFactory implements Product {
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

