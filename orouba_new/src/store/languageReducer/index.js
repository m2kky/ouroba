import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).getItem("ouroubaLanguage")
    ? (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).getItem("ouroubaLanguage")
    : "en",
};
const languageReducer = createSlice({
  initialState,
  name: "Language-Changer",
  reducers: {
    change: (state, action) => {
      state.language = action?.payload;
      (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).setItem("ouroubaLanguage", action?.payload);

      let hrefLink = (typeof window !== 'undefined' ? window.location : { href: '' }).href;
      let allElements = hrefLink.split("/");
      let lastElement = allElements[allElements.length - 1];
      let newLastElement =
        lastElement[0] + lastElement[1] == "ar"
          ? (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).getItem("ouroubaLanguage") == "ar"
            ? lastElement.replace("ar", "en")
            : lastElement.replace("ar", "ar")
          : (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).getItem("ouroubaLanguage") == "en"
          ? lastElement.replace("en", "ar")
          : lastElement.replace("en", "en");
      if (
        newLastElement?.replace("#", "") == "ar" &&
        (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).getItem("ouroubaLanguage") == "en"
      ) {
        (typeof window !== 'undefined' ? window.location : { href: '' }).href = (typeof window !== 'undefined' ? window.location : { href: '' }).href.replace("/ar", "/en");
      } else if (
        newLastElement?.replace("#", "") == "en" &&
        (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).getItem("ouroubaLanguage") == "ar"
      ) {
        (typeof window !== 'undefined' ? window.location : { href: '' }).href = (typeof window !== 'undefined' ? window.location : { href: '' }).href.replace("/en", "/ar");
      }

      // (typeof window !== 'undefined' ? window.location : { href: '' }).reload()
      return;

      // state.language = action?.payload;
      // (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).setItem("ouroubaLanguage", action?.payload);

      // let hrefLink = (typeof window !== 'undefined' ? window.location : { href: '' }).href;
      // let allElements = hrefLink.split('/');
      // console.log(allElements)

      // if(allElements.length>0){
      //   let lastElement=allElements[allElements.length-1]
      //   if(lastElement[0]+lastElement[1]=='ar'||lastElement[0]+allElements[1]=='en'){
      //     if(lastElement[0]+lastElement[1]=='ar'){
      //       lastElement.replace('ar','en');
      //       let new_arr=allElements.pop()
      //       new_arr.push(lastElement);
      //       let newLink='';
      //       for(let i=0;i<new_arr.length;i++){
      //         newLink+=new_arr[i];
      //       }
      //       (typeof window !== 'undefined' ? window.location : { href: '' }).href=newLink;
      //       (typeof window !== 'undefined' ? window.location : { href: '' }).reload()
      //     }
      //     else {
      //       lastElement.replace('en','ar');
      //       let new_arr=allElements.pop()
      //       new_arr.push(lastElement);
      //       let newLink='';
      //       for(let i=0;i<new_arr.length;i++){
      //         newLink+=new_arr[i];
      //       }
      //       (typeof window !== 'undefined' ? window.location : { href: '' }).href=newLink;
      //       (typeof window !== 'undefined' ? window.location : { href: '' }).reload()
      //     }
      //   }
      //   else {
      //     console.log('in this')
      //     let lastElement=allElements[allElements.length-1]
      //     console.log(lastElement)
      //     return
      //     lastElement.replace('en','ar');
      //     allElements[allElements.length]=lastElement
      //       let new_arr=allElements
      //       // new_arr.push(lastElement);
      //       let newLink='';
      //       for(let i=0;i<new_arr.length;i++){
      //         newLink+=new_arr[i];
      //       }
      //       (typeof window !== 'undefined' ? window.location : { href: '' }).href=newLink;
      //       (typeof window !== 'undefined' ? window.location : { href: '' }).reload()
      //   }

      // }
      // else {

      // }
    },
    change2: (state, action) => {
      state.language = action?.payload;
      (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).setItem("ouroubaLanguage", action?.payload);
      // (typeof window !== 'undefined' ? window.location : { href: '' }).reload()
    },
  },
});

export const { change, change2 } = languageReducer?.actions;
export default languageReducer?.reducer;
