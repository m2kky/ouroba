import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: localStorage.getItem("ouroubaLanguage")
    ? localStorage.getItem("ouroubaLanguage")
    : "en",
};
const languageReducer = createSlice({
  initialState,
  name: "Language-Changer",
  reducers: {
    change: (state, action) => {
      state.language = action?.payload;
      localStorage.setItem("ouroubaLanguage", action?.payload);

      let hrefLink = window.location.href;
      let allElements = hrefLink.split("/");
      let lastElement = allElements[allElements.length - 1];
      let newLastElement =
        lastElement[0] + lastElement[1] == "ar"
          ? lastElement.replace("ar", "en")
          : lastElement.replace("en", "ar");

      window.location.href =
        newLastElement == "ar"
          ? window.location.href.replace("/en", "/ar")
          : window.location.href.replace("/ar", "/en");
      window.location.href = newLastElement;
      // window.location.reload()
      return;

      // state.language = action?.payload;
      // localStorage.setItem("ouroubaLanguage", action?.payload);

      // let hrefLink = window.location.href;
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
      //       window.location.href=newLink;
      //       window.location.reload()
      //     }
      //     else {
      //       lastElement.replace('en','ar');
      //       let new_arr=allElements.pop()
      //       new_arr.push(lastElement);
      //       let newLink='';
      //       for(let i=0;i<new_arr.length;i++){
      //         newLink+=new_arr[i];
      //       }
      //       window.location.href=newLink;
      //       window.location.reload()
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
      //       window.location.href=newLink;
      //       window.location.reload()
      //   }

      // }
      // else {

      // }
    },
    change2: (state, action) => {
      state.language = action?.payload;
      localStorage.setItem("ouroubaLanguage", action?.payload);
      // window.location.reload()
    },
  },
});

export const { change, change2 } = languageReducer?.actions;
export default languageReducer?.reducer;
