import notif from '../api/notif'

export default function useSendNotif() {
  const sendInterestNotification = async ({clientId, clientName, targetUsers = []}) => {
    let notifParams = {
      title: `Someone sent an interest in your service`,
      body: `${clientName} is interested in your service`,
      targetUsers: targetUsers,
      type: 'ClientInterest',
      target: 'Selected',
      additionalData: JSON.stringify({_id: clientId}),
    }

    let response = await notif.create_notification(clientId, notifParams)

    return response
  }

  const sendGigNotification = async ({
    title = 'Gig Update',
    body = 'Click to open gig',
    targetUsers = [],
    additionalData,
    userId,
  }) => {
    let notifParams = {
      title: `${title}`,
      body: `${body}`,
      targetUsers: targetUsers,
      type: 'GigNotif',
      target: 'Selected',
      additionalData: JSON.stringify(additionalData),
    }

    let response = await notif.create_notification(userId, notifParams)
    return response
  }

  return {sendInterestNotification, sendGigNotification}
}
