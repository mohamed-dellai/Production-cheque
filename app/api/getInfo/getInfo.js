import  genAI from "../../google/init.js";
export async function getChequeInfo(path, prompt, clientOufour) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" , response_mime_type: "application/json"});

        const taskDescriptions = {
            cheque: `Task: Extract Key Information from a Cheque Image

            Follow these steps to extract specific information from a cheque image and format it into JSON.

            Steps:
            Cheque Number (chequeNum)

            Locate the word "chèque No°" or "cheque N°"
            Find the string of digits (6–10 digits long) near or following this word.
            Account Holder (owner)
            Look for the person name or societe writeen with computer not hand in the middle bottom section of the cheque.
            usualy there is a long number above the owner name
            Ignore the name in front of the phrase 'a l'ordre de' its not the name of the owner.
            Date (date)

            Identify a handwritten date in the format dd/MM/yyyy.
            always there is the word "Le" or "في" or both beside the date.
            Convert to ISO format (yyyy-MM-dd) for the JSON output.
            Amount (amount)

            Locate the  handwritten number in the top-right corner.
            Use dots as thounsaids seperater.
            the amount always like this 'B.P #{amount}#
            Bank Name (BankName)

            Extract the prominent name of the bank printed at the top of the cheque.
            Output Format:
            Provide the extracted details in this JSON structure:
            {
              "chequeNum": "<cheque number>",
              "owner": "<name of the owner>",
              "date": "<yyyy-MM-dd>",
              "amount": "<amount>",
              "BankName": "<bank name>"
            }
            Handling Missing Information:
            If any detail cannot be identified:

            Use "null" for that field.
            Maintain valid JSON formatting.
            Example Output (for reference):
            If the cheque details are:

            Cheque Number: 4001356
            Owner: SMART-HOUSE TUNISIE
            Date: 15/12/2024
            Amount: 2,000,000
            Bank Name: BANQUE ZITOUNA
            The JSON should be:

            {
              "chequeNum": "4001356",
              "owner": "SMART-HOUSE TUNISIE",
              "date": "2024-12-15",
              "amount": "2000,000",
              "BankName": "BANQUE ZITOUNA"
            }
            Key Rules:

            Extract only visible information without guessing.
            Ensure JSON is valid and follows the specified structure.
            if the photo is not a cheque photo return the json with all null fields only`,
            
            bondEchange: `You are tasked with extracting specific information from an image of a "Bon d'échange" (Bill of Exchange). The image contains the following details, and you must extract them accurately in JSON format:

            chequeNum: The cheque number located at the bottom of the document, which is usually more legible.
            owner: The text written under the label "payer à l'ordre de."
            date (date d'echeance): The date written under the label "Échéance." be carefull there are date echance and date creation always choose date d'echeance it should be greater than the other date you will find the date in this format dd/mm/yyyy.
            amount: The numeric value representing the total amount written both in numbers and words.
            BankName: The bank name written under the field "Nom et adresse du Tiré."
            Return the extracted information in this exact JSON format:

            {
              "chequeNum": "<value>",
              "owner": "<value>",
              "date": "<yyyy-MM-dd>",
              "amount": "<value>",
              "BankName": "<value>"
            }
            For example, if the information in the image is as follows:

            chequeNum: "010427202210" (from the bottom of the document)
            owner: "BIAT"
            date: "2025-02-2000"
            amount: "1333.940"
            BankName: "BIAT Ben Arous"
            Then your output should be:

            {
              "chequeNum": "010427202210",
              "owner": "BIAT",
              "date": "2025-02-2000",
              "amount": "1333.940",
              "BankName": "BIAT Ben Arous"
            }
            Focus on accuracy, and prioritize the cheque number located at the bottom of the document for better clarity. Ensure the information is aligned with the labels provided in the document.
            if the photo is not a bon d'echange photo return the json with all null fields only`,
            chequeFournisseur: `Task: Extract Key Information from a Cheque Image

            Follow these steps to extract specific information from a cheque image and format it into JSON.

            Steps:
            Cheque Number (chequeNum)

            Locate the word "chèque No°" or "cheque N°"
            Find the string of digits (6–10 digits long) near or following this word.
            Account Holder (owner)
            Look for the person name or societe writeen with hand usually they put it in front of the word "a l'ordre de " it correspond the name of the client that i will pay to him. 
            Date (date)

            Identify a handwritten date in the format dd/MM/yyyy.
            always there is the word "Le" or "في" or both beside the date.
            Convert to ISO format (yyyy-MM-dd) for the JSON output.
            Amount (amount)

            Locate the  handwritten number in the top-right corner.
            Use dots as thounsaids seperater.
            the amount always like this 'B.P #{amount}#
            Bank Name (BankName)

            Extract the prominent name of the bank printed at the top of the cheque.
            Output Format:
            Provide the extracted details in this JSON structure:
            {
              "chequeNum": "<cheque number>",
              "owner": "<name of the who is going to pay the cheque not the owner>",
              "date": "<yyyy-MM-dd>",
              "amount": "<amount>",
              "BankName": "<bank name>"
            }
            Handling Missing Information:
            If any detail cannot be identified:

            Use "null" for that field.
            Maintain valid JSON formatting.
            Example Output (for reference):
            If the cheque details are:

            Cheque Number: 4001356
            Owner: SMART-HOUSE TUNISIE
            Date: 15/12/2024
            Amount: 2,000,000
            Bank Name: BANQUE ZITOUNA
            The JSON should be:

            {
              "chequeNum": "4001356",
              "owner": "SMART-HOUSE TUNISIE",
              "date": "2024-12-15",
              "amount": "2000,000",
              "BankName": "BANQUE ZITOUNA"
            }
            Key Rules:

            Extract only visible information without guessing.
            Ensure JSON is valid and follows the specified structure.
            if the photo is not a cheque photo return the json with all null fields only`,
            bondEchangeFournisseur:`You are tasked with extracting specific information from an image of a "Bon d'échange" (Bill of Exchange). The image contains the following details, and you must extract them accurately in JSON format:

            chequeNum: The cheque number located at the bottom of the document, which is usually more legible.
            owner: The Name of the owner of the document most likely its not written but you will find it on stamp machine sign if you can figure it out write and dont confuse it with a l'ordre de its not the name of the owner if you dont find it write it empty string."
            date (date d'echeance): The date written under the label "Échéance." be carefull there are date echance and date creation always choose date d'echeance it should be greater than the other date you will find the date in this format dd/mm/yyyy.
            amount: The numeric value representing the total amount written both in numbers and words.
            BankName: The bank name written under the field "Nom et adresse du Tiré."
            Return the extracted information in this exact JSON format:

            {
              "chequeNum": "<value>",
              "owner": "<value>",
              "date": "<yyyy-MM-dd>",
              "amount": "<value>",
              "BankName": "<value>"
            }
            For example, if the information in the image is as follows:

            chequeNum: "010427202210" (from the bottom of the document)
            owner: "Amine"
            date: "2025-02-2000"
            amount: "1333.940"
            BankName: "BIAT Ben Arous"
            Then your output should be:

            {
              "chequeNum": "010427202210",
              "owner": "Amine",
              "date": "2025-02-2000",
              "amount": "1333.940",
              "BankName": "BIAT Ben Arous"
            }
            Focus on accuracy, and prioritize the cheque number located at the bottom of the document for better clarity. Ensure the information is aligned with the labels provided in the document.
            if the photo is not a bon d'echange photo return the json with all null fields only`
        };
        var taskDescription="";
        if(clientOufour==="a-payer"){
         taskDescription = prompt === "cheque" ? taskDescriptions.chequeFournisseur : taskDescriptions.bondEchange;
        }
        else{
            taskDescription = prompt === "cheque" ? taskDescriptions.cheque : taskDescriptions.bondEchangeFournisseur

        }
        const result = await model.generateContent([
            taskDescription,
            {
                inlineData: {
                    data: path,
                    mimeType: "image/jpg",
                },
            },
        ]);

        let responseText = result.response.text();
        responseText = responseText.replace(/```json\n|```|\\n/g, '').trim();
        console.log(responseText)
        return JSON.parse(responseText);
    } catch (e) {
        console.error("Error occurred in getChequeInfo:", e.message);
        console.error("Full error details:", e);
        throw new Error(`Error in getChequeInfo: ${e.message}`);
    }
}

