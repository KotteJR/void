/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import * as nls from '../../../../nls.js';
import { EditorExtensions } from '../../../common/editor.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { Dimension } from '../../../../base/browser/dom.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { URI } from '../../../../base/common/uri.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';

import { mountChatWindow } from './react/out/chat-tsx/index.js'
import { Codicon } from '../../../../base/common/codicons.js';
import { toDisposable } from '../../../../base/common/lifecycle.js';


// A dedicated, full-window chat editor (ChatGPT/Claude style) that opens as a
// normal editor tab. It reuses the same chat engine as the sidebar.

class VoidChatInput extends EditorInput {

	static readonly ID: string = 'workbench.input.void.chat';

	static readonly RESOURCE = URI.from({
		scheme: 'void',
		path: 'chat'
	})
	readonly resource = VoidChatInput.RESOURCE;

	constructor() {
		super();
	}

	override get typeId(): string {
		return VoidChatInput.ID;
	}

	override getName(): string {
		return nls.localize('voidChatInputName', 'Chat');
	}

	override getIcon() {
		return Codicon.commentDiscussion
	}
}


class VoidChatPane extends EditorPane {
	static readonly ID = 'workbench.pane.void.chat';

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super(VoidChatPane.ID, group, telemetryService, themeService, storageService);
	}

	protected createEditor(parent: HTMLElement): void {
		parent.style.height = '100%';
		parent.style.width = '100%';

		const chatElt = document.createElement('div');
		chatElt.style.height = '100%';
		chatElt.style.width = '100%';
		parent.appendChild(chatElt);

		this.instantiationService.invokeFunction(accessor => {
			const disposeFn = mountChatWindow(chatElt, accessor)?.dispose;
			this._register(toDisposable(() => disposeFn?.()))
		});
	}

	layout(dimension: Dimension): void {
		// react handles its own layout (fills 100%)
	}
}

// register chat pane
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(VoidChatPane, VoidChatPane.ID, nls.localize('VoidChatPane', "Chat Pane")),
	[new SyncDescriptor(VoidChatInput)]
);


// open the full-window chat (Cmd/Ctrl+Shift+I)
export const VOID_OPEN_CHAT_WINDOW_ACTION_ID = 'workbench.action.openVoidChatWindow'
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: VOID_OPEN_CHAT_WINDOW_ACTION_ID,
			title: nls.localize2('voidOpenChatWindow', "Open Chat Window"),
			f1: true,
			icon: Codicon.commentDiscussion,
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyI,
				weight: KeybindingWeight.WorkbenchContrib,
			},
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const instantiationService = accessor.get(IInstantiationService);

		// if already open, just focus it
		const openEditors = editorService.findEditors(VoidChatInput.RESOURCE);
		if (openEditors.length > 0) {
			await editorService.openEditor(openEditors[0].editor, openEditors[0].groupId);
			return;
		}

		const input = instantiationService.createInstance(VoidChatInput);
		await editorService.openEditor(input);
	}
})
