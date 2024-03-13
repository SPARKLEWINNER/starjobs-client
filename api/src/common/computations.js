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
    let computedFeeByHr = parseFloat(finalHours * fee)
    let voluntaryFee = parseFloat(volFee)
    // let basicRate = parseFloat(fee) - voluntaryFee
    // console.log('🚀 ~ file: computations.js:26 ~ basicRate:', basicRate)

    const nightSurge = parseFloat(fee) * 0.1 * parseFloat(nightSurgeHr)
    const gigExtension = parseFloat(fee) * 1.25 * parseFloat(gigExtentionHr)

    //  Comment out old computation
    //   parseFloat(hours * ncrRate.sss) + parseFloat(hours * ncrRate.pagibig) + parseFloat(hours * ncrRate.philhealth)

    // if (locationRate === 'Provincial') {
    //   voluntaryFee =
    //     parseFloat(hours * pronvicialRate.sss) +
    //     parseFloat(hours * pronvicialRate.pagibig) +
    //     parseFloat(hours * pronvicialRate.philhealth)
    // }
    // console.log('lateByHours' + lateByHours)
    // console.log('FEE ' + fee)
    // console.log('volFee ' + voluntaryFee)
    // console.log('premFee ' + premFee)
    // console.log('nightSurgeHr ' + nightSurgeHr)
    // console.log('nightSurgeHr  nightSurgeHr ' + nightSurgeHr)
    // console.log('nightSurge  ' + nightSurge)

    // console.log('gigExtentionHr gigExtentionHr  ' + gigExtentionHr)
    // console.log('gigExtentionHr ' + gigExtension)

    // console.log('holidaySurge ' + holidaySurge)
    // console.log('holiday ' + holiday)

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
    const totalGigFee = parseFloat(fee)
    let totalGigFeeDaily = parseFloat(fee) * postingDays
    let totalGigFeeHourly = parseFloat(fee) * hours
    let transactionFee
    let voluntaryFee = 0.0
    const appFee = parseFloat(finalHours * 1.25)
    let feePerHr
    if (gigOffered === 'Hourly' || gigOffered == undefined) {
      feePerHr = parseFloat(fee)
    } else {
      feePerHr = (parseFloat(fee) - parseFloat(voluntaryFee).toFixed(2)) / finalHours
    }

    const computedFeeByHr = totalGigFee
    const computedDaily = gigOffered === 'Daily' ? totalGigFeeDaily - 80.19 : 0
    const computedHourly = gigOffered === 'Hourly' ? totalGigFeeHourly - 80.19 : 0

    if (gigOffered === 'By-the-job') {
      transactionFee = parseFloat(totalGigFee + appFee) * 0.1
    } else if (gigOffered === 'Hourly') {
      transactionFee = parseFloat(totalGigFeeHourly + appFee) * 0.1
    } else if (gigOffered === 'Daily') {
      transactionFee = parseFloat(totalGigFeeDaily + appFee) * 0.1
    } else {
      transactionFee = 0
    }
    const grossGigFee = totalGigFee + appFee + parseFloat(transactionFee)
    const grossGigDaily = gigOffered === 'Daily' ? totalGigFeeDaily + appFee + parseFloat(transactionFee) : 0
    const grossGigHourly = gigOffered === 'Hourly' ? totalGigFeeHourly + appFee + parseFloat(transactionFee) : 0

    const grossVAT =
      gigOffered === 'Daily'
        ? grossGigDaily * 0.12
        : gigOffered === 'Hourly'
        ? grossGigHourly * 0.12
        : grossGigFee * 0.12
    const grossWithHolding =
      gigOffered === 'Daily'
        ? grossGigDaily * 0.02
        : gigOffered === 'Hourly'
        ? grossGigHourly * 0.02
        : grossGigFee * 0.02

    const serviceCost =
      gigOffered === 'Daily'
        ? grossGigDaily + grossVAT - grossWithHolding
        : gigOffered === 'Hourly'
        ? grossGigHourly + grossVAT - grossWithHolding
        : grossGigFee + grossVAT - grossWithHolding

    const jobsterTotal =
      gigOffered === 'Daily' ? totalGigFeeDaily : gigOffered === 'Hourly' ? totalGigFeeHourly : parseFloat(fee)

    return {
      computedFeeByHr,
      computedDaily,
      computedHourly,
      voluntaryFee,
      appFee,
      transactionFee,
      grossGigFee,
      grossGigDaily,
      grossGigHourly,
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
