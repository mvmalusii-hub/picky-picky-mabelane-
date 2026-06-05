export const formatCurrency = (amount) => `R${amount}`;

export const truncate = (str, maxLen = 50) => str.length > maxLen ? str.slice(0, maxLen) + '…' : str;

export const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

export const copyToClipboard = (text) => navigator.clipboard.writeText(text);

export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
