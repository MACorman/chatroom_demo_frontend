import React from 'react'
import Cable from 'actioncable'

class MessageForm extends React.Component {

    state = {
        input: '',
        roomsMessages: []
    }

    componentDidMount() {
        this.createSocket()
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
                {this.state.roomsMessages.map(message => <span>{message}</span>)}
                <form onSubmit={this.handleSendEvent}>
                    <input type='text' placeholder='Write a new message...' value={this.state.input} onChange={(e) => this.setState({input: e.target.value})}/>
                    <input type='submit' value="send" />
                </form>
            </div>
        )
    }
}

export default MessageForm