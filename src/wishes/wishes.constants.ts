export enum WishesLimits {
  latest = 40,
  mostCopied = 20,
}

export enum WishErrors {
  NotFound = 'Желание не найдено',
  NotOwner = 'Это не ваше желание',
  CannotChangePrice = 'Нельзя изменить цену: уже собраны средства',
}
