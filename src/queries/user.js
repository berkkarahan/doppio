import { executeQuery } from '../db';

const createUserQuery = async usr => {
  const keys = Object.keys(usr.values).join(', ');
  const values = Object.values(usr.values)
    .map(val => {
      return `'${val}'`;
    })
    .join(', ');

  const query = `INSERT INTO users ( ${keys} ) VALUES ( ${values} )`;
  return await executeQuery(query, 'void');
};

const selectUserQuery = async usr => {
  let query = `SELECT * from users WHERE `;

  // Prioritize email over username for WHERE condition
  const queryKey = usr.values.email || usr.values.username;
  const queryKeyName = Object.keys(usr.values).find(
    key => usr.values[key] === queryKey
  );
  query += `${queryKeyName} = '${queryKey}'`;

  const result = await executeQuery(query, 'select');

  // null values should be deleted before retrieval
  Object.keys(result.rows).forEach(k => {
    if (result.rows[k] === null) {
      delete result.rows[k];
    }
  });
  return result;
};

const updateUserQuery = async usr => {
  let query = `UPDATE users SET `;
  const kvPairs = Object.entries(usr.values).map(([key, value]) => {
    return `${key}='${value}'`;
  });
  query += kvPairs.join(', ');

  // Prioritize email over username for WHERE condition
  const queryKey = usr.values.email || usr.values.username;
  const queryKeyName = Object.keys(usr.values).find(
    key => usr.values[key] === queryKey
  );
  query += ` WHERE ${queryKeyName} = '${queryKey}'`;

  return await executeQuery(query, 'void');
};

export default {
  createUserQuery,
  selectUserQuery,
  updateUserQuery
};
