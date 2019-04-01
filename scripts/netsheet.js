$(document).ready(function(){
    $('#btnCalculate').click(function() {
       const salePrice = parseFloat($('#inputSalePrice').val());
       const totalExpenses = calculateExpenses(salePrice);
       const totalTaxes = $('#inputTaxProration').val() ? parseFloat($('#inputTaxProration').val()) : 0;
       const totalEquity = salePrice - totalExpenses - totalTaxes;

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

    function calculateExpenses(salePrice) {
        const insuranceTotal = calculateInsurance(salePrice);
        const feeTotal = calculateFees();
        const commissionTotal = calculateCommissions();

        return (insuranceTotal + feeTotal + commissionTotal);
    }

    function calculateInsurance(salePrice) {
        const existingPolicyAmount = $('#inputExistingPolicyAmount').val() ? parseFloat($('#inputExistingPolicyAmount').val()) : 0;
        const ownersPolicy = calculateOwnersPolicy(salePrice, existingPolicyAmount);

        return ownersPolicy;
    }

    function calculateOwnersPolicy(salePrice, existingPolicyAmount) {
        let i = 0;
        let policyPremium = 0.00;
        let remainingSale = Math.ceil(salePrice/1000);
        
        const priceBrackets = [150, 100, 250, 9500, 1];
        const premiums = [5.75, 4.5, 3.5, 2.75, 2.25];
        
        while (remainingSale > 0) {
            let currentBracket = priceBrackets[i];
            let currentPremium = premiums[i];
            
            if (remainingSale >= currentBracket) {
                policyPremium += currentBracket * 1.15 * currentPremium;
            } else {
                policyPremium += remainingSale * 1.15 * currentPremium;
            }

            remainingSale = remainingSale - currentBracket;
            i++;
        }

        const policyDiscount = existingPolicyAmount * 0.3;
        policyPremium = policyPremium - policyDiscount;

        $('#inputTitleDiscount').val(policyDiscount.toFixed(2));

        if (policyPremium < 200) {
            $('#inputOwnersPolicy').val(200.00);
            return 200.00;
        } else {
            $('#inputOwnersPolicy').val(policyPremium.toFixed(2));
            return policyPremium;
        }
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
