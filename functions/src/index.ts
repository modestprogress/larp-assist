import admin from 'firebase-admin';

import { auth, https, firestore } from 'firebase-functions';
import { Timestamp } from 'firebase-admin/firestore';

import { info, warn } from 'firebase-functions/logger';

admin.initializeApp();

const getTime = () => Timestamp.now().toMillis();

const success = (data: any) => ({ data, status: 'success' });

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
  if (!context.auth) {
    throw new https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { amount, currencyId, to } = data;

  if (amount < 0) {
    throw new https.HttpsError('invalid-argument', 'Amount must be positive');
  }

  const { uid } = context.auth;

  const user = await admin.firestore().collection('users').doc(uid).get();
  if (!user.exists) {
    throw new https.HttpsError('not-found', 'User not found');
  }

  const userData = user.data() || {};

  const { characterId } = userData;
  if (!characterId) {
    throw new https.HttpsError(
      'not-found',
      'Transfer source (user) not associated with character'
    );
  }

  const character = await admin
    .firestore()
    .collection('characters')
    .doc(characterId)
    .get();

  if (!character.exists) {
    throw new https.HttpsError('not-found', 'Source character not found');
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

  const toCharacter = await admin
    .firestore()
    .collection('characters')
    .doc(to)
    .get();

  if (!toCharacter.exists) {
    throw new https.HttpsError('not-found', 'Destination character not found');
  }
  const toCharacterData = toCharacter.data() || {};
  const destBalance = toCharacterData.balances[currencyId] || 0;

  if (sourceBalance < amount) {
    throw new https.HttpsError(
      'failed-precondition',
      'Insufficient (source) funds'
    );
  }

  const currency = await admin
    .firestore()
    .collection('currencies')
    .doc(currencyId)
    .get();
  if (!currency.exists) {
    throw new https.HttpsError('not-found', 'Currency not found');
  }

  const currencyName = currency.data()?.name;

  await admin
    .firestore()
    .collection('characters')
    .doc(characterId)
    .update({
      [`balances.${currencyId}`]: admin.firestore.FieldValue.increment(-amount),
    });

  await admin
    .firestore()
    .collection('characters')
    .doc(characterId)
    .update({
      [`balances.${currencyId}`]: destBalance + amount,
    });

  const characterName = characterData.name;
  const toCharacterName = toCharacterData.name;
  const notes = `${characterName} transferred ${amount} ${currencyName} to ${toCharacterName}`;

  // Add transaction logs for both characters
  await admin.firestore().collection('transactions').add({
    characterId,
    currencyId,
    notes,
    amount: -amount,
    createdAtEpoch: getTime(),
  });

  await admin.firestore().collection('transactions').add({
    currencyId,
    notes,
    characterId: to,
    amount: amount,
    createdAtEpoch: getTime(),
  });

  return success({ message: 'Transfer successful' });
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

exports.purchase = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { marketId, itemId, characterId } = data;

  const character = await admin
    .firestore()
    .collection('characters')
    .doc(characterId)
    .get();

  if (!character.exists) {
    throw new https.HttpsError(
      'not-found',
      `Character ${characterId} not found`
    );
  }

  const characterData = character.data() || {};

  const market = await admin
    .firestore()
    .collection('markets')
    .doc(marketId)
    .get();

  if (!market.exists) {
    throw new https.HttpsError('not-found', `Market ${marketId} not found`);
  }

  const marketData = market.data() || {};

  const item = await admin.firestore().collection('items').doc(itemId).get();

  if (!item.exists) {
    throw new https.HttpsError('not-found', `Item ${itemId} not found`);
  }

  const { name: itemName } = item.data() || {};

  const listing = marketData.listings[itemId];
  if (!listing) {
    throw new https.HttpsError('not-found', `Item ${itemId} not listed`);
  }

  if (listing.quantity < 1) {
    throw new https.HttpsError('failed-precondition', 'Item is out of stock');
  }

  // Check if character as enough money
  const cost = listing.cost;
  const { currencyId, name: marketName } = marketData;
  const balance = (characterData.balances || {})[currencyId] || 0;

  if (balance < cost) {
    throw new https.HttpsError('failed-precondition', 'Insufficient funds');
  }

  // Create transaction
  const transactionData = {
    characterId,
    currencyId,
    amount: -cost,
    createdAtEpoch: getTime(),
    notes: `Purchased ${itemName} from ${marketName}`,
  };

  admin.firestore().collection('transactions').add(transactionData);
  // Update character's balance
  await character.ref.update({
    [`balances.${currencyId}`]: admin.firestore.FieldValue.increment(-cost),
  });

  // Update market.listings available
  await market.ref.update({
    // [`listings.${listingId}.available`]: admin.firestore.FieldValue.increment(-1),
    [`listings.${itemId}.available`]: parseInt(listing.available) - 1,
  });

  return success({ message: 'Purchase successful' });
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

  return success({ message: 'Files synced' });
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

  return success({ message: 'User updated' });
});
