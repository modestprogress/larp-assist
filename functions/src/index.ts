import admin from 'firebase-admin';

import { auth, https } from 'firebase-functions';
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
