import { useCallback, useRef } from 'react';

type Events<T extends string> = Record<T, (() => void)[]>;

/**
 * This hook is aimed to notify children component registered itself to particular type.
 */
export default function <EventTypes extends string>() {
  const subscribedEventsRef = useRef<Events<EventTypes>>();

  /**
   * Subscribe the event
   * @param callBack Callback to subscribe
   * @param type Event type to subscribe
   */
  const subEvent = useCallback((callBack: () => void, type: EventTypes) => {
    if (!subscribedEventsRef.current) {
      subscribedEventsRef.current = {} as Events<EventTypes>;
    }

    if (!subscribedEventsRef.current[type]) {
      subscribedEventsRef.current[type] = [];
    }

    subscribedEventsRef.current[type].push(callBack);
    //off event
    return () => {
      const events = subscribedEventsRef.current && subscribedEventsRef.current[type];
      if (events) {
        const eventIndex = events.findIndex((fn) => fn === callBack);
        const delFn = events.splice(eventIndex, 1);
        return !!delFn;
      }
    };
  }, []);

  /**
   * Broadcast particular type has been occured
   * @param type Event type
   */
  const pubEvents = useCallback((type: EventTypes) => {
    if (subscribedEventsRef.current && subscribedEventsRef.current[type]) {
      subscribedEventsRef.current[type].forEach((fn) => fn());
    }
  }, []);

  return [subEvent, pubEvents] as const;
}
