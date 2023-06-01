//store.js
import { proxy } from 'valtio';

const store = proxy({
  touchpoints: []
});

export default store;
