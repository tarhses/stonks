import Socket from 'socket.io-client'

const socket = new Socket()

export function useSocket () {
  return socket
}
