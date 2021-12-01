export const formatPrice = price => {
	let [whole, decimal] = price.split('.')

	/**
	 * Check for input type number because of quirky "e" and "." support that causes
	 * onChange to not be emitted causing unexpected behaviors.
	 * src: https://github.com/facebook/react/issues/13752
	 */
	const missingWholeAndPrice = !whole && !price
	const invalidDecimalLength = decimal?.length > 4

	if (missingWholeAndPrice) {
		return price
	}

	if (invalidDecimalLength) {
		decimal = decimal.slice(0, 4)
	}

	return whole ? [whole, decimal].filter(Boolean).join('.') : [whole, decimal].join('.')
}
