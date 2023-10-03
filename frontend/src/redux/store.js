import { rootReducers } from './rootReducer';
import { createStore } from 'redux';

const store = createStore(rootReducers);

export default store

