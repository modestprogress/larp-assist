import admin from 'firebase-admin';

import { auth, https } from 'firebase-functions';
import { Timestamp } from 'firebase-admin/firestore';

import { info, warn } from 'firebase-functions/logger';

admin.initializeApp();

exports.onCreateUser = auth.user().onCreate(async (user) => {
  const { uid, displayName, email, photoURL } = user;
  const userData = {
    uid,
    email,
    photoURL,
    name: displayName,
    createdAt: Timestamp.now(),
    isActivated: false,
    gm: false,
  };

  info(
    `User created with uid=${uid}, email=${email}, displayName=${displayName}, photoURL=${photoURL}`
  );

  await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .set(userData, { merge: true });
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

  const allowedAttributes = ['name', 'photoURL', 'email'];
  const userData: { [key: string]: any } = {};

  let logLine = `User ${uid} updated in the database with: `;
  allowedAttributes.forEach((attribute) => {
    if (data[attribute]) {
      userData[attribute] = data[attribute];
      logLine += `${attribute}=${data[attribute]}, `;
    }
  });

  logLine = logLine.slice(0, -2);

  await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .set(userData, { merge: true });

  info(logLine);

  const { ...profileUpdate } = userData;
  if (profileUpdate.name) {
    profileUpdate['displayName'] = profileUpdate.name;
    delete profileUpdate['name'];
  }

  logLine = `User ${context.auth.uid} updated in firestore with: `;
  Object.keys(profileUpdate).forEach((attribute) => {
    logLine += `${attribute}=${profileUpdate[attribute]}, `;
  });

  logLine = logLine.slice(0, -2);

  await admin.auth().updateUser(uid, profileUpdate);

  return { success: true };
});
