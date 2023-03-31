import { clickEventFunction } from './js/app'
import { updateDateElements } from './js/app'
import { addDestination } from './js/app'


import './styles/base.scss'
import './styles/input.scss'
import './styles/card.scss'
import './styles/responsive.scss'

document.addEventListener('click', clickEventFunction);
document.addEventListener('DOMContentLoaded', ()=>{    
    updateDateElements(new Date(), true);
});

document.getElementById('start-date-select').addEventListener('change', (event)=>{
    updateDateElements(event.target.value, false);
})

export {
    clickEventFunction,
    updateDateElements,
    addDestination
}