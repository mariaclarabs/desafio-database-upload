import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface RequestDTO {
  fileName: string;
}

class ImportTransactionsService {
  async execute({ fileName }: RequestDTO): Promise<Transaction[]> {
    const csvFilePath = path.resolve(__dirname, '..', '..', 'tmp', fileName);
    const createTransaction = new CreateTransactionService();

    async function loadCSV(filePath: string): Promise<any[]> {
      const readCSVStream = fs.createReadStream(filePath);

      const parseStream = csvParse({
        from_line: 2,
        ltrim: true,
        rtrim: true,
      });

      const parseCSV = readCSVStream.pipe(parseStream);

      const lines: any[] = [];

      parseCSV.on('data', line => {
        lines.push(line);
      });

      await new Promise(resolve => {
        parseCSV.on('end', resolve);
      });

      return lines;
    }

    const csvData = await loadCSV(csvFilePath);

    const transactions: Transaction[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const transaction of csvData) {
      const [title, type, value, category] = transaction;
      // eslint-disable-next-line no-await-in-loop
      const newTransaction = await createTransaction.execute({
        title,
        value,
        type,
        category,
      });

      transactions.push(newTransaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
