import admin from 'firebase-admin';

import { auth, https, firestore } from 'firebase-functions';
import { Timestamp } from 'firebase-admin/firestore';

import { info, warn } from 'firebase-functions/logger';

admin.initializeApp();

exports.onCreateUser = auth.user().onCreate(async (user) => {
  const { uid, displayName, email } = user;
  const userData = {
    uid,
    email,
    name: displayName || '',
    createdAt: Timestamp.now(),
    isActivated: false,
    gm: false,
  };

  await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .set(userData, { merge: true });
});

exports.transferCurrency = https.onCall(async (data, context) => {
  const { amount, currencyId, to } = data;
  const { uid } = context.auth;

  await admin.firestore().runTransaction(async (tx) => {
    const user = await admin.firestore().collection('users').doc(uid).get();

    if (amount < 0) {
      throw new https.HttpsError('invalid-argument', 'Amount must be positive');
    }

    if (!user.exists) {
      throw new https.HttpsError('not-found', 'User not found');
    }

    const userData = user.data() || {};

    if (!userData.isActivated) {
      throw new https.HttpsError('unauthenticated', 'User is not activated');
    }

    const characterId = userData.characterId;
    if (!characterId) {
      throw new https.HttpsError(
        'not-found',
        'Transfer source (user) not associated with character'
      );
    }

    const characterRef = admin
      .firestore()
      .collection('characters')
      .doc(characterId);

    const character = await tx.get(characterRef);
    if (!character.exists) {
      throw new https.HttpsError('not-found', 'Source character not found');
    }

    const toCharacterRef = admin.firestore().collection('characters').doc(to);

    const toCharacter = await tx.get(toCharacterRef);
    if (!toCharacter.exists) {
      throw new https.HttpsError(
        'not-found',
        'Destination character not found'
      );
    }

    const characterData = character.data() || {};
    const sourceBalances = characterData.balances || {};
    const sourceBalance = sourceBalances[currencyId] || 0;
    if (sourceBalance < amount) {
      throw new https.HttpsError(
        'failed-precondition',
        'Insufficient (source) funds'
      );
    }

    await toCharacter.ref.update({
      [`balances.${currencyId}`]: admin.firestore.FieldValue.increment(amount),
    });

    await character.ref.update({
      [`balances.${currencyId}`]: admin.firestore.FieldValue.increment(-amount),
    });
  });
});

exports.onTransaction = exports.myFunction = firestore
  .document('transactions/{transactionId}')
  .onWrite((change, context) => {
    const data = change.after.exists
      ? change.after.data()
      : change.before.data();

    const characterId = data?.characterId;
    const currencyId = data?.currencyId;

    if (!characterId || !currencyId) {
      return;
    }

    const characterRef = admin
      .firestore()
      .collection('characters')
      .doc(characterId);

    // Recalculate character's total balance for this currency type
    return admin.firestore().runTransaction(async (tx) => {
      const character = await tx.get(characterRef);

      if (!character.exists) {
        throw new Error('Character does not exist!');
      }

      // Reference to all transactions with a matching character id and currency id
      const transactionsRef = admin.firestore().collection('transactions');

      // Sum all transactions
      const transactions = await tx.get(transactionsRef);
      let total = 0;
      transactions.docs
        .filter(
          (v) =>
            v.data().characterId == characterId &&
            v.data().currencyId == currencyId
        )
        .forEach((v) => {
          total += parseInt(v.data().amount);
        });

      const balances = character.data()?.balances || {};
      balances[currencyId] = total;
      characterRef.update({ balances: balances });
    });
  });

exports.syncFiles = https.onCall(async (data, context) => {
  if (!context.auth) {
    warn('Unauthenticated user called endpoint syncFiles');
    throw new https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  // Start a batch of writes
  const batch = admin.firestore().batch();

  // Retrieve the default bucket
  const bucket = admin.storage().bucket();

  // Iterate over the files in the bucket and add their properties to firestore
  const [files] = await bucket.getFiles({ prefix: 'player-files' });
  files.forEach((file) => {
    const { name, metadata } = file;
    const path = name;

    const filename = path.split('/').pop();
    if (!filename) {
      return;
    }

    const filenameParts = filename.split('.');
    if (filenameParts.length > 1) {
      filenameParts.pop();
    }

    const code = filenameParts.join('.');

    // Remove the extension

    const fileData = {
      metadata,
      path,
      bucket: metadata.bucket,
      url: metadata.mediaLink,
      code: code,
    };

    // We use the filename as the document Id to simplify syncing.
    const docId = filename;
    const fileRef = admin.firestore().collection('files').doc(docId);

    batch.set(fileRef, fileData, { merge: true });
  });

  // Commit the pending writes
  await batch.commit();

  return { success: true };
});

exports.updateUser = https.onCall(async (data, context) => {
  if (!context.auth) {
    warn('Unauthenticated user called endpoint updateUser');
    throw new https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { uid } = context.auth;

  const userData: { [key: string]: any } = {};
  const allowedAttributes = ['name', 'photoURL', 'email'];
  allowedAttributes.forEach((attribute) => {
    if (data[attribute] != null) {
      userData[attribute] = data[attribute];
    }
  });

  await admin.firestore().collection('users').doc(uid).set({}, { merge: true });
  await admin.firestore().collection('users').doc(uid).update(userData);
  info('User updated', userData);

  if (userData.name) {
    userData['displayName'] = userData.name;
    delete userData['name'];
  }

  // Update the user in Firebase Auth
  await admin.auth().updateUser(uid, userData);

  return { success: true };
});
