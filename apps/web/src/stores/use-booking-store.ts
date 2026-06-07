"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingStoreState {
  selectedSessionId: string | null;
  selectedSeatIds: string[];
  ticketQuantities: Record<string, number>;
  promotionCode: string;
  fiscalCpf: string;
  productQuantities: Record<string, number>;
  holdExpiresAt: number | null;
  setSession: (sessionId: string) => void;
  toggleSeat: (seatId: string) => void;
  setTicketQuantity: (ticketCode: string, quantity: number) => void;
  setPromotionCode: (value: string) => void;
  setFiscalCpf: (value: string) => void;
  setProductQuantity: (productId: string, quantity: number) => void;
  startHold: (minutes: number) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({
    selectedSessionId: null,
    selectedSeatIds: [],
    ticketQuantities: {},
    promotionCode: "",
    fiscalCpf: "",
    productQuantities: {},
    holdExpiresAt: null,
    setSession: (sessionId) =>
      set((state) =>
        state.selectedSessionId === sessionId
          ? state
          : {
              selectedSessionId: sessionId,
              selectedSeatIds: [],
              ticketQuantities: {},
              promotionCode: "",
              fiscalCpf: "",
              productQuantities: {},
              holdExpiresAt: null,
            },
      ),
    toggleSeat: (seatId) =>
      set((state) => ({
        selectedSeatIds: state.selectedSeatIds.includes(seatId)
          ? state.selectedSeatIds.filter((id) => id !== seatId)
          : [...state.selectedSeatIds, seatId],
      })),
  setTicketQuantity: (ticketCode, quantity) =>
    set((state) => {
      const clamped = Math.max(0, quantity);
      const { [ticketCode]: _, ...rest } = state.ticketQuantities;
      if (clamped === 0) {
        return { ticketQuantities: rest };
      }
      return { ticketQuantities: { ...rest, [ticketCode]: clamped } };
    }),
    setPromotionCode: (value) => set({ promotionCode: value }),
    setFiscalCpf: (value) => set({ fiscalCpf: value }),
  setProductQuantity: (productId, quantity) =>
    set((state) => {
      const clamped = Math.max(0, quantity);
      const { [productId]: _, ...rest } = state.productQuantities;
      if (clamped === 0) {
        return { productQuantities: rest };
      }
      return { productQuantities: { ...rest, [productId]: clamped } };
    }),
      startHold: (minutes) =>
        set({
          holdExpiresAt: Date.now() + minutes * 60 * 1000,
        }),
      clearBooking: () => {
        const { selectedSessionId } = get();

        set({
          selectedSessionId,
          selectedSeatIds: [],
          ticketQuantities: {},
          promotionCode: "",
          fiscalCpf: "",
          productQuantities: {},
          holdExpiresAt: null,
        });
      },
    }),
    { name: "frame24-booking", migrate: (persisted) => {
    const state = persisted as Record<string, unknown>;
    if ("courtesyCode" in state && !("promotionCode" in state)) {
      state.promotionCode = state.courtesyCode ?? "";
      delete state.courtesyCode;
    }
    return state as unknown as BookingStoreState;
  } },
  ),
);
