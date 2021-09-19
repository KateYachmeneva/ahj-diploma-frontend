import CreateRequest from './CreateRequest';
import DrawUI from './DrawUI';
import SidePanel from './SidePanel';
import FileLoader from './FileLoader';
import MediaLoader from './MediaLoader';
import Geolocation from './Geolocation';
import Pin from './Pin';
import Favourites from './Favourites';

export default class Media {
  constructor(element, server) {
    this.server = server;

    // Собираем элементы
    this.parentElement = element;
    this.formElement = this.parentElement.querySelector('.media_form');
    this.inputElement = this.formElement.querySelector('.media_form_input');
    this.clipElement = this.formElement.querySelector('.media_form_clip');
    this.addFormElement = this.formElement.querySelector('.media_add_container');
    this.addFileElement = this.addFormElement.querySelector('.media_add_files');
    this.addAudioElement = this.addFormElement.querySelector('.media_add_audio');
    this.addVideoElement = this.addFormElement.querySelector('.media_add_video');
    this.addGeoElement = this.addFormElement.querySelector('.media_add_geo');
    this.messagesElement = this.parentElement.querySelector('.media_messages');
    this.messages = new Map();

    // Заводим вспомогательные классы
    this.request = new CreateRequest(this.server);
    this.sidePanel = new SidePanel(this.parentElement.querySelector('.media_side'), this, this.request);
    this.geolocation = new Geolocation(this.formElement);
    this.fileLoader = new FileLoader(this.parentElement, this.geolocation, this.request);
    this.mediaLoader = new MediaLoader(this.formElement, this.geolocation, this.request);
    this.pin = new Pin(this, this.request);
    this.favourites = new Favourites(this, this.request);

    // Привязываем контекст
    this.submitForm = this.submitForm.bind(this);
    this.showAddForm = this.showAddForm.bind(this);
    this.removeError = this.removeError.bind(this);
    this.connectionError = this.connectionError.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.addFile = this.addFile.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
    this.lazyLoad = this.lazyLoad.bind(this);
    this.showSelectMessage = this.showSelectMessage.bind(this);
    this.closeSelectMessage = this.closeSelectMessage.bind(this);
    this.showMessageDot = this.showMessageDot.bind(this);
    this.removeMessageDot = this.removeMessageDot.bind(this);
    this.showMessageTools = this.showMessageTools.bind(this);
    this.closeMessageTools = this.closeMessageTools.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.deleteMessageElement = this.deleteMessageElement.bind(this);
  }

  init() {
    // Соединяемся с WebSocket
    this.request.callbacks = {
      error: this.connectionError,
      load: this.renderMessages,
      message: this.addMessage,
      file: this.addFile,
      showMessage: this.showSelectMessage,
      delete: this.deleteMessageElement,
      favourite: this.favourites.showFavouriteMark,
      favouriteRemove: this.favourites.removeFavouriteMark,
      sideLoad: this.sidePanel.render,
      sideCategory: this.sidePanel.showCategoryItems,
      sideFavourites: this.sidePanel.showFavouritesDescription,
      pin: this.pin.markPinnedMessage,
      pinMessage: this.pin.showPinnedMessage,
      unpin: this.pin.unmarkPinnedMessage,
    };
    this.request.init();

    // Вешаем события
    this.messagesElement.addEventListener('scroll', this.lazyLoad);
    this.formElement.addEventListener('submit', this.submitForm);
    this.clipElement.addEventListener('click', this.showAddForm);
    this.addFileElement.addEventListener('click', this.fileLoader.openForm);
    this.addAudioElement.addEventListener('click', this.mediaLoader.openMedia);
    this.addVideoElement.addEventListener('click', this.mediaLoader.openMedia);
    this.addGeoElement.addEventListener('click', this.geolocation.attachGeo);
  }

