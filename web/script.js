
$(function() {
  $('[data-toggle="datepicker"]').datepicker();
  
  const formElement = document.getElementById("saveTransaction");
  
  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    let transactionDescription = document.getElementById("transactionDescription").value;
    let transactionPrice = document.getElementById("transactionPrice").value;
    let transactionDate = $.datepicker.formatDate('yy-mm-dd', new Date(document.getElementById("transactionDate").value));

    let transaction = {
      transactionDescription: transactionDescription,
      transactionPrice: transactionPrice,
      transactionDate: transactionDate
    };
    let transactionJson = JSON.stringify(transaction);
  
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
  
    fetch('http://localhost:3000/reservas', {
      method: 'POST',
      headers: headers,
      body: transactionJson
    })
      .then(response => response.json())
      .then(data => {
        console.log(`${data.transactionDescription}: ${data.transactionPrice}`);
        console.log("Fecha:", data.transactionDate);
      })
      .catch(error => {
        console.error("Error al guardar la reserva:", error);
      });
  });
});

