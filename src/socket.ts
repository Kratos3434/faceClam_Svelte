import { io } from 'socket.io-client';

export const socket = io('https://ec2-3-96-216-225.ca-central-1.compute.amazonaws.com', {
  autoConnect: false
});
