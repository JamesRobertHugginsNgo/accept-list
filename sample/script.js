import * as AcceptList from '../src/index.js';

const accept = 'text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8';

const acceptList = AcceptList.parse(accept);
console.log('ACCEPT LIST', acceptList);

console.log('OBJECT', AcceptList.match(acceptList, { 'text/plain': 'first', 'text/html': 'second' }));
console.log('ARRAY', AcceptList.match(acceptList, ['text/plain', 'application/xhtml+xml']));
console.log('REGEX', AcceptList.match(acceptList, /^image\/(webp)$/));
