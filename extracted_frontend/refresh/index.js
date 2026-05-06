import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Axios } from '../../Axios';
import { BASE_URL } from '../../Axios/base_url';
import { base_url } from '../../consts';

// Define an initial state
const initialState = {
  data: null,
  loading: false,
  error: null,
};

// Define an async thunk for making an API request
export const fetchData = createAsyncThunk('example/fetchData', async () => {
  console.log('testoo')
  try {
    // console.log('test')
    // Replace this with your actual API call
    Axios({
      url: base_url + `user/refresh`,
      method: "post",
    }).then((res) => {
      if(res.status=='success'){

        localStorage.setItem("ouroubaToken", res?.result?.access_token);
      }
    // console.log(res)
    }).finally(()=>{
    });
  } catch (error) {
    throw Error('Error fetching data');
  }
});

// Create a slice with the initial state and reducer
const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the async thunk for use in other files
export {  };

// Export the reducer for use in the Redux store
export default exampleSlice.reducer;
