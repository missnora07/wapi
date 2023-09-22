const axios = require("axios");
const express = require("express");
const { Module} = require("../main");
const app = express();
const port = 3000;
Module({on: 'message', fromMe: false}, async (m) => {   
app.get('/validate/bulk', async (req, res) => {
  let query = req.query.query;
  let xCount = (query.split('x').length - 1);
  
  if (query.length > 15) {
    return res.json({ error: "Invalid number" });
  } 

  if (xCount > 3) {
    return res.status(400).json({ error: "Maximum 'x' Limit is 3" });
  }
  
  if (!query.includes("x")) {
    return res.json({ error: "No 'x' found, please use normal WhatsApp validator API" });
  }
 
  if (!query) {
    return res.json({ error: "Please provide a number, e.g., 91628237xx78" });
  }

  try {
    let n = [];
  async function generateNumber(inputNumber) {
  const inputStr = inputNumber.toString();
  const xCount = (inputStr.match(/x/g) || []).length;
  const numbersArray = []; 
  function generateCombinations(currentIndex, currentResult) {
    if (currentIndex === xCount) {
      numbersArray.push(parseInt(currentResult, 10));
      return;
    }  
    for (let i = 0; i <= 9; i++) {
      const replacedNumber = i.toString();
      generateCombinations(currentIndex + 1, currentResult.replace('x', replacedNumber));
    }
  }
  generateCombinations(0, inputStr);
  return numbersArray;
}
const arr = await generateNumber(query);

const promises = arr.map(async (id) => {
  const result = await m.client.onWhatsApp(id + "");
  if (JSON.stringify(result).includes("true")) {
    return id;
  }
});

const results = await Promise.all(promises);
n = results.filter((result) => result !== undefined);

const notN = arr.filter((number) => !n.includes(number));

    const response = {
      status: "success", 
      registered: n,
      not_registered: notN
    };

    res.json(response, undefined, 2);

  } catch (error) {
    return res.status(500).json({ error: `An error occurred: ${error}` });
  }
});

app.get('/validate/onwa', async (req, res) => {
  let query = req.query.query;	
  try {
  	const [result] = await m.client.onWhatsApp(query+"")
  if(result.exists) {
  	const res =await m.client.fetchStatus(result.jid)
  const ppUrl = await m.client.profilePictureUrl(result.jid, 'image')
  const response = {
  number:"+"+query,
  onWa:result.exists,
  about:res.status,
  about_setAt:res.setAt,
  hd_profile_picture:ppUrl,
  jid:result.jid
  }
  } else {	
  const response = {
		number:"+"+query,
		onWa:result.exists
		} 
	} 
    res.json(response, undefined, 2);  
} catch (error) {
    return res.status(500).json({ error: `An error occurred: ${error}` });
  }
});

app.get('/validate/isbussines', async (req, res) => {
  let query = req.query.query;	
  try {
  	const profile = await m.client.getBusinessProfile(query+"@s.whatsapp.net")
  if(profile) {
    res.json(profile, undefined, 2);  
} else {
	return res.json({error:"Not a business profile"});
	} 
} catch (error) {
    return res.status(500).json({ error: `An error occurred: ${error}` });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
});
