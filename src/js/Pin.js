import DrawUI from './DrawUI';

export default class PinMessage {
  constructor(messageClass, requestClass) {
    // Обращаемся к  вспомогательным классам
    this.messageClass = messageClass;
    this.request = requestClass;
    console.log(this.messageClass);
    console.log(this.request);

    // Привязываем контекст
    this.pinMessage = this.pinMessage.bind(this);
    this.unpinMessage = this.unpinMessage.bind(this);
    this.markPinnedMessage = this.markPinnedMessage.bind(this);
    this.unmarkPinnedMessage = this.unmarkPinnedMessage.bind(this);
    this.showPinnedMessage = this.showPinnedMessage.bind(this);
    this.removePinnedMessage = this.removePinnedMessage.bind(this);
  }

  // Запрос на закрепление сообщения через геттер
  pinMessage(event) {
    const messageId = this.messageClass.messages.get(event.target.closest('.media_messages_message'));

    if (messageId === this.pinnedMessage) {
      return;
    }

    this.request.send('pin', messageId);
    this.messageClass.closeMessageTools(event);
  }

  // Запрос на снятие сообщения из закрепленного
  unpinMessage() {
    this.request.send('unpin', this.pinnedMessage);
  }

  // Добавляем метку закреплённого сообщения
  markPinnedMessage(messageId) {
    this.unmarkPinnedMessage();

    const messageElement = [...this.messageClass.messages.entries()]
      .filter(({ 1: id }) => id === messageId).map(([key]) => key);

    const pinMarkElement = DrawUI.getPinMark();
    messageElement[0].querySelector('.media_message_header').prepend(pinMarkElement);
    pinMarkElement.addEventListener('click', this.unpinMessage);
  }

  // Удаляем метку закреплённого с сообщения
  unmarkPinnedMessage() {
    const markElement = this.messageClass.messagesElement.querySelector('.media_message_pin');
    if (markElement) {
      markElement.remove();
    }
    this.removePinnedMessage();
  }

  // Прикрепляем плашку с закреплённым сообщением
  showPinnedMessage(type, id, message, geo, date) {
    this.removePinnedMessage();
    this.pinnedMessage = id;

    const messageElement = this.messageClass.buildMessageElement(type, id, message, geo, date);
    this.pinnedMessageElement = DrawUI.getPinnedMessage(messageElement.querySelector('.media_message_body'));
    this.messageClass.messagesElement.append(this.pinnedMessageElement);
    const closeElement = this.pinnedMessageElement.querySelector('.media_pinned_close');
    closeElement.addEventListener('click', this.unpinMessage);
    const selectElement = this.pinnedMessageElement.querySelector('.media_pinned_select');
    selectElement.addEventListener('click', () => this.request.send('select', this.pinnedMessage));
  }

  // Удаляем плашку закреплённого сообщения
  removePinnedMessage() {
    console.log(this.messageClass.messagesElement.querySelector('.media_pinned'));
    console.log(this.messageClass);
    console.log(this.messageClass.messagesElement);
    if (this.messageClass.messagesElement.querySelector('.media_pinned')) {
      console.log(this.messageClass.messagesElement.querySelector('.meida_pinned'));
      console.log(this.messageClass);
      console.log(this.messageClass.messagesElement);
      this.pinnedMessageElement.remove();
      this.pinnedMessage = '';
    }
  }
}
