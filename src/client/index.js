import { getDetails, getPrevious, main, getCountryName, calculateDateDifference } from "./js/app";
import './styles/main.scss'
export{
  getDetails, getCountryName, calculateDateDifference
}
document.addEventListener('DOMContentLoaded', function(){
  document.querySelector('.continue').addEventListener('click', main);
});

document.addEventListener('DOMContentLoaded', function(){
  document.querySelector('.previous').addEventListener('click', getPrevious);
});
