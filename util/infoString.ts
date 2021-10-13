import { getDate } from './getDate';




const formatTime = (time:number) =>{
  const hours = Math.floor(time/60);
  const minutes = (time % 60)
  return `${hours}h ${minutes}m`
}


export const infoString = (date:Date, genres:{name:string,id:number}[], runtime:number)=>{
  const formatDate = getDate(date);
  
  let genreString = '';
  genres.forEach((item,i)=>{
    if(i === genres.length-1){
      //last item
      genreString += item.name
    }
    else{
      genreString+= `${item.name}, `
    }
  })
  return `${formatDate} | ${genreString} | ${formatTime(runtime)}`
}