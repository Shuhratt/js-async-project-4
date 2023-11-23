const regex = /[^a-zA-Z0-9]/g;

const formatLink = (text) => text.replaceAll(regex, '-');

export default formatLink;
