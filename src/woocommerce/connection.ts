import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const { URL, CONSUMER_SECRET, CONSUMER_KEY } = process.env;

if (!CONSUMER_SECRET || !CONSUMER_KEY || !URL) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

export const Api = new WooCommerceRestApi({
  url: URL,
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  version: "wc/v3",
});
