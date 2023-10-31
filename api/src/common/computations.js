// let pronvicialRate = {
//   sss: 4.3365385, // prev 4.3365385
//   pagibig: 1.00317308, // prev 0.7211538
//   philhealth: 0.4807692 // 0.4807692
// }

// let ncrRate = {
//   sss: 6.27375, // prev 6.274033846,
//   pagibig: 1.43, // prev 1.34682692
//   philhealth: 0.48 // prev 0.4807692
// }

var controller = {
  default_calculations: function (hours, fee, volFee, premFee) {
    let computedFeeByHr = parseFloat(hours * fee)
    let voluntaryFee = parseFloat(volFee)
    //  Comment out old computation
    //   parseFloat(hours * ncrRate.sss) + parseFloat(hours * ncrRate.pagibig) + parseFloat(hours * ncrRate.philhealth)

    // if (locationRate === 'Provincial') {
    //   voluntaryFee =
    //     parseFloat(hours * pronvicialRate.sss) +
    //     parseFloat(hours * pronvicialRate.pagibig) +
    //     parseFloat(hours * pronvicialRate.philhealth)
    // }
    let premiumFee = parseFloat(premFee)
    let appFee = parseFloat(hours * 1.25)
    let transactionFee = parseFloat(computedFeeByHr + voluntaryFee + appFee) * 0.1 // 10%
    let grossGigFee = parseFloat(computedFeeByHr + voluntaryFee + appFee + transactionFee + premiumFee)
    let grossVAT = parseFloat(grossGigFee * 0.12) // 12%
    let grossWithHolding = parseFloat(grossGigFee * 0.02) // 2%
    let serviceCost = parseFloat(grossGigFee + grossVAT - grossWithHolding)
    let jobsterTotal = parseFloat(fee) + voluntaryFee / hours

    return {
      computedFeeByHr,
      voluntaryFee,
      appFee,
      transactionFee,
      grossGigFee,
      grossVAT,
      grossWithHolding,
      serviceCost,
      jobsterTotal,
      premiumFee
    }
  },
  new_calculation : function(hours, fee, gigOffered, postingDays){
    const totalGigFee = gigOffered === 'Hourly' ? parseFloat(fee) * hours : parseFloat(fee)
    let totalGigFeeDaily = parseFloat(fee) * postingDays
    const voluntaryFee = 80.19
    const appFee = parseFloat(hours * 1.25)
    let feePerHr
    if (gigOffered === 'Hourly' || gigOffered == undefined) {
      feePerHr = parseFloat(fee)
    } else {
      feePerHr = (parseFloat(fee) - parseFloat(voluntaryFee).toFixed(2)) / hours
    }
    const computedFeeByHr = totalGigFee
    const computedDaily = totalGigFeeDaily - parseFloat(voluntaryFee)
    const dailyRate = parseFloat(fee)
    let transactionFee = parseFloat(totalGigFee + appFee + voluntaryFee) * 0.1
    // let txnFeeDaily = parseFloat(totalGigFeeDaily + appFee + voluntaryFee) * 0.1
    // console.log('🚀 ~ file: gigComputation.js:35 ~ calculations ~ txnFeeDaily:', txnFeeDaily)
    const grossGigFee = totalGigFee + appFee + parseFloat(transactionFee)
    const grossGigDaily = totalGigFeeDaily + appFee + parseFloat(transactionFee)
    const grossVAT = gigOffered === 'Daily' ? grossGigDaily * 0.12 : grossGigFee * 0.12 // 12%
    const grossWithHolding = gigOffered === 'Daily' ? grossGigDaily * 0.02 : grossGigFee * 0.02 // 2%
    const serviceCost =
      gigOffered === 'Daily' ? grossGigDaily + grossVAT - grossWithHolding : grossGigFee + grossVAT - grossWithHolding
  
    const jobsterTotal = parseFloat(fee)
  
    return {
      computedFeeByHr,
      computedDaily,
      grossGigDaily,
      voluntaryFee,
      appFee,
      transactionFee,
      grossGigFee,
      grossVAT,
      grossWithHolding,
      serviceCost,
      jobsterTotal
    }
  },
  parcel_calculations: function (hours, fee) {
    let computedFeeByHr = parseFloat(hours * fee)
    let transactionFee = parseFloat(computedFeeByHr * 0.06) // 6%
    let grossGigFee = parseFloat(computedFeeByHr + transactionFee)
    let grossVAT = parseFloat(grossGigFee * 0.12) // 12%
    let grossWithHolding = parseFloat(grossGigFee * 0.02) // 2%
    let serviceCost = parseFloat(grossGigFee + grossVAT - grossWithHolding)

    return {
      computedFeeByHr,
      transactionFee,
      grossGigFee,
      grossVAT,
      grossWithHolding,
      serviceCost
    }
  }
}

module.exports = controller
