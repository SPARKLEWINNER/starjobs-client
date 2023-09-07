let provincialRate = {
  sss: 4.3365385, // prev 4.3365385
  pagibig: 1.00317308, // prev 0.7211538
  philhealth: 0.4807692 // 0.4807692
}

let ncrRate = {
  sss: 6.27375, // prev 6.274033846,
  pagibig: 1.43, // prev 1.34682692
  philhealth: 0.48 // prev 0.4807692
}

var controller = {
  default_calculations: function (hours, fee, locationRate, gigOffered) {
    const rate = locationRate === 'Provincial' ? provincialRate : ncrRate
    const voluntaryFee = Object.values(rate).reduce((total, rateValue) => total + hours * rateValue, 0)
    const appFee = gigOffered ? parseFloat(10) : hours * 1.25
    let feePerHr = gigOffered === 'Hourly' ? parseFloat(fee) : (parseFloat(fee) - parseFloat(voluntaryFee)) / hours
    const computedFeeByHr = gigOffered ? parseFloat(feePerHr * hours) : parseFloat(hours * fee)
    const transactionFee = gigOffered ? (parseFloat(fee) + appFee) * 0.1 : computedFeeByHr + voluntaryFee + appFee // 10%
    const grossGigFee = gigOffered
      ? parseFloat(fee) + appFee + transactionFee
      : computedFeeByHr + voluntaryFee + appFee + transactionFee
  
    const grossVAT = grossGigFee * 0.12 // 12%
    const grossWithHolding = grossGigFee * 0.02 // 2%
    const serviceCost = grossGigFee + grossVAT - grossWithHolding
    const jobsterTotal = gigOffered === 'Hourly' ? fee : fee + voluntaryFee / hours
  
    return {
      gigFeePerHr: parseFloat(feePerHr),
      computedFeeByHr,
      voluntaryFee,
      appFee,
      transactionFee,
      grossGigFee,
      grossVAT,
      grossWithHolding,
      serviceCost,
      jobsterTotal
    }
    // let computedFeeByHr = parseFloat(hours * fee)
    // let voluntaryFee =
    //   parseFloat(hours * ncrRate.sss) + parseFloat(hours * ncrRate.pagibig) + parseFloat(hours * ncrRate.philhealth)

    // if (locationRate === 'Provincial') {
    //   voluntaryFee =
    //     parseFloat(hours * pronvicialRate.sss) +
    //     parseFloat(hours * pronvicialRate.pagibig) +
    //     parseFloat(hours * pronvicialRate.philhealth)
    // }

    // let appFee = parseFloat(hours * 1.25)
    // let transactionFee = parseFloat(computedFeeByHr + voluntaryFee + appFee) * 0.1 // 10%
    // let grossGigFee = parseFloat(computedFeeByHr + voluntaryFee + appFee + transactionFee)
    // let grossVAT = parseFloat(grossGigFee * 0.12) // 12%
    // let grossWithHolding = parseFloat(grossGigFee * 0.02) // 2%
    // let serviceCost = parseFloat(grossGigFee + grossVAT - grossWithHolding)
    // let jobsterTotal = parseFloat(fee + voluntaryFee / hours)

    // return {
    //   computedFeeByHr,
    //   voluntaryFee,
    //   appFee,
    //   transactionFee,
    //   grossGigFee,
    //   grossVAT,
    //   grossWithHolding,
    //   serviceCost,
    //   jobsterTotal
    // }
  },
 newCalculation: function(hours, fee) {
    let newFee = parseFloat(fee)
    let appFee = parseFloat(10)
    let transactionFee = parseFloat(newFee + appFee) * 0.1 // 10%
    let grossGigFee = parseFloat(newFee + appFee + transactionFee)
    let grossVAT = parseFloat(grossGigFee * 0.12) // 12%
    let grossWithHolding = parseFloat(grossGigFee * 0.02) // 2%
    let serviceCost = parseFloat(grossGigFee + grossVAT - grossWithHolding)
  
    return {
      newFee,
      appFee,
      transactionFee,
      grossGigFee,
      grossVAT,
      grossWithHolding,
      serviceCost
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
