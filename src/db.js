import mysql from 'mysql2/promise';

import { config } from './config';

const cn = {
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE,
  connectionLimit: config.MYSQL_MAX_POOL
};

const pool = new mysql.createPool(cn);

const _execute = async query => {
  const queryResult = await pool.execute(query);
  const result = {
    rows: queryResult[0],
    fields: queryResult[1]
  };
  return result;
};

const executeQuery = async (query, queryType) => {
  try {
    const results = await _execute(query, pool);
    if (queryType === 'void') {
      return {
        status: true,
        rows: []
      };
    }
    if (queryType === 'select') {
      const returnResult = {
        status: null,
        rows: results.rows[0]
      };
      if (returnResult.rows === undefined) {
        returnResult.status = false;
        return returnResult;
      }
      returnResult.status = true;
      return returnResult;
    }
    return {
      status: false,
      rows: []
    };
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  executeQuery
};
