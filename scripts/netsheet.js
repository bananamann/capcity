$(document).ready(function(){
    $('#btnCalculate').click(function() {
       const saleTotal = parseFloat($('#inputSalePrice').val());
       const totalExpenses = calculateExpenses(saleTotal);
       const totalEquity = saleTotal - totalExpenses - totalTaxes;

       $('#inputTotalExpenses').val(totalExpenses.toFixed(2));
       $('#inputSellerEquity').val(totalEquity.toFixed(2));
    });

    $('#btnAddCustomFee').click(function() {
        const customFeeCount = $('.custom-fee-container').length;
        $('.custom-fee-container').last().after(`<div class="form-row custom-fee-container">
                                                    <div class="col-sm-5">
                                                        <div class="input-group">
                                                            <input class="form-control fee-name col-sm-4" value="Custom Fee ${customFeeCount + 1}">
                                                            <div class="input-group-prepend">
                                                                <span class="input-group-text" id="basic-addon1">$</span>
                                                            </div>
                                                            <input class="form-control custom-fee">
                                                        </div>
                                                    </div>
                                                </div>`);
    });

    $('#inputSalePrice').keyup(function() {
        updateCommissions();
    });

    $('#inputSaleRate').keyup(function() {
        updateCommissions();
    });

    $('#inputListRate').keyup(function() {
        updateCommissions();
    });

    $('#inputClosingDate').blur(function() {
        let prorationDays = 0;
        const closingDate = new Date($(this).val());
        const annualTaxes = $('#inputAnnualTax').val() ? parseFloat($('#inputAnnualTax').val()) : 0;

        if(closingDate > new Date()) {
            const yearStart = new Date(`1/1/${closingDate.getFullYear()}`);
            const daysFromYearStart = Math.ceil((closingDate - yearStart)/1000/60/60/24);
            prorationDays = (closingDate.getMonth() + 1) < 6 ? 180 + daysFromYearStart : daysFromYearStart - 1;

            $('#inputTaxDays').val(prorationDays);
        }

        updateTaxes(annualTaxes, prorationDays);
    });

    $('#inputAnnualTax').blur(function() {
        const annualTaxes = $(this).val();
        const prorationDays = $('#inputTaxDays').val() ? parseFloat($('#inputTaxDays').val()) : 0;

        updateTaxes(annualTaxes, prorationDays);
    });

    function updateTaxes(annualTaxes, prorationDays) {
        $('#inputTaxProration').val((annualTaxes * (prorationDays / 365)).toFixed(2));
    }

    function updateCommissions() {
        const salePrice = $('#inputSalePrice').val() ? parseFloat($('#inputSalePrice').val()) : 0;
        const saleRate = $('#inputSaleRate').val() ? parseFloat($('#inputSaleRate').val()) : 0;
        const listRate = $('#inputListRate').val() ? parseFloat($('#inputListRate').val()) : 0;

        const saleCommTotal = (salePrice * saleRate / 100).toFixed(2);
        const listCommTotal = (salePrice * listRate / 100).toFixed(2);

        $('#inputSaleCommTotal').val(saleCommTotal);
        $('#inputListCommTotal').val(listCommTotal);
    }

    function calculateExpenses(saleTotal) {
        const insuranceTotal = calculateInsurance(saleTotal);
        const feeTotal = calculateFees();
        const commissionTotal = calculateCommissions();

        return insuranceTotal + feeTotal + commissionTotal;
    }

    function calculateInsurance(saleTotal) {
        const existingPolicyAmount = $('#inputExistingPolicy').val() ? parseFloat($('#inputExistingPolicy').val()) : 0;

        

        return ;
    }

    function calculateFees() {
        const firstMortgageBalance = $('#inputMortFirst').val() ? parseFloat($('#inputMortFirst').val()) : 0;
        const secondMortgageBalance = $('#inputMortSecond').val() ? parseFloat($('#inputMortSecond').val()) : 0;
        const mortgageTotal = firstMortgageBalance + secondMortgageBalance;

        const transferFees = $('#inputTransferFees').val() ? parseFloat($('#inputTransferFees').val()) : 0;

        const closingFee = $('#inputClosingFee').val() ? parseFloat($('#inputClosingFee').val()) : 0;
        const docFee = $('#inputDocFee').val() ? parseFloat($('#inputDocFee').val()) : 0;
        const binderFee = $('#inputTitleBinderFee').val() ? parseFloat($('#inputTitleBinderFee').val()) : 0;
        const courierFee = $('#inputCourierFee').val() ? parseFloat($('#inputCourierFee').val()) : 0;
        const searchFee = $('#inputSearchFee').val() ? parseFloat($('#inputSearchFee').val()) : 0;
        const recordingFee = $('#inputRecordingFee').val() ? parseFloat($('#inputRecordingFee').val()) : 0;

        const transactionFeeTotal = closingFee + docFee + binderFee + courierFee + searchFee +  recordingFee

        const homeWarrantyFee = $('#inputHomeWarranty').val() ? parseFloat($('#inputHomeWarranty').val()) : 0;
        const gasWarrantyFee = $('#inputGasWarranty').val() ? parseFloat($('#inputGasWarranty').val()) : 0;
        const additionalCosts = $('#inputAddlCosts').val() ? parseFloat($('#inputAddlCosts').val()) : 0;
        const customFees = calculateCustomFees();

        const otherFeeTotal = homeWarrantyFee + gasWarrantyFee + additionalCosts + customFees;

        const totalFees = mortgageTotal + transferFees + transactionFeeTotal + otherFeeTotal;

        return totalFees;
    }

    function calculateCustomFees() {
        let customFeeTotal = 0;
        $('.custom-fee').each(function() {
            const fee = $(this).val() ? parseFloat($(this).val()) : 0;

            customFeeTotal += fee;
        });

        return customFeeTotal;
    }

    function calculateCommissions() {
        const saleCommission = $('#inputSaleCommTotal').val() ? parseFloat($('#inputSaleCommTotal').val()) : 0;
        const listCommission = $('#inputListCommTotal').val() ? parseFloat($('#inputListCommTotal').val()) : 0;

        const commissionTotal = saleCommission + listCommission;

        return commissionTotal;
    }
});


// var doc = new jsPDF()

// doc.text('Hello world!', 10, 10)
// doc.save('a4.pdf')