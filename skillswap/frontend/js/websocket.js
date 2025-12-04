class VideoWebSocket {
    constructor() {
        this.ws = null;
        this.userId = null;
        this.token = null;
        this.isConnected = false;
        this.messageHandlers = new Map();
        this.currentSessionId = null;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Try to get token from localStorage
        this.token = localStorage.getItem('token');
        this.userId = localStorage.getItem('userId');
        
        if (this.token && this.userId) {
            this.connect();
        }
    }
    
    connect() {
        if (!this.token) {
            console.log('No token available for WebSocket connection');
            return;
        }
        
        try {
            // Close existing connection if any
            if (this.ws) {
                this.ws.close();
            }
            
            // Create new WebSocket connection
            const wsUrl = `ws://${window.location.hostname}:5000?token=${this.token}`;
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('✅ WebSocket connected');
                this.isConnected = true;
                this.notifyHandlers('connected', {});
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 WebSocket message received:', data.type);
                    
                    // Notify specific handlers
                    this.notifyHandlers(data.type, data.payload);
                    
                    // Notify general handlers
                    this.notifyHandlers('*', { type: data.type, payload: data.payload });
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('❌ WebSocket disconnected');
                this.isConnected = false;
                this.notifyHandlers('disconnected', {});
                
                // Try to reconnect after 5 seconds
                setTimeout(() => {
                    if (this.token) {
                        this.connect();
                    }
                }, 5000);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.notifyHandlers('error', { error });
            };
            
        } catch (error) {
            console.error('Error creating WebSocket connection:', error);
        }
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
    }
    
    send(type, payload) {
        if (!this.isConnected || !this.ws) {
            console.error('WebSocket not connected');
            return false;
        }
        
        try {
            const message = JSON.stringify({ type, payload });
            this.ws.send(message);
            return true;
        } catch (error) {
            console.error('Error sending WebSocket message:', error);
            return false;
        }
    }
    
    on(messageType, handler) {
        if (!this.messageHandlers.has(messageType)) {
            this.messageHandlers.set(messageType, []);
        }
        this.messageHandlers.get(messageType).push(handler);
    }
    
    off(messageType, handler) {
        if (this.messageHandlers.has(messageType)) {
            const handlers = this.messageHandlers.get(messageType);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    
    notifyHandlers(messageType, payload) {
        if (this.messageHandlers.has(messageType)) {
            this.messageHandlers.get(messageType).forEach(handler => {
                try {
                    handler(payload);
                } catch (error) {
                    console.error('Error in message handler:', error);
                }
            });
        }
    }
    
    // Video call methods
    joinSession(sessionId) {
        this.currentSessionId = sessionId;
        return this.send('join-session', { sessionId });
    }
    
    sendOffer(sessionId, offer, targetUserId) {
        return this.send('offer', { sessionId, offer, targetUserId });
    }
    
    sendAnswer(sessionId, answer, targetUserId) {
        return this.send('answer', { sessionId, answer, targetUserId });
    }
    
    sendIceCandidate(sessionId, candidate, targetUserId) {
        return this.send('ice-candidate', { sessionId, candidate, targetUserId });
    }
    
    sendChatMessage(sessionId, message) {
        return this.send('chat-message', { sessionId, message });
    }
    
    leaveSession(sessionId) {
        const success = this.send('leave-session', { sessionId });
        if (success) {
            this.currentSessionId = null;
        }
        return success;
    }
    
    sendControlMessage(sessionId, controlType, data, targetUserId = null) {
        return this.send('control-message', { 
            sessionId, 
            controlType, 
            data, 
            targetUserId 
        });
    }
}

// Create global instance
const videoWebSocket = new VideoWebSocket();

export default videoWebSocket;