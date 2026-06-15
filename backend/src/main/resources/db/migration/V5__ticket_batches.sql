CREATE TABLE ticket_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_type_id UUID NOT NULL,
    batch_name VARCHAR(255) NOT NULL, -- Ex: "1º Lote"
    price DECIMAL(10, 2) NOT NULL,
    capacity INTEGER NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    batch_order INTEGER NOT NULL, -- Ordem do lote (1, 2, 3 ou 4)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_batches_type FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id) ON DELETE CASCADE
);

CREATE INDEX idx_ticket_batches_type_id ON ticket_batches(ticket_type_id);
