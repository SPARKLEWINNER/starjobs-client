
import { useState, useEffect, useContext } from 'react'
import React from 'react'
import Pusher from 'pusher-js';

import { UsersContext } from './users';
const { REACT_APP_PUSHER_APP_CLUSTER, REACT_APP_PUSHER_APP_KEY } = process.env

const pusher = new Pusher(REACT_APP_PUSHER_APP_KEY, {
    cluster: REACT_APP_PUSHER_APP_CLUSTER,
    encrypted: true
});

const PusherContext = React.createContext()

const PusherProvider = ({ children }) => {
    const [socket_id, setSocketId] = useState('');
    const { user } = useContext(UsersContext)

    useEffect(() => {
        const load = async () => {

            if (!user) return;
            setSocketId(pusher.connection.socket_id)

            await pusher.connection.bind('connected', function () {
                sessionStorage.setItem('socket_id', socket_id)
            });

            // request permission to display notifications, if we don't alreay have it
            Notification.requestPermission();
            const channel = pusher.subscribe(`notifications-${user._id}`);
            channel.bind(`notifications-${user._id}`, data => {

                console.log(data)
                var notification = new Notification(" was just updated. Check it out.");
                notification.onclick = function (event) {
                    window.location.href = '/posts/';
                    event.preventDefault();
                    notification.close();
                }

            });

        }
        load()
        // eslint-disable-next-line
    }, []);

    return <PusherContext.Provider value={pusher}>{children}</PusherContext.Provider>
}

export { PusherContext, PusherProvider }


