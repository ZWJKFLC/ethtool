/*Database connection encapsulation*/
const mysql = require("mysql2");
const pool = mysql.createPool(global.mysqlpoolGlobal);
// sqlcall
async function sqlcall(selSql, selSqlParams) {
    return new Promise(function (resolve, reject) {
        try {
            pool.query(selSql, selSqlParams, async function (err, result) {
                if (err) {
                    if (err.code === 'ER_CON_COUNT_ERROR') {
                        console.log("sql请求过多，等待1秒");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        resolve(await sqlcall(sqlStatements))
                        return;
                    } else {
                        throw err;
                    }
                }
                let dataString = JSON.stringify(result);
                let data = JSON.parse(dataString);
                resolve(data);

            });
        } catch (error) {
            console.log(error);
            reject(error)
        }
    });
}
// async function beginTransaction(sqls, params) {
async function beginTransaction(sqlStatements) {
    return new Promise(async function (resolve, reject) {
        try {
            pool.getConnection(async function (err, connection) {
                if (err) {
                    if (err.code === 'ER_CON_COUNT_ERROR') {
                        console.log("sql请求过多，等待1秒");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        resolve(await beginTransaction(sqlStatements))
                        return;
                    } else {
                        throw err;
                    }
                }
                connection.beginTransaction(function (err) {
                    if (err) throw err;
                    let funcAry = sqlStatements.map((sql, index) => {
                        return new Promise((sqlResolve, sqlReject) => {
                            // const data = params[index];
                            connection.query(sql[0], sql[1], (sqlErr, result) => {
                                if (sqlErr) {
                                    return sqlReject(sqlErr);
                                }
                                sqlResolve(result);
                            });
                        });
                    });
                    Promise.all(funcAry)
                        .then((arrResult) => {
                            // 若每个sql语句都执行成功了 才会走到这里 在这里需要提交事务，前面的sql执行才会生效
                            // 提交事务
                            connection.commit(function (commitErr, info) {
                                if (commitErr) {
                                    // 提交事务失败了
                                    console.log("提交事务失败:" + commitErr);
                                    // 事务回滚，之前运行的sql语句不生效
                                    connection.rollback(function (err) {
                                        if (err) console.log("回滚失败：" + err);
                                        connection.release();
                                    });
                                    // 返回promise失败状态
                                    return reject(commitErr);
                                }

                                connection.release();
                                // 事务成功 返回 每个sql运行的结果 是个数组结构
                                resolve(arrResult);
                            });
                        })
                        .catch((error) => {
                            // 多条sql语句执行中 其中有一条报错 直接回滚
                            connection.rollback(function () {
                                console.log("sql运行失败： " + error);
                                connection.release();
                                reject(error);
                            });
                        });
                });
            });
        } catch (error) {
            console.log(error);
            reject(error)
        }
    });
}
// async function beginTransaction(sqlStatements) {
//     return new Promise(async function (resolve, reject) {
//         try {
//             pool.getConnection(async function (err, connection) {
//                 if (err) {
//                     if (err.code === 'ER_CON_COUNT_ERROR') {
//                         console.log("sql请求过多，等待1秒");
//                         await new Promise(resolve => setTimeout(resolve, 1000));
//                         resolve(await beginTransaction(sqlStatements))
//                         return;
//                     } else {
//                         throw err;
//                     }
//                 }
//                 connection.beginTransaction(function (err) {
//                     if (err) throw err;

//                     sqlStatements.forEach(function (sql) {
//                         connection.query(sql, function (err, result) {
//                             if (err) {
//                                 connection.rollback(function () {
//                                     throw err;
//                                 });
//                             }
//                         });
//                     });

//                     connection.commit(function (err) {
//                         if (err) {
//                             connection.rollback(function () {
//                                 throw err;
//                             });
//                         }
//                         connection.release();
//                         // console.log('Transaction completed successfully.');
//                         resolve(true)
//                     });
//                 });
//             });
//         } catch (error) {
//             console.log(error);
//             reject(error)
//         }
//     });
// }
function sqlcall_uncon(conn, sqlcall, selSqlParams) {
    return new Promise(function (resolve, reject) {
        conn.query(sqlcall, selSqlParams, function (err, result) {
            if (err) {
                console.log('[SQLCALL ERROR] - ', err.message);
                resolve(err);
                global.zwjerror = true;
                return;
            }
            let dataString = JSON.stringify(result);
            let data = JSON.parse(dataString);
            resolve(data);
        });
    });
}
module.exports = {
    beginTransaction,
    sqlcall,
    sqlcall_uncon
}