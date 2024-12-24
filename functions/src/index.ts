import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const createUser = functions.https.onCall(async (data, context) => {
  try {
    const { name, email, password, phoneNumber, role } = data

    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Only authenticated users can create new users'
      )
    }

    const { uid } = await admin.auth().createUser({
      displayName: name,
      email,
      password,
      phoneNumber,
    })

    await admin.auth().setCustomUserClaims(uid, { role })

    return uid
  } catch (err) {
    console.error(err)
    throw new functions.https.HttpsError('internal', 'Error creating user', err)
  }
})

export const readUsers = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Only authenticated users can read user data'
      )
    }

    const { users } = await admin.auth().listUsers()

    return users
  } catch (err) {
    console.error(err)
    throw new functions.https.HttpsError(
      'internal',
      'Error reading user data',
      err
    )
  }
})

export const readUser = functions.https.onCall(async (data, context) => {
  try {
    const { user_id } = data

    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Only authenticated users can read user data'
      )
    }

    const user = await admin.auth().getUser(user_id)

    return user
  } catch (err) {
    console.error(err)
    throw new functions.https.HttpsError(
      'internal',
      'Error reading user data',
      err
    )
  }
})

export const deleteUser = functions.https.onCall(async (data, context) => {
  try {
    const user_id = data.user_id as string

    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Only authenticated users can delete users'
      )
    }

    await admin.auth().deleteUser(user_id)

    return { message: `User with ID: ${user_id} deleted` }
  } catch (err) {
    console.error(err)
    throw new functions.https.HttpsError('internal', 'Error deleting user', err)
  }
})

export const toogleUserState = functions.https.onCall(async (data, context) => {
  try {
    const user_id = data.user_id as string

    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Only authenticated users can delete users'
      )
    }

    const userRecord = await admin.auth().getUser(user_id)
    const disabled = userRecord.disabled
    await admin.auth().updateUser(user_id, { disabled: !disabled })

    return { message: `User with ID: ${user_id} toogled` }
  } catch (err) {
    console.error(err)
    throw new functions.https.HttpsError('internal', 'Error deleting user', err)
  }
})
