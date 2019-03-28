$(document).ready(function(){
    $('#btnCalculate').click(function() {
       const saleTotal = parseInt($('#inputSalePrice').val());
       const totalExpenses = calculateExpenses(saleTotal);
       const totalEquity = saleTotal - totalExpenses;

       $('#inputTotalExpenses').val(totalExpenses);
       $('#inputSellerEquity').val(totalEquity);
    });

    $('#inputSalePrice').keyup(function() {
        updatePriceAndCommissions();
    });

    $('#inputSaleRate').keyup(function() {
        updatePriceAndCommissions();
    });

    $('#inputListRate').keyup(function() {
        updatePriceAndCommissions();
    });

    function updatePriceAndCommissions() {
        
    }

    function calculateExpenses(saleTotal) {
        const taxTotal = calculateTaxes(saleTotal);
        const feeTotal = calculateFees();

        return taxTotal + feeTotal;
    }

    function calculateTaxes(saleTotal) {
        return 0;
    }

    function calculateFees() {
        const firstMortgageBalance = $('#inputMortFirst').val() ? parseInt($('#inputMortFirst').val()) : 0;
        const secondMortgageBalance = $('#inputMortSecond').val() ? parseInt($('#inputMortSecond').val()) : 0;
        const mortgageTotal = firstMortgageBalance + secondMortgageBalance;

        const transferFees = $('#inputTransferFees').val() ? parseInt($('#inputTransferFees').val()) : 0;

        const saleCommission = $('#inputSaleCommTotal').val() ? parseInt($('#inputSaleCommTotal').val()) : 0;
        const listCommission = $('#inputListCommTotal').val() ? parseInt($('#inputListCommTotal').val()) : 0;

        const feeTotal = mortgageTotal + transferFees;

        return feeTotal;
    }
});


// var doc = new jsPDF()

// doc.text('Hello world!', 10, 10)
// doc.save('a4.pdf')