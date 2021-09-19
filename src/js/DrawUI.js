export default class DrawUI {
  // шаблон cообщений в ленту
  static createMessageContainer(bodyElement, geo, date) {
    const dateFormat = new Intl.DateTimeFormat('ru', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const messageElement = document.createElement('div');
    messageElement.classList.add('media_messages_message');
    messageElement.innerHTML = `
      <div class="media_message_header">
        <div class="media_message_tools"></div>
      </div>
      <div class="media_message_body">
        ${bodyElement}
      </div>`;

    if (geo) {
      console.log(geo);
      messageElement.innerHTML += `
          <div class="media_message_geo">
            <div class="media_geo_icon"></div>
            <a href="https://yandex.ru/maps/?text=${geo}" target="_blank">[${geo}]</a>
          </div>`;
    }

    messageElement.innerHTML += `
      <div class="media_message_date">
        ${dateFormat.format(date)}
      </div>`;

    return messageElement;
  }

  // Элемент текстового сообщения ленты
  static createMessageElement(text, geo, date) {
    const textElement = `<p>${this.linkable(text)}</p>`;
    return DrawUI.createMessageContainer(textElement, geo, date);
  }

  // Элемент сообщения с изображением в ленту
  static createImageElement(url, fileName, geo, date) {
    const imageElement = `<img class="media_messages_image" src="${url}/${fileName}">`;
    return DrawUI.createMessageContainer(imageElement, geo, date);
  }

  // Элемент сообщения с видео в ленту
  static createVideoElement(url, fileName, geo, date) {
    const videoElement = `<video class="media_messages_video" src="${url}/${fileName}">`;
    return DrawUI.createMessageContainer(videoElement, geo, date);
  }

  // Элемент сообщения с видео в ленту
  static createAudioElement(url, fileName, geo, date) {
    const audioElement = `<audio class="media_messages_audio" src="${url}/${fileName}">`;
    return DrawUI.createMessageContainer(audioElement, geo, date);
  }

  // Элемент сообщения с произвольным файлом в ленту
  static createFileElement(url, fileName, geo, date) {
    const fileElement = `
      <div class="media_messages_file">
        <a href="${url}/${fileName}">
          <div class="media_messages_file_bg"></div>
        </a>
        <a href="${url}/${fileName}">${fileName}</a>
      </div>`;
    return DrawUI.createMessageContainer(fileElement, geo, date);
  }

  // Создаём элементы управления для сообщения (удалить, закрепить, избранное)
  static createToolsElements() {
    const toolsElements = document.createElement('div');
    toolsElements.classList.add('media_message_tools_container');
    toolsElements.innerHTML = `
            <div class="media_message_tools_delete"></div>
            <div class="media_message_tools_pin"></div>
            <div class="media_message_tools_favourite"></div>
          `;
    return toolsElements;
  }

  // создаем метку для избранного сообщения
  static getFavouriteMark() {
    const favouriteElement = document.createElement('div');
    favouriteElement.classList.add('media_message_favourite');
    return favouriteElement;
  }

  // Метка для прикрепленного сообщения
  static getPinMark() {
    const pinMarkElement = document.createElement('div');
    pinMarkElement.classList.add('media_message_pin');
    return pinMarkElement;
  }

  // Плашка закреплённого сообщения
  static getPinnedMessage(element) {
    const pinnedElement = document.createElement('div');
    pinnedElement.classList.add('media_pinned');
    pinnedElement.innerHTML = `
        <div class="media_pinned_container">
          ${element.innerHTML}
        </div>
        <div class="media_pinned_side">
          <div class="media_pinned_title">Закреплённое сообщение <div class="media_pinned_close"></div></div>
          <div class="media_pinned_select"></div>
        </div>
      `;
    return pinnedElement;
  }

  // Контейнер выбранного (selected) из хранилища сообщения
  static createSelectContainer(date) {
    const selectContainerElement = document.createElement('div');
    selectContainerElement.classList.add('media_messages', 'media_select_container');

    const dateFormat = new Intl.DateTimeFormat('ru', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    selectContainerElement.innerHTML = `
        <div class="media_select_header">
          Сообщение от ${dateFormat.format(date)}
          <div class="media_select_close"></div>
        </div>`;
    return selectContainerElement;
  }

  // Элемент отображения ошибки соединения
  static createErrorConnectionElement() {
    const connectionErrorElement = document.createElement('div');
    connectionErrorElement.classList.add('media_connection_error');
    console.log(connectionErrorElement);
    return connectionErrorElement;
  }

  // Элементы категорий хранилища
  static createSideElement(className, text, count) {
    const sideElement = document.createElement('li');
    sideElement.classList.add('media_side_item', className);
    sideElement.innerHTML = `${text}: <span>${count}</span>`;
    return sideElement;
  }

  // Заголовок открытой категории хранилища
  static createSideSubheadElement(text) {
    const subheadElement = document.createElement('div');
    subheadElement.classList.add('media_side_subhead');
    subheadElement.innerHTML = `<h3>${text}</h3><div class="media_side_close"></div>`;
    return subheadElement;
  }

  // Список для элементов открытой категории хранилища
  static createSideCategoryList() {
    const categoryListElement = document.createElement('ul');
    categoryListElement.classList.add('media_side_list');
    return categoryListElement;
  }

  // Основной шаблон для всех элементов открытой категории
  static createSideElementContainer(bodyElement) {
    const listElement = document.createElement('li');
    listElement.classList.add('media_side_item', 'media_side_open_item');
    listElement.innerHTML = `
          <div class="media_side_open_container">
            <div class="media_side_open_select"></div>
            <div class="media_side_open_element">
              ${bodyElement}
            </div>
          </div>
        `;
    return listElement;
  }

  // Вставляем элементы ссылок
  static createSideLinkElement(link) {
    const bodyElement = `<p><a href="${link}">${link}</a></p>`;
    const listElement = DrawUI.createSideElementContainer(bodyElement);
    return listElement;
  }

  // Элементы изображений
  static createSideImageElement(fileName, url) {
    const bodyElement = `<img class="media_messages_image" src="${url}/${fileName}">`;
    const listElement = DrawUI.createSideElementContainer(bodyElement);
    return listElement;
  }

  // Элементы видео
  static createSideVideoElement(fileName, url) {
    const bodyElement = `<video class="media_messages_video" src="${url}/${fileName}" controls></video>`;
    const listElement = DrawUI.createSideElementContainer(bodyElement);
    return listElement;
  }

  // Элементы аудио
  static createSideAudioElement(fileName, url) {
    const bodyElement = `<audio class="media_messages_audio" src="${url}/${fileName}" controls></audio>`;
    const listElement = DrawUI.createSideElementContainer(bodyElement);
    return listElement;
  }

  // Элементы файлов
  static createSideFileElement(fileName, url) {
    const bodyElement = `<p><a href="${url}/${fileName}">${fileName}</a></p>`;
    const listElement = DrawUI.createSideElementContainer(bodyElement);
    return listElement;
  }

  // Элемент описание категории избранного
  static createFavouritesDescription(count, dateFrom, dateTo) {
    const listElement = document.createElement('li');
    listElement.classList.add('media_side_item', 'media_side_open_item');

    const dateFormat = new Intl.DateTimeFormat('ru', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    listElement.innerHTML = `
          <div class="media_side_open_container">
            <div class="media_side_open_element">
              <p class="media_side_favourites_description">Всего сообщений: <b>${count}</b><br>
              С <b>${dateFormat.format(dateFrom)}</b><br>
              По <b>${dateFormat.format(dateTo)}</b></p>
            </div>
          </div>
        `;
    return listElement;
  }

  // Форма для отправки файла
  static getAddForm() {
    const addFormElement = document.createElement('label');
    addFormElement.classList.add('media_file_label');
    addFormElement.innerHTML = `
      <div class="media_file_input">Кликни или Кинь</div>
      <input type="file" class="media_file_hidden">`;
    return addFormElement;
  }

  // Форма для записи медиа (аудио/видео)
  static getMediaForm(type) {
    const mediaContainerElement = document.createElement('div');
    mediaContainerElement.classList.add('media_media_container');
    mediaContainerElement.innerHTML = `
          <div class="media_media_record"></div>
          <div class="media_media_status">
            Ожидание ${type}
          </div>
          <div class="media_media_stop"></div>`;
    return mediaContainerElement;
  }

  // Элемент с географическими координатами
  static createGeoElement(value) {
    console.log(value);
    const geoElement = document.createElement('div');
    geoElement.classList.add('media_geo');
    geoElement.innerHTML = `
          <div class="media_geo_icon"></div>
          [${value}]
          <div class="media_geo_close"></div>
          `;
    return geoElement;
  }

  // Ошибка недоступности записи медиа
  static errorMediaForm() {
    const mediaContainerElement = document.createElement('div');
    mediaContainerElement.classList.add('media_media_container');
    mediaContainerElement.innerHTML = `
          <div class="media_media_status">
            Ваш браузер не поддерживает запись медиа
          </div>`;
    return mediaContainerElement;
  }

  // Элемент для закрытия формы
  static getCloseForm() {
    const closeElement = document.createElement('div');
    closeElement.classList.add('media_form_close');
    return closeElement;
  }

  // Область для Drag and Drop
  static createDropPlace() {
    const dropplaceContainerElement = document.createElement('div');
    dropplaceContainerElement.classList.add('media_dropplace_container');
    dropplaceContainerElement.innerHTML = '<div class="media_dropplace"></div>';
    return dropplaceContainerElement;
  }

  // Делаем все ссылки в сообщении кликабельными
  static linkable(text) {
    const textWithLinks = text.replace(/((http:\/\/|https:\/\/){1}(www)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-?%#&-]*)*\/?)/gi, '<a href="$1">$1</a>');
    return textWithLinks;
  }
}
