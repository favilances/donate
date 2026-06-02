package utils

import (
	"sync"
)

type SSEEvent struct {
	UserID string
	Data   string
}

type SSEHub struct {
	mu      sync.RWMutex
	clients map[string]chan string
}

var Hub = &SSEHub{
	clients: make(map[string]chan string),
}

func (h *SSEHub) Subscribe(userID string) chan string {
	h.mu.Lock()
	defer h.mu.Unlock()

	ch := make(chan string, 10)
	h.clients[userID] = ch
	return ch
}

func (h *SSEHub) Unsubscribe(userID string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if ch, ok := h.clients[userID]; ok {
		close(ch)
		delete(h.clients, userID)
	}
}

func (h *SSEHub) Publish(userID string, data string) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	if ch, ok := h.clients[userID]; ok {
		select {
		case ch <- data:
		default:
		}
	}
}