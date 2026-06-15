package com.vibra.admin.service;

import com.vibra.admin.dto.DashboardSummaryResponse;
import com.vibra.admin.dto.EventStatsResponse;
import com.vibra.admin.dto.FinanceSummaryResponse;
import com.vibra.admin.dto.TransactionResponse;
import com.vibra.events.entity.Event;
import com.vibra.events.entity.TicketBatch;
import com.vibra.events.entity.TicketType;
import com.vibra.events.repository.EventRepository;
import com.vibra.social.repository.MatchRepository;
import com.vibra.social.repository.MessageRepository;
import com.vibra.social.repository.UserEventInterestRepository;
import com.vibra.tickets.entity.Ticket;
import com.vibra.tickets.entity.TicketStatus;
import com.vibra.tickets.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private static final BigDecimal PLATFORM_FEE_RATE = new BigDecimal("0.10"); // 10% Fee

    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
    private final MatchRepository matchRepository;
    private final MessageRepository messageRepository;
    private final UserEventInterestRepository interestRepository;

    public AdminService(EventRepository eventRepository, 
                        TicketRepository ticketRepository,
                        MatchRepository matchRepository,
                        MessageRepository messageRepository,
                        UserEventInterestRepository interestRepository) {
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
        this.matchRepository = matchRepository;
        this.messageRepository = messageRepository;
        this.interestRepository = interestRepository;
    }

    public DashboardSummaryResponse getProducerSummary(UUID producerId) {
        List<Event> producerEvents = eventRepository.findByProducerId(producerId);
        
        long activeEvents = producerEvents.size();
        long totalTickets = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;
        long totalInteractions = 0;

        for (Event event : producerEvents) {
            var tickets = ticketRepository.findByEventId(event.getId());
            totalTickets += tickets.stream()
                    .filter(t -> t.getStatus() == TicketStatus.PAID)
                    .count();
            
            BigDecimal eventRevenue = tickets.stream()
                    .filter(t -> t.getStatus() == TicketStatus.PAID)
                    .map(t -> t.getPricePaid())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            totalRevenue = totalRevenue.add(eventRevenue);
            
            // Somar interações para taxa de engajamento
            totalInteractions += matchRepository.countByEventId(event.getId());
            totalInteractions += messageRepository.countByEventId(event.getId());
        }

        double engagementRate = activeEvents > 0 ? (double) totalInteractions / activeEvents : 0;

        return DashboardSummaryResponse.builder()
                .totalRevenue(totalRevenue)
                .totalTicketsSold(totalTickets)
                .activeEventsCount(activeEvents)
                .avgEngagementRate(engagementRate)
                .revenueGrowth(0.0)
                .ticketsGrowth(0.0)
                .build();
    }

    public FinanceSummaryResponse getFinanceSummary(UUID producerId) {
        List<Event> producerEvents = eventRepository.findByProducerId(producerId);
        ZonedDateTime now = ZonedDateTime.now();

        BigDecimal availableBalance = BigDecimal.ZERO;
        BigDecimal pendingBalance = BigDecimal.ZERO;
        BigDecimal totalGrossRevenue = BigDecimal.ZERO;
        BigDecimal totalPlatformFees = BigDecimal.ZERO;

        for (Event event : producerEvents) {
            List<Ticket> tickets = ticketRepository.findByEventId(event.getId()).stream()
                    .filter(t -> t.getStatus() == TicketStatus.PAID)
                    .toList();

            for (Ticket ticket : tickets) {
                BigDecimal gross = ticket.getPricePaid();
                BigDecimal fee = gross.multiply(PLATFORM_FEE_RATE).setScale(2, RoundingMode.HALF_UP);
                BigDecimal net = gross.subtract(fee);

                totalGrossRevenue = totalGrossRevenue.add(gross);
                totalPlatformFees = totalPlatformFees.add(fee);

                // Se o evento já aconteceu, o saldo está disponível. Se não, está pendente.
                if (event.getEventDate().isBefore(now)) {
                    availableBalance = availableBalance.add(net);
                } else {
                    pendingBalance = pendingBalance.add(net);
                }
            }
        }

        return FinanceSummaryResponse.builder()
                .totalBalance(availableBalance.add(pendingBalance))
                .availableBalance(availableBalance)
                .pendingBalance(pendingBalance)
                .totalGrossRevenue(totalGrossRevenue)
                .totalPlatformFees(totalPlatformFees)
                .build();
    }

    public List<TransactionResponse> getTransactions(UUID producerId) {
        List<Event> producerEvents = eventRepository.findByProducerId(producerId);
        List<TransactionResponse> allTransactions = new ArrayList<>();

        for (Event event : producerEvents) {
            List<Ticket> tickets = ticketRepository.findByEventId(event.getId());
            
            for (Ticket ticket : tickets) {
                BigDecimal gross = ticket.getPricePaid();
                BigDecimal fee = gross.multiply(PLATFORM_FEE_RATE).setScale(2, RoundingMode.HALF_UP);
                
                allTransactions.add(TransactionResponse.builder()
                        .ticketId(ticket.getId())
                        .eventTitle(event.getTitle())
                        .purchaseDate(ticket.getCreatedAt())
                        .grossAmount(gross)
                        .feeAmount(fee)
                        .netAmount(gross.subtract(fee))
                        .status(ticket.getStatus().name())
                        .build());
            }
        }

        // Ordenar por data de compra descendente
        return allTransactions.stream()
                .sorted((a, b) -> b.getPurchaseDate().compareTo(a.getPurchaseDate()))
                .collect(Collectors.toList());
    }

    public EventStatsResponse getEventStats(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        var allTickets = ticketRepository.findByEventId(eventId);
        
        long soldCount = allTickets.stream()
                .filter(t -> t.getStatus() == TicketStatus.PAID)
                .count();

        BigDecimal revenue = allTickets.stream()
                .filter(t -> t.getStatus() == TicketStatus.PAID)
                .map(t -> t.getPricePaid())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Dados sociais reais
        long matches = matchRepository.countByEventId(eventId);
        long messages = messageRepository.countByEventId(eventId);
        long interests = interestRepository.countByEventId(eventId);
        
        // Taxa de conversão: Tickets Pagos / Interessados (Favoritos + Compradores)
        double conversion = interests > 0 ? (double) soldCount * 100 / interests : 0;

        List<EventStatsResponse.BatchStat> batchStats = new ArrayList<>();
        long totalCapacity = 0;

        for (TicketType type : event.getTicketTypes()) {
            for (TicketBatch batch : type.getBatches()) {
                long batchSold = ticketRepository.countByTicketBatchIdAndStatusIn(
                        batch.getId(), 
                        List.of(TicketStatus.PAID, TicketStatus.PENDING)
                );
                
                batchStats.add(EventStatsResponse.BatchStat.builder()
                        .id(batch.getId())
                        .batchName(type.getName() + " - " + batch.getBatchName())
                        .sold(batchSold)
                        .capacity((long) batch.getCapacity())
                        .percentage(batch.getCapacity() > 0 ? (double) batchSold * 100 / batch.getCapacity() : 0)
                        .startDate(batch.getStartDate())
                        .endDate(batch.getEndDate())
                        .build());
                
                totalCapacity += batch.getCapacity();
            }
        }

        return EventStatsResponse.builder()
                .eventTitle(event.getTitle())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .totalTickets(totalCapacity)
                .soldTickets(soldCount)
                .revenue(revenue)
                .soldPercentage(totalCapacity > 0 ? (double) soldCount * 100 / totalCapacity : 0)
                .matchesCount(matches)
                .messagesCount(messages)
                .interestCount(interests)
                .conversionRate(conversion)
                .salesByBatch(batchStats)
                .build();
    }
}
