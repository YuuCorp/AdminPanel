type RSAkey = CryptoKey & { algorithm: { modulusLength: number } };

export async function rsaEncryption(item: string): Promise<string> {
  const enc = new TextEncoder();

  const itemBuffer = enc.encode(item);
  let publicRSA = await $fetch<string>("https://api.yuuko.dev/api/v1/public/rsa");
  publicRSA = publicRSA.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replaceAll('\n', '');
  const publicRSAData = str2ab(atob(publicRSA));
  const cryptoKey = await crypto.subtle.importKey('spki', publicRSAData, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']) as RSAkey;
  const chunkSize = cryptoKey.algorithm.modulusLength / 8 - 2 * 256 / 8 - 2;

  if (itemBuffer.byteLength > chunkSize)
    return abtob64(await splitToChunks(itemBuffer, chunkSize, cryptoKey, 'encrypt'));

  const encryptItem = await crypto.subtle.encrypt('RSA-OAEP', cryptoKey, itemBuffer);
  return abtob64(encryptItem);
}

async function splitToChunks(
  itemBuffer: Uint8Array | ArrayBuffer,
  chunkSize: number,
  RSA: RSAkey,
  type: 'encrypt' | 'decrypt'
) {
  const chunks = [];
  for (let i = 0; i < itemBuffer.byteLength; i += chunkSize) {
    chunks.push(itemBuffer.slice(i, i + chunkSize));
  }
  const workChunks: ArrayBuffer[] = [];
  for (const chunk of chunks) {
    if (type === 'encrypt') workChunks.push(await globalThis.crypto.subtle.encrypt('RSA-OAEP', RSA, chunk));
    else workChunks.push(await globalThis.crypto.subtle.decrypt('RSA-OAEP', RSA, chunk));
  }

  const workItem = new Uint8Array(workChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0));
  let offset = 0;
  for (const chunk of workChunks) {
    workItem.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  }
  return workItem;
}

function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function abtob64(buffer: Uint8Array | ArrayBuffer) {
  const binary = [];
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++)
    binary.push(String.fromCharCode(bytes[i]!));

  return btoa(binary.join(''));
}
