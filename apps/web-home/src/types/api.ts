export type UserRole = 'ROLE_USER' | 'ROLE_PRODUCER';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  businessName?: string;
  businessDocument?: string;
  role: UserRole;
  profilePhotoUrl?: string;
  bannerUrl?: string;
  bio?: string;
  emailVerified: boolean;
  preferences?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface LineupItem {
  id: string;
  artistName: string;
  artistImageUrl?: string;
}

export interface TicketBatch {
  id: string;
  batchName: string;
  price: number;
  capacity: number;
  startDate?: string;
  endDate?: string;
  batchOrder?: number;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  capacity: number;
  batches: TicketBatch[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  thumbnailUrl?: string;
  eventDate: string;
  location?: string;
  externalTicketLink?: string;
  latitude?: number;
  longitude?: number;
  producerId: string;
  ticketTypes: TicketType[];
  lineup: LineupItem[];
  createdAt?: string;
  updatedAt?: string;
  // UI helpers
  minPrice?: number;
}

export type TicketStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'USED';

export interface Ticket {
  id: string;
  userId: string;
  eventId: string;
  ticketBatchId: string;
  externalPaymentId?: string;
  status: TicketStatus;
  pricePaid: number;
  qrCodeData?: string;
  createdAt: string;
  updatedAt: string;
  // Join fields
  event?: Event;
  batchName?: string;
}

export interface TicketSummary {
  ticketId: string;
  eventTitle: string;
  thumbnailUrl?: string;
  eventDate: string;
  status: TicketStatus;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
