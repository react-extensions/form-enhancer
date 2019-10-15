import { useRef } from 'react';
import createPubSub from './publishSubject';

export default function usePubSub() {
  const pubSub = useRef();

  if (pubSub.current === undefined) {
    pubSub.current = createPubSub();
  }
  const { current } = pubSub;
  return [current.publish, current.subscribe];
}
