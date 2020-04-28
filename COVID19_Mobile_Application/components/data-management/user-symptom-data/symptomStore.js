import { createStore } from 'redux';
import reducer from './symptomReducers';

const symptomStore = createStore(reducer);

export default symptomStore;
