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
	clients map[string]map[chan string]struct{}
}

var Hub = &SSEHub{
	clients: make(map[string]map[chan string]struct{}),
}

func (h *SSEHub) Subscribe(userID string) chan string {
	h.mu.Lock()
	defer h.mu.Unlock()

	ch := make(chan string, 10)
	if h.clients[userID] == nil {
		h.clients[userID] = make(map[chan string]struct{})
	}
	h.clients[userID][ch] = struct{}{}
	return ch
}

func (h *SSEHub) Unsubscribe(userID string, ch chan string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if channels, ok := h.clients[userID]; ok {
		delete(channels, ch)
		close(ch)
		if len(channels) == 0 {
			delete(h.clients, userID)
		}
	}
}

func (h *SSEHub) Publish(userID string, data string) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	if channels, ok := h.clients[userID]; ok {
		for ch := range channels {
			select {
			case ch <- data:
			default:
			}
		}
	}
}