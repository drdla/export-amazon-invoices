// convert a UTF-8 string to an ArrayBuffer
export const str2ab = str => {
  const buf = new ArrayBuffer(str.length); // 1 byte for each char
  const bufView = new Uint8Array(buf);

  for (let i = 0, l = str.length; i < l; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf;
};

// convert an ArrayBuffer to an UTF-8 string
export const ab2str = buffer => {
  const bufView = new Uint8Array(buffer);
  let addition = Math.pow(2, 8) - 1;
  let result = '';

  for (let i = 0, l = bufView.length; i < l; i += addition) {
    if (i + addition > l) {
      addition = l - i;
    }

    result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
  }

  return result;
};
