const numberOfDigits = num => (Math.log10((num ^ (num >> 31)) - (num >> 31)) | 0) + 1;

export default numberOfDigits;
