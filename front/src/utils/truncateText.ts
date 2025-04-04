const truncateText = (text: string, maxLength = 12) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default truncateText;
