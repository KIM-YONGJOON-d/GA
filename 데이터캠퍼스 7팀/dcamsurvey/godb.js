
        document.getElementById("surveyForm").addEventListener("submit", function (event) {
     event.preventDefault();
 
     const formData = new FormData(event.target);
     const data = {};
 
     for (const [key, value] of formData.entries()) {
         data[key] = value;
     }
 
     const formattedData = {
         body: JSON.stringify(data)
     };
 
     console.log("Data sent to Lambda:", JSON.stringify(formattedData));
 
     sendDataToLambda(formattedData, function(response) {
         console.log("Lambda Response:", JSON.stringify(response));
     });
 });
 
 function sendDataToLambda(data, callback) {
     const apiGatewayUrl = "https://8onfc4i91a.execute-api.ap-northeast-2.amazonaws.com/dev"; // Replace with your actual API Gateway URL
     const xhr = new XMLHttpRequest();
     xhr.open("POST", apiGatewayUrl, true);
     xhr.setRequestHeader("Content-Type", "application/json");
 
     xhr.onreadystatechange = function () {
         if (xhr.readyState === XMLHttpRequest.DONE) {
             const responseBody = JSON.parse(xhr.responseText);
             callback(responseBody);
         }
     };
 
     xhr.send(JSON.stringify(data));
 }