  // Конструктор элемента сообщения в зависимости от типа
  buildMessageElement(type, id, message, geo, date) {
    // Если уже был отрендерен раньше, то отдать готовый элемент из Map
    if ([...this.messages.values()].indexOf(id) !== -1) {
      const messageElement = [...this.messages.entries()]
        .filter(({ 1: messageId }) => messageId === id).map(([key]) => key);
      return messageElement[0];
    }

    let messageElement = '';
    switch (type) {
      case 'text': {
        messageElement = DrawUI.createMessageElement(message, geo, date);
        break;
      }
      case 'image': {
        messageElement = DrawUI.createImageElement(this.server, message, geo, date);
        break;
      }
      case 'video': {
        messageElement = DrawUI.createVideoElement(this.server, message, geo, date);
        break;
      }
      case 'audio': {
        messageElement = DrawUI.createAudioElement(this.server, message, geo, date);
        break;
      }
      case 'file': {
        messageElement = DrawUI.createFileElement(this.server, message, geo, date);
        break;
      }
      default: {
        break;
      }
    }

    this.messages.set(messageElement, id);

    messageElement.addEventListener('mouseenter', this.showMessageDot);
    messageElement.addEventListener('mouseleave', this.removeMessageDot);

    return messageElement;
  }

  // Отрисовка сообщений снизу вверх
  renderMessages(data, favourites, position) {
    for (const message of data) {
      const messageElement = this.buildMessageElement(
        message.type, message.id, message.message, message.geo, message.date,
      );

      if (favourites.indexOf(message.id) !== -1) {
        this.favourites.showFavouriteMark(message.id);
      }

      if (message.pinned) {
        this.pin.markPinnedMessage(message.id);
      }

      this.messagesElement.prepend(messageElement);

      // Если первичная загрузка, то проматываем вниз после загрузки содержимого
      if (!this.databasePosition) {
        this.scrollBottom(messageElement);
      }
    }
    // Если "ленивая" подгрузка, то записываем сколько элементов ещё можно подгрузить сверху
    this.databasePosition = position;

    // Верхний элемент-триггер для "ленивой" подгрузки
    if (this.databasePosition > 0) {
      this.upperMessageElement = this.messagesElement.querySelector('.media_messages_message:nth-child(3)');
    }
  }

  // "Ленивая" подгрузка
  lazyLoad() {
    if (this.databasePosition <= 0) return;
    if (this.upperMessageElement && this.upperMessageElement.getBoundingClientRect().bottom > 0) {
      this.upperMessageElement = '';
      this.request.send('load', this.databasePosition);
    }
  }

  // Показ выбранного (select) из хранилища сообщения
  showSelectMessage(message) {
    const messageElement = this.buildMessageElement(
      message.type, message.id, message.message, message.geo, message.date,
    );

    const selectContainerElement = DrawUI.createSelectContainer(message.date);
    const selectCloseElement = selectContainerElement.querySelector('.media_select_close');
    selectContainerElement.append(messageElement);
    this.parentElement.querySelector('.media_messages').replaceWith(selectContainerElement);
    selectCloseElement.addEventListener('click', this.closeSelectMessage);
  }

  // Закрываем выбранное из хранилища сообщение
  closeSelectMessage() {
    const ifSelectedMessage = this.parentElement.querySelector('.media_select_container');
    if (!ifSelectedMessage) {
      return;
    }

    this.parentElement.querySelector('.media_select_container').replaceWith(this.messagesElement);
    this.messagesElement.scrollTop = this.messagesElement.scrollHeight
    - this.messagesElement.getBoundingClientRect().height;
  }

  // Показываем форму прикрепления файлов
  showAddForm() {
    this.addFormElement.classList.toggle('media_add_container_visible');
    this.clipElement.classList.toggle('media_form_clip_active');
  }

  // Отправка текстовых сообщений
  submitForm(event) {
    event.preventDefault();
    const inputValue = this.inputElement.value;
    if (!inputValue) {
      this.showError();
      return;
    }

    this.request.send('message', { text: this.inputElement.value, geo: this.geolocation.coords });
  }

  // Добавляем отправленное сообщение в конец
  addMessage(id, text, geo, date) {
    const messageElement = this.buildMessageElement('text', id, text, geo, date);
    messageElement.classList.add('media_messages_message_animation');
    messageElement.addEventListener('animationend', () => {
      messageElement.classList.remove('media_messages_message_animation');
    });
    this.messagesElement.append(messageElement);

    this.scrollBottom(messageElement);

    this.inputElement.value = '';
    this.geolocation.removeCoords();
  }

  // Добавляем отправленный файл в конец
  addFile(type, id, fileName, date) {
    const messageElement = this.buildMessageElement(type, id, fileName, date);
    messageElement.classList.add('media_messages_message_animation');
    this.messagesElement.append(messageElement);

    this.scrollBottom(messageElement);
  }

