/* eslint-disable */
import { useEffect, useState, useCallback, useRef } from 'react';
import { getWebSocketEndpoint } from "@utility/getWebSocketEndpoint";

interface WebSocketMessage {
    type: string;
    data: any;
}


const useWebSocket = (url: string) => {
    const [latestMessage, setLatestMessage] = useState<WebSocketMessage | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const fullUrl = getWebSocketEndpoint() + url;
        // console.log('Initializing WebSocket connection to:', fullUrl);

        const ws = new WebSocket(fullUrl);

        ws.onopen = () => {
            // console.log('WebSocket connected');
            setIsConnected(true);
            setError(null);
        };

        ws.onmessage = (event) => {
            // console.log('Received message:', event.data);
            try {
                const parsedMessage: WebSocketMessage = JSON.parse(event.data);
                setLatestMessage(parsedMessage);
            } catch (e) {
                // console.error('Error parsing message:', e);
                setError('Error parsing incoming message');
            }
        };

        ws.onerror = () => {
            // console.error('WebSocket error:', event);
            setError('WebSocket error occurred');
            setIsConnected(false);
        };

        ws.onclose = () => {
            // console.log('WebSocket closed:', event.code, event.reason);
            setIsConnected(false);
        };

        socketRef.current = ws;

        return () => {
            // console.log('Cleaning up WebSocket connection');
            if (socketRef.current) {
                socketRef.current?.close();
            }
        };
    }, [url]);

    const sendMessage = useCallback((message: string) => {
        if (socketRef.current) {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                // console.log('Sending message:', message);
                socketRef.current?.send(message);
            } else {
                // console.error('WebSocket is not in OPEN state. Unable to send message.');
                setError('WebSocket is not in OPEN state. Unable to send message.');
            }
        } else {
            // console.error('WebSocket instance is not available. Unable to send message.');
            setError('WebSocket instance is not available. Unable to send message.');
        }
    }, []);

    const parseData = useCallback((data: string): any => {
        try {
            return JSON.parse(data);
        } catch (e) {
            // console.error('Error parsing data:', e);
            return {} as any;
        }
    }, []);

    return { latestMessage, sendMessage, isConnected, error, parseData };
};

export default useWebSocket;