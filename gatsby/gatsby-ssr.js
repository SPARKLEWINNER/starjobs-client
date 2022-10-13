const React = require('react')

exports.onRenderBody = ({setPostBodyComponents}) => {
  setPostBodyComponents([
    <script
      key="userSnapJS"
      dangerouslySetInnerHTML={{
        __html: `
        window.onUsersnapCXLoad = function(api) {
            api.init();

            window.Usersnap = api;
    
            function setNotification(event) {

              console.log(event)
             
              fetch(
                '  https://discord.com/api/webhooks/839333433451741195/OVuAGjqKQfkRpbkZi8LEN6CQnP9mAXjF69LDkmPpcpLZDHacDjPwq64Yf7QbR_0mckCX',
                {
                  method: 'post',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    // the username to be displayed
                    username: 'Usersnap Notification',
                    // the avatar to be displayed
                    avatar_url:
                      'https://findicons.com/files/icons/1994/vista_style_business_and_data/256/users.png',
                    // contents of the message to be sent
                    content:
                     " A user " +event.values.ordered_inputs[0].value+" submitted a feedback "+event.values.comment.text+" from "+ event.values.client.url+" - check more here - https://board.usersnap.com/Xd1ubYHmzd9rotx9",
                  }),
                }
              );
            }
            api.on('submit', setNotification);
        
          }
          var script = document.createElement('script');
          script.defer = 1;
          script.src = 'https://widget.usersnap.com/global/load/5db6ed72-2881-4310-ac50-712e39193b7e?onload=onUsersnapCXLoad';
          document.getElementsByTagName('head')[0].appendChild(script);
      `
      }}
    />
  ])
}
