import React from 'react' 
import Cable from 'actioncable'

class ChatRoom extends React.Component {

    state = {
        roomsMessages: []
    }
    createSocket() {
        let cable = Cable.createConsumer('ws://localhost:3000/cable')
        this.chats = cable.subscriptions.create({
            channel: 'MessagesChannel'
        }, {
            connected: () => {},
            received: (data) => {
                let roomsMessages = this.state.roomsMessages
                roomsMessages.push(data)
                this.setState({ roomsMessages })
                console.log(data)
            },
            create: function(chatContent) {
                this.perform('create', {
                    content: chatContent,
                    user_id: localStorage.getItem('user_id'),
                    chatroom_id: localStorage.getItem('chatroom_id')
                })
            }
        })
    }

    handleSendEvent(event) {
        event.preventDefault()
        this.chats.create(this.state.input)
        this.setState({ input: ''})
    }

    render() {
        return(
            <div>
                chatroom container
            </div>
        )
    }
}

export default ChatRoom