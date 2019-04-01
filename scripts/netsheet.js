$(document).ready(function() {
    $('#btnExport').click(function() {
        const salePrice = parseFloat($('#inputSalePrice').val());
        const totalTaxes = $('#inputTaxProration').val() ? parseFloat($('#inputTaxProration').val()) : 0;
        const totalExpenses = calculateExpenses(salePrice, totalTaxes);
        const totalEquity = salePrice - totalExpenses;

        generateDocument(totalExpenses, totalEquity);
    });

    $('#btnCalculate').click(function() {
       const salePrice = parseFloat($('#inputSalePrice').val());
       const totalTaxes = $('#inputTaxProration').val() ? parseFloat($('#inputTaxProration').val()) : 0;
       const totalExpenses = calculateExpenses(salePrice, totalTaxes);
       const totalEquity = salePrice - totalExpenses;

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

    function calculateExpenses(salePrice, taxes) {
        const insuranceTotal = calculateInsurance(salePrice);
        const feeTotal = calculateFees();
        const commissionTotal = calculateCommissions();

        return (insuranceTotal + feeTotal + commissionTotal + taxes);
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

    function generateDocument(totalExpenses, totalEquity) {
        let doc = new jsPDF();

        generateHeaders(doc);
        generateData(doc, totalExpenses, totalEquity);
        doc.output('dataurlnewwindow');
        // doc.save('netsheet.pdf');
    }

    function generateHeaders(doc) {
        doc.setFontSize(40)
        doc.text('Seller Net Sheet', 10, 25);


        doc.setFontSize(20);
        doc.text('Property Details', 10, 45);
        doc.text('Taxes', 10, 80);
        doc.text('Existing Loans', 10, 102);
        doc.text('Title Charges', 10, 124);
        doc.text('Commissions', 10, 176);
        doc.text('Other Fees', 10, 198);
    }

    function generateData(doc, totalExpenses, totalEquity) {
        doc.setFontSize(14);

        const salePrice = parseFloat($('#inputSalePrice').val());
        const closingDate = $('#inputClosingDate').val();
        const address = $('#inputAddr').val();
        const county = $('#inputCounty').val();

        doc.text('Sale Price: $' + `${salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 18, 52);
        doc.text('Closing Date: ' + `${closingDate}`, 18, 58);
        doc.text('Address: ' + `${address}`, 18, 64);
        doc.text('County: ' + `${county}`, 18, 70);

        const transferFees = parseFloat($('#inputTransferFees').val()) ? parseFloat($('#inputTransferFees').val()) : 0;
        const propTaxes = parseFloat($('#inputTaxProration').val()) ? parseFloat($('#inputTaxProration').val()) : 0;

        doc.text('Transfer Fees: $' + `${transferFees}`, 18, 86);
        doc.text('Prorated Taxes: $' + `${propTaxes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 18, 92);

        const firstMortgage = parseFloat($('#inputMortFirst').val()) ? parseFloat($('#inputMortFirst').val()) : 0;
        const secondMortgage = parseFloat($('#inputMortSecond').val()) ? parseFloat($('#inputMortSecond').val()) : 0;

        doc.text('First Mortgage: $' + `${firstMortgage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 18, 108);
        doc.text('Second Mortage: $' + `${secondMortgage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 18, 114);

        const ownersInsurance = parseFloat($('#inputOwnersPolicy').val()) ? parseFloat($('#inputOwnersPolicy').val()) : 200;
        const closingFee = parseFloat($('#inputClosingFee').val()) ? parseFloat($('#inputClosingFee').val()) : 0;
        const deedPrep = parseFloat($('#inputDocFee').val()) ? parseFloat($('#inputDocFee').val()) : 0;
        const binderFee = parseFloat($('#inputTitleBinderFee').val()) ? parseFloat($('#inputTitleBinderFee').val()) : 0;
        const courierFee = parseFloat($('#inputCourierFee').val()) ? parseFloat($('#inputCourierFee').val()) : 0;
        const searchFee = parseFloat($('#inputSearchFee').val()) ? parseFloat($('#inputSearchFee').val()) : 0;
        const recordingFee = parseFloat($('#inputRecordingFee').val()) ? parseFloat($('#inputRecordingFee').val()) : 0;

        doc.text('Owner\'s Title Insurance: $' + `${ownersInsurance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 18, 130);
        doc.text('Closing Fee: $' + `${closingFee}`, 18, 136);
        doc.text('Deed Prep: $' + `${deedPrep}`, 18, 142);
        doc.text('Binder Fee: $' + `${binderFee}`, 18, 148);
        doc.text('Courier Fee: $' + `${courierFee}`, 18, 154);
        doc.text('Search Fee: $' + `${searchFee}`, 18, 160);
        doc.text('Recording Fee: $' + `${recordingFee}`, 18, 166);

        const saleCommission = $('#inputSaleCommTotal').val() ? parseFloat($('#inputSaleCommTotal').val()) : 0;
        const listCommission = $('#inputListCommTotal').val() ? parseFloat($('#inputListCommTotal').val()) : 0;

        doc.text('Sale Commission: $' + `${saleCommission}`, 18, 182);
        doc.text('List Commission: $' + `${listCommission}`, 18, 188);

        const homeWarranty = parseFloat($('#inputTransferFees').val()) ? parseFloat($('#inputTransferFees').val()) : 0;
        const gasWarranty = parseFloat($('#inputTransferFees').val()) ? parseFloat($('#inputTransferFees').val()) : 0;
        const addlCosts = parseFloat($('#inputTransferFees').val()) ? parseFloat($('#inputTransferFees').val()) : 0;

        doc.text('Home Warranty: $' + `${homeWarranty}`, 18, 204);
        doc.text('Gas Line Warranty: $' + `${gasWarranty}`, 18, 210);
        doc.text('Additional Costs: $' + `${addlCosts}`, 18, 216);

        let feeNames = [];
        let i = 0;
        let yPos = 222;

        $('.fee-name').each(function() {
            const name = $(this).val();

            feeNames.push(name);
        })

        $('.custom-fee').each(function() {
            const fee = $(this).val() ? parseFloat($(this).val()) : 0;

            doc.text(`${feeNames[i]}: $` + `${fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 18, yPos);
            i++;
            yPos += 6;
        });

        doc.line(6, yPos, 180, yPos);

        doc.setFontSize(20);

        doc.text('Total Selling Expenses: $' + `${totalExpenses.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 10, yPos + 10);
        doc.text('Total Estimated Equity: $' + `${totalEquity.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 10, yPos + 20);
    }
});
