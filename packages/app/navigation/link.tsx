import type { ComponentProps, ComponentType } from 'react'
import { Platform, TextProps, ViewProps, View } from 'react-native'
import { useLinkProps } from '@react-navigation/native'
import NextLink from 'next/link'

import { Pressable, Text } from 'design-system'
import { parseNextPath } from './parse-next-path'

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
	if (Platform.OS === 'web') {
		return (
			<NextLink {...props} href={href} as={as} passHref>
				<Component {...componentProps}>{children}</Component>
			</NextLink>
		)
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const linkProps = useLinkProps({
		to: parseNextPath(as ?? href), // TODO: should this prefer href or as?
	})

	return (
		<Component {...componentProps} {...linkProps}>
			{children}
		</Component>
	)
}

type LinkProps = Props & { viewProps?: ViewProps }

function Link({ viewProps, ...props }: LinkProps) {
	return (
		<LinkCore
			{...props}
			Component={Platform.select({
				web: View,
				default: Pressable as any,
			})}
			componentProps={viewProps}
		/>
	)
}

type TextLinkProps = Props & { textProps?: TextProps }

function TextLink({ textProps, ...props }: TextLinkProps) {
	return <LinkCore {...props} Component={Text} componentProps={textProps} />
}

export { Link, TextLink, LinkCore }
