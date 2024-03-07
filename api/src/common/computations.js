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
  default_calculations: function (hours, fee, volFee, premFee, holiday, late, gigExtentionHr, nightSurgeHr) {
    let lateByHours = parseFloat(late) / parseFloat(60)
    if (late === null || late === undefined) {
      lateByHours = 0
    }
    let holidaySurge
    if (!holiday) {
      holidaySurge = parseFloat(0)
    } else {
      holidaySurge = parseFloat(holiday)
    }

    const lateDeduction = parseFloat(lateByHours * fee)
    const finalHours = hours - lateByHours
    const nightSurge = parseFloat(fee) * 0.1 * parseFloat(nightSurgeHr)
    const gigExtension = parseFloat(fee) * 1.25 * parseFloat(gigExtentionHr)

    let computedFeeByHr = parseFloat(finalHours * fee)
    let voluntaryFee = parseFloat(volFee)
    //  Comment out old computation
    //   parseFloat(hours * ncrRate.sss) + parseFloat(hours * ncrRate.pagibig) + parseFloat(hours * ncrRate.philhealth)

    // if (locationRate === 'Provincial') {
    //   voluntaryFee =
    //     parseFloat(hours * pronvicialRate.sss) +
    //     parseFloat(hours * pronvicialRate.pagibig) +
    //     parseFloat(hours * pronvicialRate.philhealth)
    // }
    console.log('lateByHours' + lateByHours)
    console.log('FEE ' + fee)
    console.log('volFee ' + voluntaryFee)
    console.log('premFee ' + premFee)
    console.log('nightSurgeHr ' + nightSurgeHr)
    console.log('nightSurgeHr  nightSurgeHr ' + nightSurgeHr)
    console.log('nightSurge  ' + nightSurge)

    console.log('gigExtentionHr gigExtentionHr  ' + gigExtentionHr)
    console.log('gigExtentionHr ' + gigExtension)

    console.log('holidaySurge ' + holidaySurge)
    console.log('holiday ' + holiday)

    let premiumFee = parseFloat(premFee)
    let appFee = parseFloat(finalHours * 1.25)
    let transactionFee = parseFloat(computedFeeByHr + voluntaryFee + appFee) * 0.1 // 10%
    let grossGigFee = parseFloat(
      computedFeeByHr + voluntaryFee + appFee + transactionFee + premiumFee + nightSurge + gigExtension + holidaySurge
    )

    let grossVAT = parseFloat(grossGigFee * 0.12) // 12%
    let grossWithHolding = parseFloat(grossGigFee * 0.02) // 2%
    let serviceCost = parseFloat(grossGigFee + grossVAT - grossWithHolding)
    // let jobsterTotal = parseFloat(fee) + voluntaryFee / hours
    let jobsterFinal = parseFloat(computedFeeByHr + voluntaryFee + nightSurge + gigExtension + holidaySurge)

    return {
      computedFeeByHr,
      voluntaryFee,
      appFee,
      transactionFee,
      grossGigFee,
      grossVAT,
      grossWithHolding,
      serviceCost,
      // jobsterTotal,
      premiumFee,
      nightSurge,
      gigExtension,
      jobsterFinal,
      holidaySurge,
      lateDeduction
    }
  },
  new_calculation: function (hours, fee, gigOffered, postingDays, late) {
    let lateByHours = parseFloat(late) / parseFloat(60)
    const finalHours = hours - lateByHours
    const totalGigFee = gigOffered === 'Hourly' ? parseFloat(fee) * finalHours : parseFloat(fee)
    let totalGigFeeDaily = parseFloat(fee) * postingDays
    const voluntaryFee = 80.19
    const appFee = parseFloat(finalHours * 1.25)
    let feePerHr
    if (gigOffered === 'Hourly' || gigOffered == undefined) {
      feePerHr = parseFloat(fee)
    } else {
      feePerHr = (parseFloat(fee) - parseFloat(voluntaryFee).toFixed(2)) / finalHours
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
      jobsterTotal,
      lateByHours
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
