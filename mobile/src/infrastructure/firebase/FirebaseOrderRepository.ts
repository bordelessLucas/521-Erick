import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import type { Order } from '@/domain/entities/Order';
import type { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import { getFirestoreDb } from '@/core/config/firebase';
import { FIRESTORE_COLLECTIONS } from '@/core/config/firebaseConstants';
import {
  mapOrderFromFirestore,
  type FirestoreOrderDocument,
} from '@/infrastructure/firestore/orderMapper';

export class FirebaseOrderRepository implements IOrderRepository {
  async getAllByClientCnpj(clientCnpj: string): Promise<Order[]> {
    const ordersQuery = query(
      collection(getFirestoreDb(), FIRESTORE_COLLECTIONS.orders),
      where('clientCnpj', '==', clientCnpj),
      orderBy('orderDate', 'desc'),
    );

    const snapshot = await getDocs(ordersQuery);

    return snapshot.docs.map((document) =>
      mapOrderFromFirestore(document.id, document.data() as FirestoreOrderDocument),
    );
  }

  async getById(orderId: string): Promise<Order | null> {
    const snapshot = await getDoc(
      doc(getFirestoreDb(), FIRESTORE_COLLECTIONS.orders, orderId),
    );

    if (!snapshot.exists()) {
      return null;
    }

    return mapOrderFromFirestore(snapshot.id, snapshot.data() as FirestoreOrderDocument);
  }
}
