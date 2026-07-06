/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { useIsDark } from '../util/services.js'
import '../styles.css'
import { SidebarChat } from '../sidebar-tsx/SidebarChat.js'
import ErrorBoundary from '../sidebar-tsx/ErrorBoundary.js'

// A full-window, ChatGPT/Claude-style chat surface. It reuses the same chat
// engine as the sidebar, but centers the conversation in a readable column so
// it feels like a dedicated chat app rather than a narrow side panel.
export const ChatWindow = ({ className }: { className?: string }) => {

	const isDark = useIsDark()
	return <div
		className={`@@void-scope ${isDark ? 'dark' : ''}`}
		style={{ width: '100%', height: '100%' }}
	>
		<div className={`w-full h-full bg-void-bg-2 text-void-fg-1 flex justify-center`}>
			{/* centered readable column, like a normal chat app */}
			<div className={`w-full h-full max-w-3xl`}>
				<ErrorBoundary>
					<SidebarChat />
				</ErrorBoundary>
			</div>
		</div>
	</div>
}