  // Показать точку для открытия дополнительного меню сообщения
  showMessageDot(event) {
    const dotElement = event.target.querySelector('.media_message_tools');
    dotElement.classList.add('media_message_tools_show');
    dotElement.addEventListener('click', this.showMessageTools);
  }

  // Скрыть точку для открытия дополнительного меню сообщения
  removeMessageDot(event) {
    const dotElement = event.target.querySelector('.media_message_tools');
    dotElement.classList.remove('media_message_tools_show');
    dotElement.classList.remove('media_message_tools_active');
    const toolsElement = event.target.querySelector('.media_message_tools_container');
    if (toolsElement) {
      dotElement.removeEventListener('click', this.closeMessageTools);
      toolsElement.remove();
    }
  }

  // Показать дополнительное меню сообщения
  showMessageTools(event) {
    const dotElement = event.target;
    dotElement.classList.add('media_message_tools_active');
    dotElement.removeEventListener('click', this.showMessageTools);
    dotElement.addEventListener('click', this.closeMessageTools);
    const toolsElement = DrawUI.createToolsElements();
    dotElement.after(toolsElement);

    const deleteElement = toolsElement.querySelector('.media_message_tools_delete');
    const pinElement = toolsElement.querySelector('.media_message_tools_pin');
    const favouriteElement = toolsElement.querySelector('.media_message_tools_favourite');
    deleteElement.addEventListener('click', this.deleteMessage);
    pinElement.addEventListener('click', this.pin.pinMessage);
    favouriteElement.addEventListener('click', this.favourites.addToFavourites);
  }

  // Скрыть дополнительное меню сообщения
  closeMessageTools(event) {
    const dotElement = event.target;
    const toolsElement = dotElement.closest('.media_message_header').querySelector('.media_message_tools_container');
    if (toolsElement) {
      toolsElement.remove();
    }
    dotElement.classList.toggle('media_message_tools_active');
    dotElement.removeEventListener('click', this.closeMessageTools);
    dotElement.addEventListener('click', this.showMessageTools);
  }

  // Запрос на удаление сообщения
  deleteMessage(event) {
    const messageId = this.messages.get(event.target.closest('.media_messages_message'));
    this.request.send('delete', messageId);
  }

  // Удаление элемента сообщения из ленты
  deleteMessageElement(messageId) {
    const ifSelectedMessage = this.parentElement.querySelector('.media_select_container');
    if (ifSelectedMessage) {
      this.closeSelectMessage();
      this.sidePanel.closeCategory();
    }

    if (this.pin.pinnedMessage === messageId) {
      this.pin.removePinnedMessage();
    }

    const messagesElement = [...this.messages.entries()]
      .filter(({ 1: id }) => id === messageId).map(([key]) => key);

    messagesElement.forEach((item) => {
      this.messages.delete(item);
      item.remove();
    });
  }

  // Прокрутка сообщений вниз по загрузке их содержимого
  scrollBottom(messageElement) {
    // Если содержимое - медийный элемент
    let checkLoad = messageElement.querySelectorAll('.media_message_body video, .media_message_body audio');
    [...checkLoad].forEach((element) => {
      element.addEventListener('loadeddata', () => {
        this.messagesElement.scrollTop = this.messagesElement.scrollHeight
            - this.messagesElement.getBoundingClientRect().height;
      });
    });
    // Если картинка
    checkLoad = messageElement.querySelectorAll('.media_message_body img');
    [...checkLoad].forEach((element) => {
      element.addEventListener('load', () => {
        this.messagesElement.scrollTop = this.messagesElement.scrollHeight
            - this.messagesElement.getBoundingClientRect().height;
      });
    });
    // Или если текст
    this.messagesElement.scrollTop = this.messagesElement.scrollHeight
            - this.messagesElement.getBoundingClientRect().height;
  }

  // Ошибка отправки пустого сообщения
  showError() {
    this.inputElement.classList.add('media_form_invalid');
    this.inputElement.addEventListener('keydown', this.removeError);
  }

  // Отключаем ошибку пустого сообщения
  removeError() {
    this.inputElement.classList.remove('media_form_invalid');
    this.inputElement.removeEventListener('keydown', this.removeError);
  }

  // Ошибка соединения
  connectionError() {
    const connectionErrorElement = DrawUI.createErrorConnectionElement();
    this.parentElement.querySelector('.media_container').append(connectionErrorElement);
  }
}