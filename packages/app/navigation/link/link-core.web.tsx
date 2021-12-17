import type { ComponentProps, ComponentType } from 'react'
import NextLink from 'next/link'

type Props = {
	children: React.ReactNode
} & Omit<ComponentProps<typeof NextLink>, 'passHref'>

function LinkCore({
	children,
	href,
	as,
	componentProps,
	Component,
	...props
}: Props & {
	Component: ComponentType<any>
	componentProps?: any
}) {
	return (
		<NextLink {...props} href={href} as={as} passHref>
			<Component {...componentProps}>{children}</Component>
		</NextLink>
	)
}

export type { Props }
export { LinkCore }
