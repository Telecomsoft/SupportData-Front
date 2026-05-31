/* eslint-disable */
//@ts-nocheck

import React, { useEffect, useRef } from 'react';
// Import directly from the package's core directory
import RFB  from '@novnc/novnc/lib/rfb.js';

interface VncViewerProps {
    url: string;
    password?: string;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onClipboard?: (text: string) => void;
    viewOnly?: boolean;
    scaleViewport?: boolean;
    width?: string;
    height?: string;
}

interface VncConnectionOptions {
    credentials: {
        password: string;
    };
    viewOnly: boolean;
    scaleViewport: boolean;
}

const VncViewer: React.FC<VncViewerProps> = ({
                                                 url,
                                                 password = '',
                                                 onConnect = () => {},
                                                 onDisconnect = () => {},
                                                 onClipboard = () => {},
                                                 viewOnly = false,
                                                 scaleViewport = false,
                                                 width = '800px',
                                                 height = '600px'
                                             }) => {
    const vncScreen = useRef<HTMLDivElement>(null);
    const rfbConnection = useRef<any>(null);

    useEffect(() => {
        if (!url || !vncScreen.current) return;

        const options: VncConnectionOptions = {
            credentials: { password },
            viewOnly,
            scaleViewport
        };

        try {
            const rfb = new RFB(vncScreen.current, url, options);

            rfb.addEventListener('connect', () => {
                // console.log('Connected to VNC server');
                onConnect();
            });

            rfb.addEventListener('disconnect', () => {
                // console.log('Disconnected from VNC server');
                onDisconnect();
            });

            rfb.addEventListener('clipboard', (event: CustomEvent) => {
                onClipboard(event.detail.text);
            });

            rfbConnection.current = rfb;
        } catch (error) {
            console.error('Failed to initialize VNC connection:', error);
        }

        return () => {
            if (rfbConnection.current) {
                try {
                    rfbConnection.current.disconnect();
                    rfbConnection.current = null;
                } catch (error) {
                    console.error('Error disconnecting:', error);
                }
            }
        };
    }, [url, password, viewOnly, scaleViewport, onConnect, onDisconnect, onClipboard]);

    return (
        <div
            ref={vncScreen}
            style={{
                width,
                height,
                border: '1px solid #ccc'
            }}
        />
    );
};

export default VncViewer;