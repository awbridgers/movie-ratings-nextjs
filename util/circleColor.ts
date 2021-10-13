const bad = {
  path:'#FF0800',
  trail: '#420C09',
  star:'#FF0800'
}
const mediocre = {
  path: '#FFD300',
  trail: '#614710',
  star: '#E56717'
}
 const good = {
   path:'#03AC13',
   trail: '#003B00',
   star: '#FFD700'
 }


export const circleColor = (rating: number) =>{
  if(rating < 4){
    return bad
  }
  if(rating >= 4 && rating < 6.9){
    return mediocre
  }
  return good
}