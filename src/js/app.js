import Media from './Media';

const media = new Media(document.querySelector('.media_organaizer'), 'https://media-organaizer.herokuapp.com');
console.log(media);
media.init();
