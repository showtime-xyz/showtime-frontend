import { ComponentProps } from 'react'
import { Gradient as DripsyGradient } from '@dripsy/gradient'

import { tw as tailwind } from 'design-system/tailwind'

type GradientProps = { tw?: string; borderRadius?: number } & ComponentProps<typeof DripsyGradient>

function Gradient({ sx, tw, borderRadius, colors, locations, ...props }: GradientProps) {
	return (
		<DripsyGradient
			sx={tailwind.style(sx as {}, tw, { borderRadius })}
			colors={colors}
			locations={locations}
			stretch={true}
			{...props}
		/>
	)
}

export { Gradient }
