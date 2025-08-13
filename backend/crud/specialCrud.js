// crud/specialCrud.js
const pool = require('../services/db');

/**
 * ---------------- GET HELPERS ----------------
 */
async function getByColumn(table, column, value) {
    const [rows] = await pool.query(`SELECT * FROM ?? WHERE ?? = ?`, [table, column, value]);
    return rows;
}

async function getByConditions(table, conditions) {
    if (!Array.isArray(conditions) || conditions.length === 0) {
        throw new Error("Conditions must be a non-empty array");
    }

    let query = `SELECT * FROM ?? WHERE `;
    let params = [table];
    let conditionStrings = [];

    for (let cond of conditions) {
        const keys = Object.keys(cond).filter(k => k !== 'status');
        if (keys.length === 0 && cond.status) {
            // Logical operator only (AND / OR)
            conditionStrings.push(cond.status.toUpperCase());
        } else {
            const column = keys[0];
            const value = cond[column];
            const operator = cond.status || '=';
            conditionStrings.push(`?? ${operator} ?`);
            params.push(column, value);
        }
    }

    query += conditionStrings.join(' ');
    const [rows] = await pool.query(query, params);
    return rows;
}

async function getUnion(tables, column) {
    if (!Array.isArray(tables) || tables.length < 2) {
        throw new Error("Need at least two tables for UNION");
    }
    const unionQueries = tables.map(() => `SELECT ?? FROM ??`).join(' UNION ');
    const params = [];
    tables.forEach(table => params.push(column, table));

    const [rows] = await pool.query(unionQueries, params);
    return rows;
}

async function getJoin(table1, table2, onCondition) {
    const query = `SELECT * FROM ?? JOIN ?? ON ${onCondition}`;
    const [rows] = await pool.query(query, [table1, table2]);
    return rows;
}

/**
 * ---------------- CREATE / DUPLICATE HELPERS ----------------
 */
async function createRow(table, data) {
    const [result] = await pool.query(`INSERT INTO ?? SET ?`, [table, data]);
    return { id: result.insertId, ...data };
}

async function duplicateRow(table, id) {
    const [rows] = await pool.query(`SELECT * FROM ?? WHERE id = ?`, [table, id]);
    if (rows.length === 0) return null;
    let data = { ...rows[0] };
    delete data.id; // remove old ID so MySQL generates a new one
    const [result] = await pool.query(`INSERT INTO ?? SET ?`, [table, data]);
    return { id: result.insertId, ...data };
}

/**
 * ---------------- UPDATE HELPERS ----------------
 */
async function updateRows(table, conditions, newData) {
    const whereClause = await buildWhereClause(conditions);
    const query = `UPDATE ?? SET ? ${whereClause.sql}`;
    const params = [table, newData, ...whereClause.params];
    const [result] = await pool.query(query, params);
    return result.affectedRows;
}

/**
 * ---------------- DELETE HELPERS ----------------
 */
async function deleteRows(table, conditions) {
    const whereClause = await buildWhereClause(conditions);
    const query = `DELETE FROM ?? ${whereClause.sql}`;
    const params = [table, ...whereClause.params];
    const [result] = await pool.query(query, params);
    return result.affectedRows;
}

/**
 * ---------------- UTILITY ----------------
 */
async function buildWhereClause(conditions) {
    if (!Array.isArray(conditions) || conditions.length === 0) {
        return { sql: '', params: [] };
    }

    let sql = 'WHERE ';
    let params = [];
    let parts = [];

    for (let cond of conditions) {
        const keys = Object.keys(cond).filter(k => k !== 'status');
        if (keys.length === 0 && cond.status) {
            parts.push(cond.status.toUpperCase());
        } else {
            const column = keys[0];
            const value = cond[column];
            const operator = cond.status || '=';
            parts.push(`?? ${operator} ?`);
            params.push(column, value);
        }
    }

    sql += parts.join(' ');
    return { sql, params };
}

module.exports = {
    getByColumn,
    getByConditions,
    getUnion,
    getJoin,
    createRow,
    duplicateRow,
    updateRows,
    deleteRows
};
