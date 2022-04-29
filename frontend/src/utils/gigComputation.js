let pronvicialRate = {
  sss: 4.3365385,
  pagibig: 0.7211538,
  philhealth: 0.4807692
}

let ncrRate = {
  sss: 5.7692308,
  pagibig: 1.0096154,
  philhealth: 0.4807692
}

export function calculations(hours, fee, locationRate) {
  let computedFeeByHr = parseFloat(hours * fee)
  let voluntaryFee =
    parseFloat(hours * ncrRate.sss) + parseFloat(hours * ncrRate.pagibig) + parseFloat(hours * ncrRate.philhealth)

  if (locationRate === 'Provincial') {
    voluntaryFee =
      parseFloat(hours * pronvicialRate.sss) +
      parseFloat(hours * pronvicialRate.pagibig) +
      parseFloat(hours * pronvicialRate.philhealth)
  }

  let appFee = parseFloat(hours * 1.25)
  let transactionFee = parseFloat(computedFeeByHr + voluntaryFee + appFee) * 0.1 // 10%
  let grossGigFee = parseFloat(computedFeeByHr + voluntaryFee + appFee + transactionFee)
  let grossVAT = parseFloat(grossGigFee * 0.12) // 12%
  let grossWithHolding = parseFloat(grossGigFee * 0.02) // 2%
  let serviceCost = parseFloat(grossGigFee + grossVAT - grossWithHolding)
  let jobsterTotal = parseFloat(fee + voluntaryFee / hours)

  return {
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
}

export function parcel_calculations(hours, fee) {
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
