import { addDoc, onSnapshot, query, where } from 'firebase/firestore'
import { Observable } from 'rxjs'

import { UserNotification } from '../models'
import { db } from './firestore'

export async function createUserNotification(
  data: Omit<UserNotification, 'id' | 'created_at' | 'readed_at'>,
) {
  await addDoc(db.notifications, {
    ...data,
    created_at: new Date().toISOString(),
    readed_at: null,
  })
}

export function getUserNotifications(
  user_id: string,
): Observable<UserNotification[]> {
  const notificationsQuery = query(
    db.notifications,
    where('user_id', '==', user_id),
  )

  return new Observable<UserNotification[]>((subscriber) => {
    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notifications: UserNotification[] = []
      snapshot.forEach((doc) => {
        const notification = {
          id: doc.id,
          ...doc.data(),
        }
        notifications.push(notification)
      })
      subscriber.next(notifications)
    })
    return unsubscribe
  })
}
