export function calculations(hours, fee) {
  let computedFeeByHr = parseFloat(hours * fee)
  let voluntaryFee = parseFloat(computedFeeByHr * 0.0838884) // 0.1109569 v1 // 0.0838884
  let premiumFee = parseFloat(computedFeeByHr * 0.018622) // 0.018622
  let transactionFee = parseFloat(computedFeeByHr + voluntaryFee + premiumFee) * 0.1 // 10%
  let grossGigFee = parseFloat(computedFeeByHr + voluntaryFee + premiumFee + transactionFee)
  let grossVAT = parseFloat(grossGigFee * 0.12) // 12%
  let grossWithHolding = parseFloat(grossGigFee * 0.02) // 2%
  let serviceCost = parseFloat(grossGigFee + grossVAT - grossWithHolding)
  let jobsterTotal = parseFloat(fee + voluntaryFee / hours)

  return {
    computedFeeByHr,
    voluntaryFee,
    premiumFee,
    transactionFee,
    grossGigFee,
    grossVAT,
    grossWithHolding,
    serviceCost,
    jobsterTotal,
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
    serviceCost,
  }
}
