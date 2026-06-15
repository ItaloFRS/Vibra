import { TicketType } from '../../types/api';

export const MOCK_TICKET_TYPES: Record<string, TicketType[]> = {
  'e1': [
    {
      id: 't1',
      name: 'Pista Comum',
      price: 80,
      capacity: 150,
      batches: [
        { id: 'b1', batchName: '2º Lote', price: 80, capacity: 150 }
      ]
    },
    {
      id: 't2',
      name: 'Frontstage',
      price: 150,
      capacity: 45,
      batches: [
        { id: 'b2', batchName: '1º Lote', price: 150, capacity: 45 }
      ]
    },
    {
      id: 't3',
      name: 'Camarote Open Bar',
      price: 350,
      capacity: 20,
      batches: [
        { id: 'b3', batchName: 'Lote Único', price: 350, capacity: 20 }
      ]
    }
  ],
  'default': [
    {
      id: 'td1',
      name: 'Ingresso Geral',
      price: 50,
      capacity: 100,
      batches: [
        { id: 'bd1', batchName: '1º Lote', price: 50, capacity: 100 }
      ]
    }
  ]
};
