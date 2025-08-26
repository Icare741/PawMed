import Ws from 'App/Services/Ws'
import Logger from '@ioc:Adonis/Core/Logger'
import Consultation from 'App/Models/Consultation'
import { DateTime } from 'luxon'
import User from 'App/Models/User'

const connectedUsers: Set<string> = new Set()
const rooms: Map<string, Set<string>> = new Map()

Ws.boot()

Ws.io.on('connection', async (socket) => {
  Logger.info(`User connected: ${socket.id}`)
  connectedUsers.add(socket.id)

  // Envoyer l'ID au client qui vient de se connecter
  socket.emit('me', socket.id)

  socket.on('join-room', async (consultationId) => {
    try {
      // Accepter uniquement la room "200"
      if (consultationId !== "200") {
        socket.emit('room-error', 'Room non autorisée')
        return
      }

      // Si tout est OK, rejoindre la room
      if (!rooms.has(consultationId)) {
        rooms.set(consultationId, new Set())
      }

      rooms.get(consultationId)?.add(socket.id)
      socket.join(consultationId)
      socket.to(consultationId).emit('user-joined', socket.id)

      Logger.info(`User ${socket.id} joined room 200`)

    } catch (error) {
      Logger.error('Erreur lors de la jointure de room:', error)
      socket.emit('room-error', 'Une erreur est survenue')
    }
  })

  socket.on('leave-room', (roomId) => {
    rooms.get(roomId)?.delete(socket.id)
    if (rooms.get(roomId)?.size === 0) {
      rooms.delete(roomId)
    }
    socket.leave(roomId)
  })

  socket.on('offer', ({ target, offer, room }) => {
    // Envoyer l'offre directement à l'utilisateur cible dans la room
    socket.to(target).emit('offer', {
      offer,
      caller: socket.id
    })
  })

  socket.on('answer', ({ target, answer, room }) => {
    // Envoyer la réponse directement à l'utilisateur cible dans la room
    socket.to(target).emit('answer', {
      answer,
      answerer: socket.id
    })
  })

  socket.on('ice-candidate', ({ target, candidate, room }) => {
    // Envoyer le candidat ICE directement à l'utilisateur cible dans la room
    socket.to(target).emit('ice-candidate', {
      candidate,
      from: socket.id
    })
  })

  socket.on('disconnect', () => {
    Logger.info(`User disconnected: ${socket.id}`)
    connectedUsers.delete(socket.id)
    // Nettoyer les rooms
    rooms.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id)
        if (users.size === 0) {
          rooms.delete(roomId)
        }
      }
    })
  })
})
