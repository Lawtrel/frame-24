import { useEffect, useState, useCallback, useRef } from 'react';
import { getSeatsSocket, SeatsSocket } from '@/lib/socket-client';
import { differenceInSeconds } from 'date-fns';

interface SeatStatus {
    id: string;
    seat_code: string;
    row_code: string;
    column_number: number;
    status: string;
    reserved: boolean;
    reserved_until: string | null;
}

interface UseSeatReservationParams {
    showtimeId: string;
    companyId: string;
    user?: { id: string } | null;
}

interface ReservationState {
    reservationUuid: string | null;
    expiresAt: Date | null;
    reservedSeatIds: string[];
    timeRemaining: number; // segundos
    isReserving: boolean;
    error: string | null;
}

export const useSeatReservation = ({
    showtimeId,
    companyId,
    user,
}: UseSeatReservationParams) => {
    const [socket, setSocket] = useState<SeatsSocket | null>(null);
    const [connected, setConnected] = useState(false);
    const [reservation, setReservation] = useState<ReservationState>({
        reservationUuid: null,
        expiresAt: null,
        reservedSeatIds: [],
        timeRemaining: 0,
        isReserving: false,
        error: null,
    });

    // Ref para timer de countdown
    const countdownRef = useRef<NodeJS.Timeout | null>(null);

    // Conectar ao socket ao montar
    useEffect(() => {
        const seatsSocket = getSeatsSocket();
        setSocket(seatsSocket);

        const joinPayload = {
            showtime_id: showtimeId,
            user_id: user?.id
        };

        // Se já está conectado, apenas entrar na sala
        if (seatsSocket.connected) {
            console.log('[Socket] Already connected, joining showtime');
            setConnected(true);
            seatsSocket.emit('join-showtime', joinPayload);
        } else {
            // Se não está conectado, conectar
            seatsSocket.connect();
        }

        const onConnect = () => {
            console.log('[Socket] Connected');
            setConnected(true);
            // Entrar na sala da sessão
            seatsSocket.emit('join-showtime', joinPayload);
        };

        const onDisconnect = () => {
            console.log('[Socket] Disconnected');
            setConnected(false);
        };

        const onJoinedShowtime = (data: any) => {
            console.log('[Socket] Joined showtime:', data.showtime_id);
        };

        seatsSocket.on('connect', onConnect);
        seatsSocket.on('disconnect', onDisconnect);
        seatsSocket.on('joined-showtime', onJoinedShowtime);

        return () => {
            // Apenas limpar listeners, NÃO desconectar
            // O socket é singleton e deve permanecer vivo
            seatsSocket.off('connect', onConnect);
            seatsSocket.off('disconnect', onDisconnect);
            seatsSocket.off('joined-showtime', onJoinedShowtime);
        };
    }, [showtimeId, user?.id]);

    const [isInitialized, setIsInitialized] = useState(false);

    // Restaurar reserva do localStorage ao montar
    useEffect(() => {
        const savedReservationKey = `seat-reservation-${showtimeId}`;
        const savedReservation = localStorage.getItem(savedReservationKey);

        if (savedReservation) {
            try {
                const parsed = JSON.parse(savedReservation);
                const expiresAt = new Date(parsed.expiresAt);
                const now = new Date();

                // Verificar se ainda não expirou
                if (expiresAt > now) {
                    console.log('[Reservation] Restored from localStorage:', parsed);
                    setReservation({
                        reservationUuid: parsed.reservationUuid,
                        expiresAt,
                        reservedSeatIds: parsed.reservedSeatIds,
                        timeRemaining: 0, // Será calculado pelo countdown
                        isReserving: false,
                        error: null,
                    });
                } else {
                    // Expirou, limpar
                    console.log('[Reservation] Saved reservation expired, clearing');
                    localStorage.removeItem(savedReservationKey);
                }
            } catch (error) {
                console.error('[Reservation] Error parsing saved reservation:', error);
                localStorage.removeItem(savedReservationKey);
            }
        }
        setIsInitialized(true);
    }, [showtimeId]);

    // Timer de countdown
    useEffect(() => {
        if (reservation.expiresAt) {
            const updateCountdown = () => {
                const now = new Date();
                const secondsRemaining = differenceInSeconds(
                    reservation.expiresAt!,
                    now
                );

                if (secondsRemaining <= 0) {
                    // Reserva expirou - notificar o backend para liberar imediatamente
                    console.log('[Reservation] Timer expired, releasing seats...');

                    // Emitir evento para o backend liberar os assentos
                    if (socket && reservation.reservationUuid) {
                        socket.emit('release-seats', {
                            reservation_uuid: reservation.reservationUuid,
                            company_id: companyId,
                        });
                    }

                    setReservation((prev) => ({
                        ...prev,
                        reservationUuid: null,
                        expiresAt: null,
                        reservedSeatIds: [],
                        timeRemaining: 0,
                    }));
                    if (countdownRef.current) {
                        clearInterval(countdownRef.current);
                    }
                    // Limpar do localStorage
                    const savedReservationKey = `seat-reservation-${showtimeId}`;
                    localStorage.removeItem(savedReservationKey);
                    console.log('[Reservation] Expired and cleared from localStorage');
                } else {
                    setReservation((prev) => ({
                        ...prev,
                        timeRemaining: secondsRemaining,
                    }));
                }
            };

            updateCountdown();
            countdownRef.current = setInterval(updateCountdown, 1000);

            return () => {
                if (countdownRef.current) {
                    clearInterval(countdownRef.current);
                }
            };
        }
    }, [reservation.expiresAt]);

    // Eventos do socket
    useEffect(() => {
        if (!socket) return;

        // Sucesso na reserva
        const onReservationSuccess = (data: any) => {
            console.log('[Socket] Reservation success:', data);
            const reservationData = {
                reservationUuid: data.reservation_uuid,
                expiresAt: new Date(data.expires_at),
                reservedSeatIds: data.seat_ids,
                timeRemaining: 0, // Será atualizado pelo countdown
                isReserving: false,
                error: null,
            };

            setReservation(reservationData);

            // Salvar no localStorage
            const savedReservationKey = `seat-reservation-${showtimeId}`;
            localStorage.setItem(savedReservationKey, JSON.stringify({
                reservationUuid: data.reservation_uuid,
                expiresAt: data.expires_at,
                reservedSeatIds: data.seat_ids,
            }));
            console.log('[Reservation] Saved to localStorage');
        };

        // Erro na reserva
        const onReservationError = (data: any) => {
            console.error('[Socket] Reservation error:', data.message);
            setReservation((prev) => ({
                ...prev,
                isReserving: false,
                error: data.message,
            }));
        };

        // Confirmação da venda
        const onReservationConfirmed = (data: any) => {
            console.log('[Socket] Reservation confirmed:', data);
            setReservation({
                reservationUuid: null,
                expiresAt: null,
                reservedSeatIds: [],
                timeRemaining: 0,
                isReserving: false,
                error: null,
            });
        };

        // Erro na confirmação
        const onConfirmationError = (data: any) => {
            console.error('[Socket] Confirmation error:', data.message);
            setReservation((prev) => ({
                ...prev,
                error: data.message,
            }));
        };

        // Reserva restaurada (pelo backend via user_id)
        const onReservationRestored = (data: any) => {
            console.log('[Socket] Reservation restored from backend:', data);
            const reservationData = {
                reservationUuid: data.reservation_uuid,
                expiresAt: new Date(data.expires_at),
                reservedSeatIds: data.seat_ids,
                timeRemaining: 0,
                isReserving: false,
                error: null,
            };

            setReservation(reservationData);

            // Atualizar localStorage para garantir sincronia
            const savedReservationKey = `seat-reservation-${showtimeId}`;
            localStorage.setItem(savedReservationKey, JSON.stringify({
                reservationUuid: data.reservation_uuid,
                expiresAt: data.expires_at,
                reservedSeatIds: data.seat_ids,
            }));
        };

        // Assentos liberados (manual ou expiração)
        const onSeatsReleased = (data: any) => {
            console.log('[Socket] Seats released:', data);
            // Só limpar se for a nossa reserva
            if (reservation.reservationUuid === data.reservation_uuid) {
                setReservation({
                    reservationUuid: null,
                    expiresAt: null,
                    reservedSeatIds: [],
                    timeRemaining: 0,
                    isReserving: false,
                    error: null,
                });

                // Limpar do localStorage
                const savedReservationKey = `seat-reservation-${showtimeId}`;
                localStorage.removeItem(savedReservationKey);
                console.log('[Reservation] Cleared from localStorage due to release event');
            }
        };

        socket.on('reservation-success', onReservationSuccess);
        socket.on('reservation-error', onReservationError);
        socket.on('reservation-confirmed', onReservationConfirmed);
        socket.on('confirmation-error', onConfirmationError);
        socket.on('reservation-restored', onReservationRestored);
        socket.on('seats-released', onSeatsReleased);

        return () => {
            socket.off('reservation-success', onReservationSuccess);
            socket.off('reservation-error', onReservationError);
            socket.off('reservation-confirmed', onReservationConfirmed);
            socket.off('confirmation-error', onConfirmationError);
            socket.off('reservation-restored', onReservationRestored);
            socket.off('seats-released', onSeatsReleased);
        };
    }, [socket, showtimeId, reservation.reservationUuid]);

    // Reservar assentos
    const reserveSeats = useCallback(
        (seatIds: string[]) => {
            if (!socket || !connected) {
                setReservation((prev) => ({
                    ...prev,
                    error: 'Socket não conectado',
                }));
                return;
            }

            setReservation((prev) => ({
                ...prev,
                isReserving: true,
                error: null,
            }));

            socket.emit('reserve-seats', {
                showtime_id: showtimeId,
                seat_ids: seatIds,
                company_id: companyId,
                user_id: user?.id,
            });
        },
        [socket, connected, showtimeId, companyId, user?.id]
    );

    // Liberar assentos
    const releaseSeats = useCallback(() => {
        if (!socket || !connected || !reservation.reservationUuid) return;

        socket.emit('release-seats', {
            reservation_uuid: reservation.reservationUuid,
            company_id: companyId,
        });

        setReservation({
            reservationUuid: null,
            expiresAt: null,
            reservedSeatIds: [],
            timeRemaining: 0,
            isReserving: false,
            error: null,
        });

        // Limpar do localStorage
        const savedReservationKey = `seat-reservation-${showtimeId}`;
        localStorage.removeItem(savedReservationKey);
        console.log('[Reservation] Cleared from localStorage');
    }, [socket, connected, reservation.reservationUuid, companyId, showtimeId]);

    // Confirmar reserva (após pagamento)
    const confirmReservation = useCallback(
        (saleId: string) => {
            if (!socket || !connected || !reservation.reservationUuid) return;

            socket.emit('confirm-reservation', {
                reservation_uuid: reservation.reservationUuid,
                sale_id: saleId,
            });
        },
        [socket, connected, reservation.reservationUuid]
    );

    // Cleanup ao desmontar - apenas liberar reserva
    useEffect(() => {
        return () => {
            // Não liberamos assentos automaticamente ao desmontar se tivermos user_id
            // pois queremos persistência. Mas se for guest, talvez devêssemos?
            // O comportamento anterior era liberar.
            // Se o usuário recarregar a página, o componente desmonta.
            // Se liberarmos aqui, perdemos a reserva no reload.
            // REMOVIDO: releaseSeats();

            // O backend limpará por timeout se não houver reconexão/confirmação
        };
    }, []);

    return {
        connected,
        reservation,
        reserveSeats,
        releaseSeats,
        confirmReservation,
        isInitialized,
    };
};
