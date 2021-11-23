import { ComponentProps } from 'react'
import { ScrollView as DripsyScrollView } from 'dripsy'

import { tw as tailwind } from 'design-system/tailwind'

type ScrollViewProps = { tw?: string } & ComponentProps<typeof DripsyScrollView>

function ScrollView({ tw, sx, ...props }: ScrollViewProps) {
	return <DripsyScrollView sx={{ ...sx, ...tailwind.style(tw) }} {...props} />
}

export { ScrollView }
