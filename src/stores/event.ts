import { defineStore } from 'pinia';
import { eventService } from '@/services/eventService';
import type { Event, EventRequest } from '@/models/Event';

export const useEventStore = defineStore('Event', {
  state: () => ({
    eventList: [] as Event[],
    event: null as Event | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allEvents(): Event[] {
      return this.eventList;
    },

    getEventById: (state) => (idx: number) => {
      return state.eventList.find((e) => e.idx === idx);
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        this.eventList = await eventService.getAll();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch events';
        console.error('Error fetching events:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchByYearMonth(year: number, month: number) {
      this.loading = true;
      this.error = null;
      try {
        this.eventList = await eventService.getByYearMonth(year, month);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch events';
        console.error('Error fetching events:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchById(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        this.event = await eventService.getById(idx);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch event';
        console.error('Error fetching event:', error);
      } finally {
        this.loading = false;
      }
    },

    async createEvent(eventRequest: EventRequest) {
      this.loading = true;
      this.error = null;
      try {
        const newEvent = await eventService.create(eventRequest);
        this.eventList.push(newEvent);
        return { success: true, data: newEvent };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create event';
        console.error('Error creating event:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async updateEvent(idx: number, eventRequest: EventRequest) {
      this.loading = true;
      this.error = null;
      try {
        const updatedEvent = await eventService.update(idx, eventRequest);
        const index = this.eventList.findIndex((e) => e.idx === idx);
        if (index !== -1) {
          this.eventList[index] = updatedEvent;
        }
        return { success: true, data: updatedEvent };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update event';
        console.error('Error updating event:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async deleteEvent(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        await eventService.delete(idx);
        this.eventList = this.eventList.filter((e) => e.idx !== idx);
        return { success: true };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete event';
        console.error('Error deleting event:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    initNewEvent() {
      this.event = {
        idx: 0,
        memberIdx: null,
        staffIdx: null,
        goodsIdx: null,
        title: '',
        description: null,
        startAt: null,
        endEt: null,
        allDay: 0,
      };
    },
  },
});