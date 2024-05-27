import uuid from 'react-native-uuid';

export function generateSecureUserId(length = 8) {
  const uuidValue = uuid.v4();
  let hash = 0;
  for (let i = 0; i < uuidValue.length; i++) {
    const char = uuidValue.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hashStr = Math.abs(hash).toString(36);
  return hashStr.slice(0, length).padEnd(length, '0'); // Ensure it has at least `length` characters
}
