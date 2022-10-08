const axios = require("axios");

let getPInData = async (pincode) => {
    const URL = "https://api.postalpincode.in/pincode/" + pincode;
    const res = await axios.get(URL);
  
    const data = res.data[0];
    let infoMaster = {
      name:data.PostOffice[0].Name,
      district: data.PostOffice[0].District,
      country: data.PostOffice[0].Country,
      state: data.PostOffice[0].State,
    };
  
    return infoMaster;
  };


  module.exports={
    getPInData
  }
  