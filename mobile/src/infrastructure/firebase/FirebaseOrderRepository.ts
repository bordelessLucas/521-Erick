import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import type {
  CreateOrderData,
  IOrderRepository,
} from '@/domain/repositories/IOrderRepository';
import { getFirestoreDb } from '@/core/config/firebase';
import { FIRESTORE_COLLECTIONS } from '@/core/config/firebaseConstants';
import { formatCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
import {
  mapOrderFromFirestore,
  type FirestoreOrderDocument,
} from '@/infrastructure/firestore/orderMapper';
import { requireFirebaseAuthSession } from './firebaseAuthSession';

function normalizeClientCnpj(clientCnpj: string): string {
  return formatCnpj(normalizeCnpj(clientCnpj));
}

function sortOrdersByDate(orders: Order[]): Order[] {
  return [...orders].sort(
    (left, right) =>
      new Date(right.orderDate).getTime() - new Date(left.orderDate).getTime(),
  );
}

export class FirebaseOrderRepository implements IOrderRepository {
  async getAllByClientCnpj(clientCnpj: string): Promise<Order[]> {
    await requireFirebaseAuthSession();

    const normalizedCnpj = normalizeClientCnpj(clientCnpj);
    const ordersQuery = query(
      collection(getFirestoreDb(), FIRESTORE_COLLECTIONS.orders),
      where('clientCnpj', '==', normalizedCnpj),
    );

    const snapshot = await getDocs(ordersQuery);

    return sortOrdersByDate(
      snapshot.docs.map((document) =>
        mapOrderFromFirestore(document.id, document.data() as FirestoreOrderDocument),
      ),
    );
  }

  async getAll(): Promise<Order[]> {
    await requireFirebaseAuthSession();

    const snapshot = await getDocs(
      collection(getFirestoreDb(), FIRESTORE_COLLECTIONS.orders),
    );

    return sortOrdersByDate(
      snapshot.docs.map((document) =>
        mapOrderFromFirestore(document.id, document.data() as FirestoreOrderDocument),
      ),
    );
  }

  async getById(orderId: string): Promise<Order | null> {
    await requireFirebaseAuthSession();

    const snapshot = await getDoc(
      doc(getFirestoreDb(), FIRESTORE_COLLECTIONS.orders, orderId),
    );

    if (!snapshot.exists()) {
      return null;
    }

    return mapOrderFromFirestore(snapshot.id, snapshot.data() as FirestoreOrderDocument);
  }

  async create(data: CreateOrderData): Promise<Order> {
    await requireFirebaseAuthSession();

    const payload: FirestoreOrderDocument = {
      clientCnpj: normalizeClientCnpj(data.clientCnpj),
      orderDate: data.orderDate,
      estimatedValue: data.estimatedValue,
      weightInKg: data.weightInKg,
      status: data.status,
    };

    const documentRef = await addDoc(
      collection(getFirestoreDb(), FIRESTORE_COLLECTIONS.orders),
      payload,
    );

    return mapOrderFromFirestore(documentRef.id, payload);
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    await requireFirebaseAuthSession();

    const documentRef = doc(getFirestoreDb(), FIRESTORE_COLLECTIONS.orders, orderId);
    await updateDoc(documentRef, { status });

    const snapshot = await getDoc(documentRef);

    if (!snapshot.exists()) {
      throw new Error('Pedido não encontrado após atualização.');
    }

    return mapOrderFromFirestore(snapshot.id, snapshot.data() as FirestoreOrderDocument);
  }
}
