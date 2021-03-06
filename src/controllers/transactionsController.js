import db from '../db.js';
import dayjs from 'dayjs';

export async function getTransactions(req, res) {
  const { session } = res.locals;

  try {
    const user = await db.collection('users').findOne({ _id: session.userID });
    const transactions = await db
      .collection('transactions')
      .find({ userID: session.userID })
      .toArray();

    const message = {
      name: user.name,
      transactions: [...transactions].reverse(),
    };

    res.send(message);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function registrateTransaction(req, res) {
  const { value } = req.body;
  const transaction = {
    ...req.body,
    date: dayjs().format('DD/MM/YYYY'),
    userID: res.locals.session.userID,
  };

  const fixedNumber = Number(value).toFixed(2);
  transaction.value = fixedNumber;
  try {
    await db.collection('transactions').insertOne({ ...transaction });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteTransaction(req, res) {
  const { transaction } = res.locals;

  try {
    await db.collection('transactions').deleteOne(transaction);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function updateTransaction(req, res) {
  const { transaction } = res.locals;
  const updatedTransaction = req.body;
  const fixedNumber = Number(updatedTransaction.value).toFixed(2);
  updatedTransaction.value = fixedNumber;

  try {
    await db.collection('transactions').updateOne(transaction, {
      $set: {
        ...updatedTransaction,
      },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
