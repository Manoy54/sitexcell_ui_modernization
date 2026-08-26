import { nextAccessRunIdentifier } from './run-id.js';

console.log(JSON.stringify(await nextAccessRunIdentifier()));
