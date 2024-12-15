# WooCommerce Worker

A Node.js application for updating WooCommerce product prices via the WooCommerce REST API. This tool processes product data from a CSV file and updates prices efficiently using batch processing.

## Features

- Updates WooCommerce product prices using REST API.
- Parses CSV files to extract product details.
- Batch processing for efficiency and scalability.
- Written in TypeScript with modular architecture.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/maanimis/woocommerce-worker.git
   cd woocommerce-worker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables in an `.env` file:

   ```plaintext
   URL="https://example.com"
   CONSUMER_KEY="ck_11111111111111111"
   CONSUMER_SECRET="cs_222222222222222222222222"
   BATCH_SIZE=10
   CSV_FILE_PATH="tst.csv"
   CSV_FAILED_FILE_PATH="failed.csv"
   ```

## Usage

### Development Mode

Run the application in development mode using `tsx`:

```bash
npm run dev
```

### Production Mode

1. Build the project:

   ```bash
   npm run build
   ```

2. Start the application:

   ```bash
   npm start
   ```

## CSV File Requirements

Prepare a CSV file containing product data with the following headers:

- **شناسه (ID)**
- **نوع (Type)**
- **شناسه محصول (Product ID)**
- **نام (Name)**
- **قیمت فروش ویژه (Sale Price)**
- **قیمت عادی (Regular Price)**
- **مادر (Parent)**

Example:

```csv
شناسه,نوع,"شناسه محصول",نام,"قیمت فروش ویژه","قیمت عادی",مادر
1,variation,12345,"Product A",100,150,0
2,virtual,54321,"Product B",200,250,1
```

## Contributing

Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
