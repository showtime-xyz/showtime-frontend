import crypto from 'crypto'

const SIGNATURE_VALID_FOR = 30

interface SignaturePayload {
	uri: string
	method: string
	body?: string
	timestamp: number
}

function getTimestamp(): number {
	return Math.round(new Date().getTime() / 1000)
}

function validateTimestamp(timestamp: number): boolean {
	return getTimestamp() - timestamp <= SIGNATURE_VALID_FOR
}

function generateSignature({ method, uri, body, timestamp }: SignaturePayload): string {
	return crypto
		.createHmac('sha256', process.env.MOONPAY_WEBHOOK_KEY)
		.update(JSON.stringify({ uri, method, timestamp, body }))
		.digest('hex')
}

export function verifySignature(signature: string, signaturePayload: SignaturePayload): boolean {
	const generatedSignature = generateSignature(signaturePayload)

	if (!crypto.timingSafeEqual(Buffer.from(generatedSignature, 'hex'), Buffer.from(signature, 'hex'))) {
		return false
	}

	if (!validateTimestamp(signaturePayload.timestamp)) {
		return false
	}

	return true
}
