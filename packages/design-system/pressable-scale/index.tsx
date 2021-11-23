import React, { ComponentProps, useMemo } from 'react'
import { MotiPressable, mergeAnimateProp } from '@motify/interactions'
import { styled } from 'dripsy'

import { tw as tailwind } from 'design-system/tailwind'

const StyledMotiPressable = styled(MotiPressable)()

export type Props = ComponentProps<typeof StyledMotiPressable> & {
	scaleTo?: number
	tw?: string
}

export function Pressable({ animate, scaleTo = 0.95, tw, sx, ...props }: Props) {
	// TODO: parse tw string to get hover state

	return (
		<StyledMotiPressable
			animate={useMemo(
				() => interaction => {
					'worklet'

					return mergeAnimateProp(interaction, animate, {
						scale: interaction.pressed ? scaleTo : 1,
					})
				},
				[animate, scaleTo]
			)}
			sx={{ ...sx, ...tailwind.style(tw) }}
			{...props}
		/>
	)
}
