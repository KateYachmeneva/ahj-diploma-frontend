import DrawUI from './DrawUI';

export default class FileLoader {
  constructor(element, geoClass, requestClass) {
    // Выделяем элементы
    this.parentElement = element;
    this.formElement = this.parentElement.querySelector('.media_form');
    this.mainElement = this.parentElement.querySelector('.media_main');
    this.clipElement = this.formElement.querySelector('.media_form_clip');
    this.inputElement = this.formElement.querySelector('.media_form_input');
    this.buttonElement = this.formElement.querySelector('.media_file_button');
    this.dropplace = this.parentElement.querySelector('.media_dropplace');

    // Вспомогательные классы
    this.geolocation = geoClass;
    this.request = requestClass;

    // Привязываем контекст
    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.showDropPlace = this.showDropPlace.bind(this);
    this.hideDropPlace = this.hideDropPlace.bind(this);
    this.loadFile = this.loadFile.bind(this);
  }

  // Открываем форму прикрепления файла
  openForm() {
    while (this.formElement.firstChild) {
      this.formElement.removeChild(this.formElement.firstChild);
    }
    this.closeElement = DrawUI.getCloseForm();
    this.addFormElement = DrawUI.getAddForm();
    this.formElement.append(this.closeElement, this.addFormElement, this.clipElement);

    if (this.geolocation.coords) {
      this.formElement.append(this.geolocation.geoElement);
    }

    this.inputFileElement = this.addFormElement.querySelector('input.media_file_hidden');
    this.dropplace = DrawUI.createDropPlace();
    this.mainElement.prepend(this.dropplace);
    this.closeElement.addEventListener('click', this.closeForm);
    this.mainElement.addEventListener('dragover', this.showDropPlace);
    this.dropplace.addEventListener('dragleave', this.hideDropPlace);
    this.dropplace.addEventListener('drop', this.loadFile);
    this.inputFileElement.addEventListener('change', this.loadFile);
  }

  // Закрываем форму
  closeForm() {
    this.closeElement.remove();
    this.clipElement.classList.remove('media_form_clip_active');
    this.addFormElement.replaceWith(this.inputElement);
  }

  // Отображаем область Drag and Drop
  showDropPlace(event) {
    event.preventDefault();
    this.dropplace.style.visibility = 'visible';
  }

  // Скрываем область Drag and Drop
  hideDropPlace() {
    this.dropplace.style.visibility = 'hidden';
  }

  // Отправляем файл
  loadFile(event) {
    event.preventDefault();

    const file = this.inputFileElement.files[0] || event.dataTransfer.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('geo', this.geolocation.coords);

    this.request.sendFile(formData);

    this.hideDropPlace();
    this.mainElement.removeEventListener('dragover', this.showDropPlace);
    this.closeForm();
    this.geolocation.removeCoords();
  }
}
