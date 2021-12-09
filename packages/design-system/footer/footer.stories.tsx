import { Meta } from '@storybook/react'

import { Footer as FooterComponent } from './index'

export default {
	component: FooterComponent,
	title: 'Components/Footer',
} as Meta

export const Footer: React.VFC<{}> = () => <FooterComponent />
