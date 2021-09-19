import DrawUI from './DrawUI';

export default class SidePanel {
  constructor(element, messageClass, requestClass) {
    this.parentElement = element;
    this.listElement = this.parentElement.querySelector('.media_side_list');

    // Заводим вспомогательные классы
    this.messageClass = messageClass;
    this.request = requestClass;

    // Привязываем контекст
    this.render = this.render.bind(this);
    this.closeCategory = this.closeCategory.bind(this);
    this.showCategoryItems = this.showCategoryItems.bind(this);
    this.showFavouritesDescription = this.showFavouritesDescription.bind(this);

    // Объект с категориями из хранилища
    this.categoryItems = {
      links: { class: 'media_side_links', text: 'Ссылки', handler: DrawUI.createSideLinkElement },
      favourites: { class: 'media_side_favourites', text: 'Избранное', handler: DrawUI.createSideFavouriteElement },
      image: { class: 'media_side_images', text: 'Изображения', handler: DrawUI.createSideImageElement },
      file: { class: 'media_side_files', text: 'Файлы', handler: DrawUI.createSideFileElement },
      video: { class: 'media_side_videos', text: 'Видео', handler: DrawUI.createSideVideoElement },
      audio: { class: 'media_side_audios', text: 'Аудио', handler: DrawUI.createSideAudioElement },
    };
  }

  // Отрисовываем список категорий хранилища
  render(data) {
    this.listElement.innerHTML = '';
    // eslint-disable-next-line guard-for-in
    for (const type in data) {
      const sideElement = DrawUI.createSideElement(
        this.categoryItems[type].class, this.categoryItems[type].text, data[type],
      );
      this.listElement.append(sideElement);
      if (data[type] > 0) {
        sideElement.addEventListener('click', () => this.requestCategoryItems(type));
      }
    }
  }

  // Запрос элементов выбранной категории из базы данных
  requestCategoryItems(type) {
    // Запрос избранных сообщений для отрисовки в основной ленте
    if (type === 'favourites') {
      this.category = 'favourites';
      this.openCategory(this.categoryItems[type].text);
      while (this.messageClass.messagesElement.firstChild) {
        this.messageClass.messagesElement.removeChild(this.messageClass.messagesElement.firstChild);
      }
      this.messageClass.messages.clear();
      this.request.send('favouritesLoad');
      return;
    }

    this.openCategory(this.categoryItems[type].text);
    this.request.send('storage', type);
  }

  // Открытие категории хранилища
  openCategory(text) {
    const subheadElement = DrawUI.createSideSubheadElement(text);
    const closeElement = subheadElement.querySelector('.media_side_close');
    this.listElement.replaceWith(subheadElement);
    closeElement.addEventListener('click', this.closeCategory);
  }

  // Закрываем категорию, возвращаем список
  closeCategory() {
    this.parentElement.querySelector('.media_side_subhead').remove();
    this.parentElement.querySelector('.media_side_list').remove();

    // Закрытие всех избранных сообщений
    if (this.category === 'favourites') {
      while (this.messageClass.messagesElement.firstChild) {
        this.messageClass.messagesElement.removeChild(this.messageClass.messagesElement.firstChild);
      }
      this.messageClass.messages.clear();
      this.request.send('load');
      this.parentElement.append(this.listElement);
      this.category = '';
      return;
    }

    this.parentElement.append(this.listElement);
    this.messageClass.closeSelectMessage();
  }

  // Отрисовываем элементы категории
  showCategoryItems(data) {
    const categoryListElement = DrawUI.createSideCategoryList();
    for (const item of data.data) {
      const categoryElement = this.categoryItems[data.category]
        .handler(item.name, this.request.server);
      categoryListElement.append(categoryElement);
      categoryElement.querySelector('.media_side_open_select').addEventListener('click', () => this.request.send('select', item.messageId));
    }
    this.parentElement.append(categoryListElement);
  }

  // Показ описание категории избранного
  showFavouritesDescription(data) {
    const categoryListElement = DrawUI.createSideCategoryList();
    const descriptionElement = DrawUI.createFavouritesDescription(
      data.length, data[data.length - 1].date, data[0].date,
    );
    categoryListElement.append(descriptionElement);
    this.parentElement.append(categoryListElement);
  }
}
